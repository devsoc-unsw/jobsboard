// auth token data structures
interface IToken {
  id: number;
  type: AccountType;
}

// differentiating between account types
enum AccountType {
  Admin,
  Student,
  Company,
}

export { IToken, AccountType };

export default class Auth {
  // Student-based authentication functions

  public static authenticateStudent(zID: string, password: string): boolean {
    // TODO: Implement
    return true;
  }

  // Company-based authentication functions
}
