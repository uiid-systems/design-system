// Lists every name a barrel exports, types included, by parsing its source.
//
// A runtime `Object.keys` check sees values only, so a type-only export can be
// added or dropped without a barrel test noticing. This parses the barrel with
// oxc, through the `parseSync` Vite re-exports, and walks its top-level
// statements. It needs no build output and no compiler API.
//
// Handled: `export { … }` lists (with `type` and `as`, and string names),
// declarations (every declarator, destructuring included), `export namespace`,
// `export default`, and `export *` / `export type *`, with or without `as ns`.
// `export *` from a relative module is followed; `default` is never re-exported
// through it, as in ES modules.
//
// Not handled, and thrown on rather than skipped: `export *` from a package,
// `export =`, `export as namespace`, `export import A = B`, `declare module "x"`,
// an export statement or declaration kind not listed above, and a file oxc
// reports parse errors for. A name merged from two declarations, such as a
// function and a namespace, is listed once.
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { parseSync } from "vite";

// A `.js` module with a `.d.ts` beside it is read through the declarations,
// which carry its types as well as its values.
const CANDIDATES = [".ts", ".tsx", ".d.ts", "/index.ts", "/index.tsx"];

function resolveModule(from, specifier) {
  const base = resolve(dirname(from), specifier.replace(/\.js$/, ""));
  for (const suffix of CANDIDATES) {
    if (existsSync(base + suffix)) return base + suffix;
  }
  throw new Error(`barrelExports: cannot resolve "${specifier}" from ${from}`);
}

const unsupported = (file, what) =>
  new Error(`barrelExports: unsupported ${what} in ${file}`);

const nameOf = (node) => (node.type === "Literal" ? node.value : node.name);

/** The names a binding pattern introduces: `a`, `{ a, b: c }`, `[d, ...e]`. */
function bindingNames(pattern, file) {
  switch (pattern.type) {
    case "Identifier":
      return [pattern.name];
    case "ObjectPattern":
      return pattern.properties.flatMap((property) =>
        bindingNames(
          property.type === "RestElement" ? property.argument : property.value,
          file,
        ),
      );
    case "ArrayPattern":
      return pattern.elements
        .filter(Boolean)
        .flatMap((element) => bindingNames(element, file));
    case "RestElement":
      return bindingNames(pattern.argument, file);
    case "AssignmentPattern":
      return bindingNames(pattern.left, file);
    default:
      throw unsupported(file, `binding pattern ${pattern.type}`);
  }
}

function declarationNames(declaration, file) {
  switch (declaration.type) {
    case "VariableDeclaration":
      return declaration.declarations.flatMap((declarator) =>
        bindingNames(declarator.id, file),
      );
    case "FunctionDeclaration":
    case "TSDeclareFunction":
    case "ClassDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSInterfaceDeclaration":
    case "TSEnumDeclaration":
      return [declaration.id.name];
    case "TSModuleDeclaration":
      if (declaration.id.type !== "Identifier") {
        throw unsupported(file, `declare module ${declaration.id.raw}`);
      }
      return [declaration.id.name];
    default:
      throw unsupported(file, `export of ${declaration.type}`);
  }
}

function moduleExports(file, cache, inProgress) {
  if (cache.has(file)) return cache.get(file);
  // A re-export cycle contributes nothing new on its second visit.
  if (inProgress.has(file)) return new Set();
  inProgress.add(file);

  const { program, errors } = parseSync(file, readFileSync(file, "utf8"));
  if (errors.length > 0) {
    throw new Error(
      `barrelExports: cannot parse ${file}: ${errors[0].message}`,
    );
  }

  const names = new Set();
  for (const statement of program.body) {
    switch (statement.type) {
      case "ExportNamedDeclaration":
        if (statement.declaration) {
          for (const name of declarationNames(statement.declaration, file)) {
            names.add(name);
          }
        }
        for (const specifier of statement.specifiers) {
          names.add(nameOf(specifier.exported));
        }
        break;
      case "ExportDefaultDeclaration":
        names.add("default");
        break;
      case "ExportAllDeclaration": {
        if (statement.exported) {
          names.add(nameOf(statement.exported));
          break;
        }
        const specifier = statement.source.value;
        if (!specifier.startsWith(".")) {
          throw unsupported(file, `export * from "${specifier}"`);
        }
        const target = resolveModule(file, specifier);
        for (const name of moduleExports(target, cache, inProgress)) {
          if (name !== "default") names.add(name);
        }
        break;
      }
      default:
        if (/^(TS)?Export|^TSNamespaceExport/.test(statement.type)) {
          throw unsupported(file, statement.type);
        }
        if (
          statement.type === "TSImportEqualsDeclaration" &&
          statement.isExport
        ) {
          throw unsupported(file, "export import");
        }
    }
  }

  inProgress.delete(file);
  cache.set(file, names);
  return names;
}

/** Every name the module at `file` exports, values and types, sorted. */
export function barrelExports(file) {
  return [...moduleExports(resolve(file), new Map(), new Set())].sort();
}
