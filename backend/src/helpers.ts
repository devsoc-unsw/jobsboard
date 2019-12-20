export default class Helpers {
  public static requireParameters(result: any): void {
    // if a single required parameter is undefined, the result field should evaluate to
    // undefined
    if (result === undefined) {
      throw new Error("Missing parameters.");
    }
    if (result.trim() === "") {
      throw new Error("Parameter is an empty string.");
    }
    if (/^\s+$/.test(result)) {
      throw new Error("Parameter is just whitespace.");
    }
  }
}
