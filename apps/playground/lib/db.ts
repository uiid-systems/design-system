import { createRxDatabase, type RxDatabase, type RxCollection } from "rxdb/plugins/core";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";

export type SavedBlockDoc = {
  id: string;
  name: string;
  tree: string;
  createdAt: number;
  updatedAt: number;
};

const savedBlockSchema = {
  title: "saved block schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    name: { type: "string" },
    tree: { type: "string" },
    createdAt: { type: "number" },
    updatedAt: { type: "number" },
  },
  required: ["id", "name", "tree", "createdAt", "updatedAt"],
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
    },
  });

  return db;
}
