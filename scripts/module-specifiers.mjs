// Finds the module specifiers a TypeScript or JavaScript file names, with the
// position of each one's text inside its quotes. It replaces TypeScript 5's
// `ts.preProcessFile`, which TypeScript 7 no longer ships.
//
// A small tokenizer skips comments, strings, template text and regular
// expressions, so text that only looks like an import is left alone. Then a
// string literal counts as a specifier when the tokens before it are one of:
//
//   from "x"              import … from, export … from, import type … from
//   import "x"            side-effect import
//   import("x")           dynamic import, and the `import("x")` type
//   require("x")          CommonJS and `import x = require("x")`
//   declare module "x"    ambient module or module augmentation
//
// No other construct puts a string straight after `from`, `import`,
// `require(` or `declare module` in valid code, so these need no parser.
//
// Known differences from `ts.preProcessFile`. Over this repo's source and
// built declarations both return the same specifiers, apart from the first:
//
// - An ambient `declare module "*.css"` in a file with no imports or exports
//   is returned as a specifier. `preProcessFile` listed it separately, and
//   neither caller acts on a pattern like that.
// - `export * as ns from "x"` is found. `preProcessFile` missed it.
// - A call after `.` or `?.`, such as `foo.require("x")` or
//   `foo?.import("x")`, is a member call and is not counted.
//   `preProcessFile` counted some of these.
// - JSX text is read as code, as it was by `preProcessFile`. A quote in it
//   (`<p>Don't</p>`) opens a string that runs to the end of the line, and
//   `<p>import from "./x"</p>` is a false positive. The dependency test then
//   fails loudly on the bogus package name rather than missing an import.
// - A specifier with an escape sequence is returned as written, escapes and
//   all; `preProcessFile` returned the cooked value.
//
// A template with no substitution is a specifier like a string
// (``import(`./x`)``), and a leading `#!` line is skipped, as in TypeScript.
// Strings, line comments and regexes end at any line terminator, U+2028 and
// U+2029 included, which is where TypeScript's scanner ends them.

const IDENTIFIER_START = /[A-Za-z_$\u0080-￿]/;
const IDENTIFIER_PART = /[\w$\u0080-￿]/;
const LINE_TERMINATOR = /[\n\r\u2028\u2029]/;

// After these keywords an expression starts, so a `/` opens a regex.
const KEYWORDS_BEFORE_EXPRESSION = new Set([
  "await",
  "case",
  "delete",
  "do",
  "else",
  "extends",
  "in",
  "instanceof",
  "new",
  "of",
  "return",
  "throw",
  "typeof",
  "void",
  "yield",
]);

const is = (token, type, value) =>
  token !== undefined && token.type === type && token.value === value;

/**
 * The significant tokens of `text`: identifiers and keywords, string
 * literals and templates with no substitution (both type "string"), the end
 * of any other template, numbers, and single punctuation characters.
 * Comments and regular expressions produce no token.
 *
 * @param {string} text
 * @returns {Array<{ type: "word" | "string" | "template" | "number" | "punct", value: string, start: number, end: number }>}
 */
function tokenize(text) {
  const tokens = [];
  // One entry per open `{`: true when it opened a template's `${`.
  const braces = [];
  let i = 0;

  const regexAllowed = () => {
    const last = tokens.at(-1);
    if (!last) return true;
    if (last.type !== "word" && last.type !== "punct") return false;
    if (last.type === "word") {
      // `obj.in / 2`: a keyword used as a property name ends an expression.
      if (is(tokens.at(-2), "punct", ".")) return false;
      return KEYWORDS_BEFORE_EXPRESSION.has(last.value);
    }
    return !/[)\]}]/.test(last.value);
  };

  // Reads template text from `i` up to the closing backtick or a `${`.
  // `start` is set only for a template that has had no substitution yet.
  const readTemplate = (start) => {
    while (i < text.length) {
      const ch = text[i];
      if (ch === "\\") i += 2;
      else if (ch === "`") {
        // A template with no substitution reads like a string literal.
        tokens.push(
          start === undefined
            ? { type: "template", value: "", start: i, end: i }
            : { type: "string", value: text.slice(start, i), start, end: i },
        );
        i++;
        return;
      } else if (ch === "$" && text[i + 1] === "{") {
        i += 2;
        braces.push(true);
        return;
      } else i++;
    }
  };

  // A hashbang is a comment on the first line only.
  if (text.startsWith("#!")) {
    while (i < text.length && !LINE_TERMINATOR.test(text[i])) i++;
  }

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];

    if (/\s/.test(ch)) {
      i++;
    } else if (ch === "/" && next === "/") {
      while (i < text.length && !LINE_TERMINATOR.test(text[i])) i++;
    } else if (ch === "/" && next === "*") {
      const close = text.indexOf("*/", i + 2);
      i = close === -1 ? text.length : close + 2;
    } else if (ch === '"' || ch === "'") {
      // A string ends at its closing quote or, unterminated, at the line end.
      const open = i++;
      while (
        i < text.length &&
        text[i] !== ch &&
        !LINE_TERMINATOR.test(text[i])
      ) {
        i += text[i] === "\\" ? 2 : 1;
      }
      const start = open + 1;
      const end = Math.min(i, text.length);
      tokens.push({
        type: "string",
        value: text.slice(start, end),
        start,
        end,
      });
      if (text[i] === ch) i++;
    } else if (ch === "`") {
      i++;
      readTemplate(i);
    } else if (ch === "/" && regexAllowed()) {
      // A regex ends at an unescaped `/` outside a character class.
      let inClass = false;
      i++;
      while (i < text.length && !LINE_TERMINATOR.test(text[i])) {
        const c = text[i];
        if (c === "\\") i++;
        else if (c === "[") inClass = true;
        else if (c === "]") inClass = false;
        else if (c === "/" && !inClass) break;
        i++;
      }
      // Flags follow only a closing `/`. An unterminated regex stops at the
      // line end, so the next line is read as code.
      if (text[i] === "/") {
        i++;
        while (i < text.length && IDENTIFIER_PART.test(text[i])) i++;
      }
    } else if (IDENTIFIER_START.test(ch)) {
      const start = i;
      while (i < text.length && IDENTIFIER_PART.test(text[i])) i++;
      tokens.push({ type: "word", value: text.slice(start, i), start, end: i });
    } else if (/\d/.test(ch)) {
      const start = i;
      while (i < text.length && /[\w.]/.test(text[i])) i++;
      tokens.push({
        type: "number",
        value: text.slice(start, i),
        start,
        end: i,
      });
    } else {
      if (ch === "{") braces.push(false);
      if (ch === "}" && braces.pop()) {
        // The `}` that closes a template's `${` resumes its text.
        i++;
        readTemplate();
        continue;
      }
      tokens.push({ type: "punct", value: ch, start: i, end: i + 1 });
      i++;
    }
  }
  return tokens;
}

/**
 * Every module specifier in `text`, in source order. `start` and `end` bound
 * the specifier's text inside its quotes.
 *
 * @param {string} text
 * @returns {Array<{ specifier: string, start: number, end: number }>}
 */
export function moduleSpecifiers(text) {
  const tokens = tokenize(text);
  const found = [];
  tokens.forEach((token, index) => {
    if (token.type !== "string") return;
    const [a, b, c] = [tokens[index - 1], tokens[index - 2], tokens[index - 3]];
    // `foo.import("x")` and `foo.require("x")` are member calls.
    const call =
      is(a, "punct", "(") &&
      (is(b, "word", "import") || is(b, "word", "require")) &&
      !is(c, "punct", ".");
    const named =
      is(a, "word", "from") ||
      (is(a, "word", "import") && !is(b, "punct", ".")) ||
      call ||
      (is(a, "word", "module") && is(b, "word", "declare"));
    if (named) {
      found.push({
        specifier: token.value,
        start: token.start,
        end: token.end,
      });
    }
  });
  return found;
}
