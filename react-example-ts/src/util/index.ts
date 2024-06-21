import CryptoJS from "crypto-js";

export function throttle<T extends Function>(func: T, wait = 500): (...args: any[]) => void {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function throttled(this: any, ...args: any[]) {
    const context = this;
    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, args);
        timeout = null;
      }, wait);
    }
  };
}
type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

export const debounce = <T extends (...args: any[]) => any>(fn: T, ms = 300):DebouncedFunction<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const randomCode = () => {
  return (Math.random() * 100000).toString(16).replace(".", "d");
}

export const calculateHash = (text:string) => {
  const hash = CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
  return hash;
};