import { addRxPlugin, createRxDatabase, type RxDatabase, type RxCollection } from "rxdb/plugins/core";
import { RxDBMigrationSchemaPlugin } from "rxdb/plugins/migration-schema";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";

addRxPlugin(RxDBMigrationSchemaPlugin);

export type SavedBlockDoc = {
  id: string;
  blockId: string;
  name: string;
  description: string;
  version: number;
  tree: string;
  createdAt: number;
  updatedAt: number;
};

const savedBlockSchema = {
  title: "saved block schema",
  version: 2,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    blockId: { type: "string", maxLength: 100 },
    name: { type: "string" },
    description: { type: "string" },
    version: { type: "number" },
    tree: { type: "string" },
    createdAt: { type: "number" },
    updatedAt: { type: "number" },
  },
  required: ["id", "blockId", "name", "description", "version", "tree", "createdAt", "updatedAt"],
  indexes: ["blockId"],
} as const;

type DatabaseCollections = {
  "saved-blocks": RxCollection<SavedBlockDoc>;
};

type PlaygroundDatabase = RxDatabase<DatabaseCollections>;

let dbPromise: Promise<PlaygroundDatabase> | null = null;

export function getDatabase(): Promise<PlaygroundDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Database requires a browser environment"));
  }
  if (!dbPromise) {
    dbPromise = createDatabase();
  }
  return dbPromise;
}

async function createDatabase(): Promise<PlaygroundDatabase> {
  const db = await createRxDatabase<DatabaseCollections>({
    name: "playground",
    storage: getRxStorageLocalstorage(),
  });

  await db.addCollections({
    "saved-blocks": {
      schema: savedBlockSchema,
      migrationStrategies: {
        1: (oldDoc: Record<string, unknown>) => {
          oldDoc.blockId = oldDoc.id;
          oldDoc.version = 1;
          return oldDoc;
        },
        2: (oldDoc: Record<string, unknown>) => {
          oldDoc.description = "";
          return oldDoc;
        },
      },
    },
  });

  return db;
}
