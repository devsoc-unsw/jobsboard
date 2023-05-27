import Secrets from '../../../src/secrets';
import AdminAccount from '../../../src/entity/admin_account';

export const createAdmin = (name: string, password: string) => {
  const admin = new AdminAccount();
  admin.username = name;
  admin.hash = Secrets.hash(password);
  return admin;
};

export const createDefaultAdmin = () => createAdmin('admin', 'incorrect pony plug paperclip');
