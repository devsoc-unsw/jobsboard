import { AppDataSource } from "../../src/config";

export const seedDB = async () => {
  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);
}

export const clearDB = async () => {
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repo = AppDataSource.getRepository(entity.name);
    await repo.clear();
  }
}
