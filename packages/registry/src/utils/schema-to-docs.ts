import { z } from "zod";

import type {
  ComponentEntry,
  PropDocumentation,
  ComponentDocumentation,
} from "../types";

/**
 * Get the TypeScript type representation from a Zod schema.
 */
function getTypeFromSchema(schema: z.ZodType): string {
  // Handle optional wrapper first
  if (schema instanceof z.ZodOptional) {
    return getTypeFromSchema(schema.unwrap() as z.ZodTypeAny);
  }

  // Handle nullable wrapper
  if (schema instanceof z.ZodNullable) {
    return `${getTypeFromSchema(schema.unwrap() as z.ZodTypeAny)} | null`;
  }

  // Handle default wrapper
  if (schema instanceof z.ZodDefault) {
    return getTypeFromSchema(schema.unwrap() as z.ZodTypeAny);
  }

  // Primitive types
  if (schema instanceof z.ZodString) return "string";
  if (schema instanceof z.ZodNumber) return "number";
  if (schema instanceof z.ZodBoolean) return "boolean";
  if (schema instanceof z.ZodAny) return "any";
  if (schema instanceof z.ZodUnknown) return "unknown";
  if (schema instanceof z.ZodVoid) return "void";
  if (schema instanceof z.ZodUndefined) return "undefined";
  if (schema instanceof z.ZodNull) return "null";
  if (schema instanceof z.ZodNever) return "never";
  if (schema instanceof z.ZodBigInt) return "bigint";
  if (schema instanceof z.ZodDate) return "Date";
  if (schema instanceof z.ZodSymbol) return "symbol";

  // Enum types
  if (schema instanceof z.ZodEnum) {
    const values = schema.options as string[];
    return values.map((v) => `"${v}"`).join(" | ");
  }

  // Literal types
  if (schema instanceof z.ZodLiteral) {
    const values = schema.def.values as unknown[];
    const value = values[0];
    if (typeof value === "string") return `"${value}"`;
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return String(value);
    return String(value);
  }

  // Union types
  if (schema instanceof z.ZodUnion) {
    const options = schema.def.options as z.ZodType[];
    return options.map((opt) => getTypeFromSchema(opt)).join(" | ");
  }

  // Array types
  if (schema instanceof z.ZodArray) {
    const elementType = getTypeFromSchema(schema.element as z.ZodTypeAny);
    return `${elementType}[]`;
  }

  // Object types
  if (schema instanceof z.ZodObject) {
    return "object";
  }

  // Record types
  if (schema instanceof z.ZodRecord) {
    const valueType = getTypeFromSchema(schema.valueType as z.ZodTypeAny);
    return `Record<string, ${valueType}>`;
  }

  // Tuple types
  if (schema instanceof z.ZodTuple) {
    const items = schema.def.items as z.ZodType[];
    return `[${items.map((item) => getTypeFromSchema(item)).join(", ")}]`;
  }

  // Function types
  if (schema instanceof z.ZodFunction) {
    return "(...args: any[]) => any";
  }

  // Promise types
  if (schema instanceof z.ZodPromise) {
    return `Promise<${getTypeFromSchema(schema.unwrap() as z.ZodTypeAny)}>`;
  }

  // Lazy types
  if (schema instanceof z.ZodLazy) {
    return "lazy";
  }

  return "unknown";
}

/**
 * Get enum values from a Zod enum schema.
 */
function getEnumValues(schema: z.ZodType): string[] | undefined {
  // Unwrap optional/nullable/default
  if (schema instanceof z.ZodOptional) {
    return getEnumValues(schema.unwrap() as z.ZodTypeAny);
  }
  if (schema instanceof z.ZodNullable) {
    return getEnumValues(schema.unwrap() as z.ZodTypeAny);
  }
  if (schema instanceof z.ZodDefault) {
    return getEnumValues(schema.unwrap() as z.ZodTypeAny);
  }

  if (schema instanceof z.ZodEnum) {
    return schema.options as string[];
  }

  // Check if it's a union of literals (common pattern)
  if (schema instanceof z.ZodUnion) {
    const options = schema.def.options as z.ZodType[];
    const allLiterals = options.every((opt) => opt instanceof z.ZodLiteral);
    if (allLiterals) {
      return options.map((opt) => {
        const values = (opt as z.ZodLiteral<unknown>).def.values as unknown[];
        return String(values[0]);
      });
    }
  }

  return undefined;
}

/**
 * Check if a schema field is required (not optional).
 */
function isRequired(schema: z.ZodType): boolean {
  return !(schema instanceof z.ZodOptional);
}

/**
 * Get the description from a Zod schema (from .describe()).
 */
function getDescription(schema: z.ZodType): string | undefined {
  return schema.description;
}

/**
 * Extract prop documentation from a Zod object schema.
 */
export function extractPropsFromSchema(
  schema: z.ZodType,
  defaults?: Record<string, unknown>
): PropDocumentation[] {
  // Unwrap any wrappers to get to the object
  let objectSchema: z.ZodTypeAny = schema;
  if (objectSchema instanceof z.ZodOptional) {
    objectSchema = objectSchema.unwrap();
  }
  if (objectSchema instanceof z.ZodNullable) {
    objectSchema = objectSchema.unwrap();
  }
  if (objectSchema instanceof z.ZodDefault) {
    objectSchema = objectSchema.unwrap();
  }

  if (!(objectSchema instanceof z.ZodObject)) {
    return [];
  }

  const shape = objectSchema.shape as Record<string, z.ZodType>;
  const props: PropDocumentation[] = [];

  for (const [name, propSchema] of Object.entries(shape)) {
    props.push({
      name,
      type: getTypeFromSchema(propSchema),
      required: isRequired(propSchema),
      description: getDescription(propSchema),
      defaultValue: defaults?.[name],
      enumValues: getEnumValues(propSchema),
    });
  }

  return props;
}

/**
 * Generate full documentation for a component entry.
 */
export function generateComponentDocs(
  entry: ComponentEntry
): ComponentDocumentation {
  return {
    name: entry.name,
    package: entry.package,
    description: entry.description,
    category: entry.category,
    hasChildren: entry.hasChildren,
    props: extractPropsFromSchema(entry.propsSchema, entry.defaults),
  };
}
