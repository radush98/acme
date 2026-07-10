import type {
  FileNode,
  StoredFileNode,
  UpdateFileNodeInput,
} from "./types";
import {
  fromStoredNode,
  getFormatFromFile,
  toStoredNode,
} from "./utils";

const DB_NAME = "acme-file-storage";
const DB_VERSION = 1;
const NODES_STORE = "nodes";
const BLOBS_STORE = "blobs";

export class FileStorageService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  init(): Promise<void> {
    if (typeof indexedDB === "undefined") {
      return Promise.reject(
        new Error("FileStorageService is only available in the browser."),
      );
    }

    if (this.db) {
      return Promise.resolve();
    }

    if (!this.initPromise) {
      this.initPromise = this.openDatabase();
    }

    return this.initPromise;
  }

  async upload(file: File, parentId: string | null = null): Promise<FileNode> {
    await this.init();
    await this.assertValidParent(parentId);

    const now = new Date();
    const node: FileNode = {
      id: crypto.randomUUID(),
      name: file.name,
      type: "file",
      parentId,
      size: file.size,
      format: getFormatFromFile(file),
      createdAt: now,
      updatedAt: now,
    };

    await this.runTransaction(["nodes", "blobs"], "readwrite", (tx) => {
      tx.objectStore(NODES_STORE).put(toStoredNode(node));
      tx.objectStore(BLOBS_STORE).put({ id: node.id, blob: file });
    });

    return node;
  }

  async createFolder(
    name: string,
    parentId: string | null = null,
  ): Promise<FileNode> {
    await this.init();
    await this.assertValidParent(parentId);

    const now = new Date();
    const node: FileNode = {
      id: crypto.randomUUID(),
      name,
      type: "folder",
      parentId,
      createdAt: now,
      updatedAt: now,
    };

    await this.runTransaction([NODES_STORE], "readwrite", (tx) => {
      tx.objectStore(NODES_STORE).put(toStoredNode(node));
    });

    return node;
  }

  async update(id: string, input: UpdateFileNodeInput): Promise<FileNode> {
    await this.init();

    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Node "${id}" was not found.`);
    }

    if (input.parentId !== undefined) {
      await this.assertValidParent(input.parentId);

      if (input.parentId === id) {
        throw new Error("A node cannot be moved into itself.");
      }

      if (existing.type === "folder" && input.parentId) {
        const isDescendant = await this.isDescendantOf(input.parentId, id);
        if (isDescendant) {
          throw new Error("A folder cannot be moved into its own descendant.");
        }
      }
    }

    const updated: FileNode = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };

    await this.runTransaction([NODES_STORE], "readwrite", (tx) => {
      tx.objectStore(NODES_STORE).put(toStoredNode(updated));
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.init();

    const existing = await this.getById(id);
    if (!existing) {
      return;
    }

    const allNodes = await this.getAllStoredNodes();
    const idsToDelete = this.collectDescendantIds(allNodes, id);

    await this.runTransaction(["nodes", "blobs"], "readwrite", (tx) => {
      const nodesStore = tx.objectStore(NODES_STORE);
      const blobsStore = tx.objectStore(BLOBS_STORE);

      for (const nodeId of idsToDelete) {
        nodesStore.delete(nodeId);
        blobsStore.delete(nodeId);
      }
    });
  }

  async getById(id: string): Promise<FileNode | null> {
    await this.init();

    const stored = await this.request<FileNode | null>(
      this.db!.transaction(NODES_STORE, "readonly").objectStore(NODES_STORE).get(id),
      (result) => (result ? fromStoredNode(result as StoredFileNode) : null),
    );

    return stored;
  }

  async getChildren(parentId: string | null): Promise<FileNode[]> {
    await this.init();

    const nodes = await this.getAllNodes();
    return nodes
      .filter((node) => node.parentId === parentId)
      .sort((left, right) => {
        if (left.type !== right.type) {
          return left.type === "folder" ? -1 : 1;
        }

        return left.name.localeCompare(right.name, undefined, {
          sensitivity: "base",
        });
      });
  }

  async getBreadcrumbs(folderId: string | null): Promise<FileNode[]> {
    await this.init();

    if (folderId === null) {
      return [];
    }

    const nodes = await this.getAllNodes();
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const breadcrumbs: FileNode[] = [];

    let currentId: string | null = folderId;

    while (currentId) {
      const current = nodeMap.get(currentId);
      if (!current) {
        break;
      }

      breadcrumbs.unshift(current);
      currentId = current.parentId;
    }

    return breadcrumbs;
  }

  async getBlob(id: string): Promise<Blob | null> {
    await this.init();

    const record = await this.request(
      this.db!.transaction(BLOBS_STORE, "readonly").objectStore(BLOBS_STORE).get(id),
      (result): { id: string; blob: Blob } | undefined =>
        result as { id: string; blob: Blob } | undefined,
    );

    return record?.blob ?? null;
  }

  async getPreviewUrl(id: string): Promise<string | null> {
    const blob = await this.getBlob(id);
    return blob ? URL.createObjectURL(blob) : null;
  }

  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  private openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(NODES_STORE)) {
          const nodesStore = db.createObjectStore(NODES_STORE, {
            keyPath: "id",
          });
          nodesStore.createIndex("parentId", "parentId", { unique: false });
          nodesStore.createIndex("type", "type", { unique: false });
        }

        if (!db.objectStoreNames.contains(BLOBS_STORE)) {
          db.createObjectStore(BLOBS_STORE, { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.db.onversionchange = () => {
          this.db?.close();
          this.db = null;
          this.initPromise = null;
        };
        resolve();
      };

      request.onerror = () => {
        reject(request.error ?? new Error("Failed to open IndexedDB."));
      };
    });
  }

  private async assertValidParent(parentId: string | null): Promise<void> {
    if (parentId === null) {
      return;
    }

    const parent = await this.getById(parentId);
    if (!parent) {
      throw new Error(`Parent folder "${parentId}" was not found.`);
    }

    if (parent.type !== "folder") {
      throw new Error(`Parent "${parentId}" is not a folder.`);
    }
  }

  private async isDescendantOf(
    potentialDescendantId: string,
    ancestorId: string,
  ): Promise<boolean> {
    const nodes = await this.getAllNodes();
    const descendants = this.collectDescendantIds(
      nodes.map(toStoredNode),
      ancestorId,
    );

    return descendants.includes(potentialDescendantId);
  }

  private collectDescendantIds(
    allNodes: StoredFileNode[],
    rootId: string,
  ): string[] {
    const ids = new Set<string>([rootId]);
    let changed = true;

    while (changed) {
      changed = false;

      for (const node of allNodes) {
        if (
          node.parentId !== null &&
          ids.has(node.parentId) &&
          !ids.has(node.id)
        ) {
          ids.add(node.id);
          changed = true;
        }
      }
    }

    return [...ids];
  }

  private async getAllStoredNodes(): Promise<StoredFileNode[]> {
    await this.init();

    return this.request(
      this.db!.transaction(NODES_STORE, "readonly").objectStore(NODES_STORE).getAll(),
      (result): StoredFileNode[] => (result as StoredFileNode[]) ?? [],
    );
  }

  private async getAllNodes(): Promise<FileNode[]> {
    const storedNodes = await this.getAllStoredNodes();
    return storedNodes.map(fromStoredNode);
  }

  private runTransaction(
    storeNames: string[],
    mode: IDBTransactionMode,
    operation: (transaction: IDBTransaction) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeNames, mode);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed."));
      tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted."));

      try {
        operation(tx);
      } catch (error) {
        tx.abort();
        reject(error);
      }
    });
  }

  private request<T>(
    request: IDBRequest,
    transform: (result: unknown) => T,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(transform(request.result));
      request.onerror = () =>
        reject(request.error ?? new Error("IndexedDB request failed."));
    });
  }
}
