import { Table, UpdateSpec } from "dexie";

export abstract class Model<T, K extends keyof T> {
  table: Table<T, NonNullable<T[K]>>;

  constructor(table: Table<T, NonNullable<T[K]>>) {
    this.table = table;
  }

  async getById(id: NonNullable<T[K]>): Promise<T | undefined> {
    return this.table.get(id);
  }

  async getAll(): Promise<T[]> {
    return this.table.toArray();
  }

  async update(id: NonNullable<T[K]>, updates: Partial<T>): Promise<T | undefined> {
    await this.table.update(id, updates as UpdateSpec<T>);
    return this.getById(id);
  }

  async delete(id: NonNullable<T[K]>): Promise<void> {
    await this.table.delete(id);
  }
}
