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

  public static validApplicationLink(value: string) {
    // From: https://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url
    // What: valid url regular expression
    // When: 2019-12-24
    if (/(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(value)) {
      return;
    }

    if (/mailto:[0-9]+/.test(value)) {
      return;
    }

    throw new Error(`Invalid mailto or HTTP[S] application link: ${value}`);
  }
}
