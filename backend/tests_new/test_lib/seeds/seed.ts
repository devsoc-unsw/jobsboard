
import { AppDataSource } from '../../../src/config';
import Logger from '../../../src/logging';

export const seedDB = async (name: string, seeder?: () => Promise<void>) => {
  Logger.Info(`Start seeding databse using SEED=${name}`);

  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);

  if (seeder !== undefined) {
    await seeder();
  }

  Logger.Info(`Completed Seeding databse using SEED=${name}`);
};