import { AppDataSource } from '../../src/config';

export const seedDB = async () => {
  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);
};

export const clearDB = async () => {
  const entities = AppDataSource.entityMetadatas;
  const promises: Promise<void>[] = [];

  entities.forEach((entity) => {
    const repository = AppDataSource.getRepository(entity.name);
    promises.push(repository.clear());
  });

  await Promise.all(promises);
};
