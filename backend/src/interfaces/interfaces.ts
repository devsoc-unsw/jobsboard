export interface JobBase {
  id: number,
  role: string,
  applicationLink: string,
  description: string,
  company: CompanyBase
}

export interface CompanyBase {
  name: string,
  description: string,
  location: string,
}
