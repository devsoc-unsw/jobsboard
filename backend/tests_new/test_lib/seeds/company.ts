import CompanyAccount from '../../../src/entity/company_account';
import Company from '../../../src/entity/company';
import Secrets from '../../../src/secrets';

export const createCompnay = (
  username: string,
  password: string,
  verified: boolean,
  name?: string,
  location?: string,
) => {
  const companyAccount = new CompanyAccount();
  companyAccount.username = username;
  companyAccount.hash = Secrets.hash(password);
  companyAccount.verified = verified;

  const company = new Company();
  company.name = name || username;
  company.location = location || 'Sydney';

  companyAccount.company = company;

  return companyAccount;
};

export const createVerifiedCompanyAccount = () => createCompnay('verified-company@gmail.com', 'password', true, 'verified-company', 'Sydney');
