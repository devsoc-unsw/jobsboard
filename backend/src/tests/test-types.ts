export interface AdminAccountInterface {
  username: string;
  password: string;
}

export interface CompanyAccountInterface {
  username: string;
  password: string;
  verified: boolean;
  name: string;
  location: string;
}

export interface JobInterface {
  title: string;
  company_username: string;
  role: string;
  description: string;
  application_link: string;
  approved: boolean;
  hidden: boolean;
  mode: string;
  student_demographic: string[];
  type: string;
  working_rights: string[];
  wam_requirements: string;
  additional_info: string;
  paid: boolean;
  expiry: string;
}
