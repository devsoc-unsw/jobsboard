import Secrets from "../../../src/secrets";
import AdminAccount from "../../../src/entity/admin_account";

export const createAdmin = (name: string, password: string) => {
  const admin = new AdminAccount();
  admin.username = 'admin';
  admin.hash = Secrets.hash('incorrect pony plug paperclip');
  return admin;
}

export const createDefaultAdmin = () => {
  return createAdmin('admin', "incorrect pony plug paperclip");
}

