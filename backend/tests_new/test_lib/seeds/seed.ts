import { AppDataSource } from '../../../src/config';
import { LogModule, Logger } from '../../../src/logging';

const LM = new LogModule('TEST_SEEDER');

export const seedDB = async (name: string, seeder?: () => Promise<void>) => {
  Logger.Info(LM, `Start seeding databse using SEED=${name}`);

  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);

  if (seeder !== undefined) {
    await seeder();
  }

  Logger.Info(LM, `Completed Seeding databse using SEED=${name}`);
};
