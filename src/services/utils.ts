import { autoinject } from "aurelia-framework";
import { getAddress } from "ethers/lib/utils";

@autoinject
export class Utils {

  public static sleep(milliseconds: number): Promise<any> {
    return new Promise((resolve: (args: any[]) => void): any => setTimeout(resolve, milliseconds));
  }

  public static smallHexString(str: string): string {
    if (!str) {
      return "";
    }
    const len = str.length;
    return `${str.slice(0, 6)}...${str.slice(len - 4, len)}`;
  }

  /**
   * Converts a hash into a string representation of a hex number
   * @param str
   * @returns
   */
  public static asciiToHex(str = ""): string {
    const res = [];
    const { length: len } = str;
    for (let n = 0, l = len; n < l; n++) {
      const hex = Number(str.charCodeAt(n)).toString(16);
      res.push(hex);
    }
    return `0x${res.join("")}`;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // public static getObjectKeys(obj: any): Array<string> {
  //   const temp = [];
  //   for (const prop in obj) {
  //     if (obj.hasOwnProperty(prop)) {
  //       temp.push(prop);
  //     }
  //   }
  //   return temp;
  // }

  /**
   * run a timer after a count of milliseconds greater than the 32-bit max that chrome can handle
   * @param date
   * @param func
   */
  // public static runTimerAtDate(date: Date, func: () => void): void {
  //   const now = (new Date()).getTime();
  //   const then = date.getTime();
  //   const diff = Math.max((then - now), 0);
  //   if (diff > 0x7FFFFFFF) { // setTimeout limit is MAX_INT32=(2^31-1)
  //     setTimeout(() => { Utils.runTimerAtDate(date, func); }, 0x7FFFFFFF);
  //   } else {
  //     setTimeout(func, diff);
  //   }
  // }

  public static goto(where: string, newTab = true): void {
    if (newTab) {
      window.open(where, "_blank", "noopener noreferrer");
    } else {
      window.location.assign(where);
    }
  }

  public static toBoolean(value?: string | boolean): boolean {
    if (!value) {
      return false;
    }

    if (typeof(value) === "string") {
      switch (value.toLocaleLowerCase()) {
        case "true":
        case "1":
        case "on":
        case "yes":
          return true;
        default:
          return false;
      }
    } else {
      return value;
    }
  }

  public static waitUntilTrue(test: () => Promise<boolean> | boolean, timeOut = 1000): Promise<void> {
    return new Promise((resolve, reject) => {
      const timerId = setInterval(async () => {
        if (await test()) { clearTimeout(timerId); return resolve(); }
      }, 100);
      setTimeout(() => {
        clearTimeout(timerId);
        return reject(new Error("Test timed out.."));
      }, timeOut);
    });
  }

  // eslint-disable-next-line no-useless-escape
  private static pattern = new RegExp(/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?%#[\]@!\$&'\(\)\*\+,;=.]+$/i);

  public static isValidUrl(str: string, emptyOk = false): boolean {
    return (emptyOk && (!str || !str.trim())) || (str && Utils.pattern.test(str));
  }

  public static isValidEmail(email: string, emptyOk = false): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (emptyOk && (!email || !email.trim())) || (email && re.test(String(email).toLowerCase()));
  }

  public static isAddress(address: string, emptyOk = false): boolean {
    try {
      return (emptyOk && (!address || !address.trim())) || (address && !!getAddress(address));
    } catch (e) { return false; }
  }

  /**
   * Convert string of individual UTF-8 bytes into a regular UTF-8 string
   * @param str1 individual UTF-8 bytes as a string
   * @returns
   */
  public static toAscii(str1: string): string {
    const hex = str1.toString();
    let str = "";
    for (let n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static extractExceptionMessage(ex: any): string {
    return ex?.error?.message ?? ex?.reason ?? ex?.message ?? ex;
  }

  public static allowableNumericInput(e: KeyboardEvent): boolean {
    return (!isNaN(Number(e.key)) ||
      ([
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "Backspace", "Delete", "Tab", "Escape", "Enter", "NumLock", "CapsLock", "Shift", "Control",
        "ArrowHome", "ArrowEnd", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
        "Cut", "Copy", "Clear", "Paste", "CrSel", "EraseEof", "Insert", "Redo", "Undo",
      ].indexOf(e.key) !== -1) ||
      ((["a", "x", "c", "v"].indexOf(e.key) !== -1) && (e.ctrlKey === true || e.metaKey === true))
    );
  }

  public static replaceAll(str: string, what: string, that: string): string {
    /**
     * when we can use es2021, we can use the native replaceAll function
     */
    return str.split(what).join(that);
  }

  /**
   * remove precision from the decimals part.  Need this because toFixed adds phantom numbers with decimals > 16
   * @param num
   * @returns
   */
  public static truncateDecimals(num: number, decimals: number): number {
    if ((num === undefined) || (num === null) || Number.isInteger(num) || isNaN(num)) {
      return num;
    }
    const parts = num.toString().split(".");
    return Number(`${parts[0]}.${parts[1].slice(0, decimals)}`);
  }

  public static getCssVariable(
    varName: string,
    documentElement = document.documentElement): string {

    return getComputedStyle(documentElement)?.getPropertyValue(varName);
  }

  public static setCssVariable(
    varName: string,
    value: string,
    documentElement = document.documentElement): void {

    documentElement?.style.setProperty(varName, value);
  }

}
