export default class Helpers {
  public static requireParameters(result: any): void {
    // if a single required parameter is undefined, the result field should evaluate to
    // undefined
    if (result === undefined) {
      throw new Error("Missing parameters.");
    }
  }
}
