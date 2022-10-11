export default class Utils {

    public static equal(obj1: any, obj2: any): boolean {
        if ((!obj1 && !obj2) || (obj1 && !obj2) || (!obj1 && obj2)) {
            return false;
        }
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    public static equalStrings(s1: string, s2: string): boolean {
        if ((!s1 && !s2) || (s1 && !s2) || (!s1 && s2)) {
            return false;
        }
        return s1 === s2;
    }

    public static toString(obj: any): string | null {
        if (obj) {
            return JSON.stringify(obj);
        }
        return null;
    }

    public static deserializeBigDecimal(parsedJson: any): number | null {
        if (typeof parsedJson === "undefined") {
            return null;
        }
        let val: number = parsedJson;
        let scale: number = 0;
        if (typeof parsedJson.val !== "undefined") {
            val = parsedJson.val;
            if (typeof parsedJson.scale !== "undefined") {
                scale = parsedJson.scale;
            }
        }
        return val / Math.pow(10, scale);
    }

    public static getByKey(key: any, obj: any): any {
        if (key && obj) {
            Object.keys(obj).forEach((k) => {
                if (k === key) {
                    return obj[k];
                }
            });
        }
        return null;
    }

    public static getByValue(value: any, obj: any): any {
        if (value && obj) {
            Object.keys(obj).forEach((key) => {
                const val = obj[key];
                if (val === value) {
                    return key;
                }
            });
        }
        return null;
    }

    public static getKey<K, V>(map: Map<any, any>, value: V): K | null {
        if (Utils.isNotNull(map)) {
            const i: number = Array.from(map.values()).indexOf(value);
            return i > -1 ? Array.from(map.keys())[i] : null;
        } else {
            return null;
        }
    }

    public static compareUndefined(o1: any, o2: any): number {
        if (Utils.isNotNull(o1) && Utils.isNull(o2)) {
            return -1;
        }
        if (Utils.isNull(o1) && Utils.isNotNull(o2)) {
            return 1;
        }
        return 0;
    }

    public static compareNumber(o1: number, o2: number): number {
        const result: number = Utils.compareUndefined(o1, o2);
        if (result === 0 && Utils.isNotNull(o1) && Utils.isNotNull(o2)) {
            return o1 === o2 ? 0 : o1 < o2 ? -1 : 1;
        }
        return result;
    }

    public static compareString(o1: string, o2: string): number {
        const result: number = Utils.compareUndefined(o1, o2);
        if (result === 0 && Utils.isNotNull(o1) && Utils.isNotNull(o2)) {
            return o1 < o2 ? -1 : (o1 > o2 ? 1 : 0);
        }
        return result;
    }

    public static compareStringIgnoreCase(o1: string, o2: string): number {
        const result: number = Utils.compareUndefined(o1, o2);
        if (result === 0 && Utils.isNotNull(o1) && Utils.isNotNull(o2)) {
            const lc1: string = o1.toLowerCase();
            const lc2: string = o2.toLowerCase();
            return lc1 < lc2 ? -1 : (lc1 > lc2 ? 1 : 0);
        }
        return result;
    }

    public static compareBoolean(o1: boolean, o2: boolean): number {
        const result: number = Utils.compareUndefined(o1, o2);
        if (result === 0 && Utils.isNotNull(o1) && Utils.isNotNull(o2)) {
            if (o1 && !o2) {
                return -1;
            } else if (!o1 && o2) {
                return 1;
            }
        }
        return result;
    }

    public static compareArrayLength<T>(o1: T[], o2: T[]): number {
        const result: number = Utils.compareUndefined(o1, o2);
        if (result === 0 && Utils.isNotNull(o1) && Utils.isNotNull(o2)) {
            return o1.length < o2.length ? -1 : (o1.length > o2.length ? 1 : 0);
        }
        return result;
    }

    public static spliceAt<T>(arr: T[], condition: (t: T) => boolean): void {
        if (Utils.isArrayNotEmpty(arr) && Utils.isNotNull(condition)) {
            for (let i: number = 0; i < arr.length; i++) {
                if (condition(arr[i])) {
                    arr.splice(i, 1);
                    break;
                }
            }
        }
    }

    public static getUrlParam(name: string, url?: string): string {
        // @ts-ignore
        const results: RegExpExecArray = new RegExp("[\?&]" + name + "=([^&#]*)").exec(Utils.isNotNull(url) ? url : window.location.href);
        if (results && results.length > 0) {
            return decodeURI(results[1]);
        }
        return "";
    }

    /**
     * Returns an Array of all url parameters
     * @return {[Array]} [Key Value pairs form URL]
     */
    public static getAllUrlParams(url: string): Map<string, string> {
        const keyPairs: Map<string, string> = new Map();
        const params: string[] = url.substring(1).split("&");
        for (let i = params.length - 1; i >= 0; i--) {
            const keyValPair: string[] = params[i].split("=");
            keyPairs.set(keyValPair[0], keyValPair[1]);
        }
        return keyPairs;
    }

    public static getWindowParam(name: string, windowParams: string): string {
        if (Utils.isNotEmpty(windowParams)) {
            const params: string[] = windowParams.split("&");
            if (Utils.isArrayNotEmpty(params)) {
                for (let i = 0; i < params.length; i++) {
                    const result: string[] = params[i].split("=");
                    if (result[0] === name) {
                        return result[1];
                    }
                }
            }
        }
        return "";
    }

    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static True(val: boolean): boolean {
        return Utils.isNotNull(val) && val;
    }

    public static False(val: boolean): boolean {
        return Utils.isNotNull(val) && !val;
    }

    public static isNotEmpty(val: string): boolean {
        return typeof val !== "undefined" && val !== null && val.length > 0;
    }

    public static isNotNull(val: any): boolean {
        return typeof val !== "undefined" && val !== null;
    }

    public static isNull(val: any): boolean {
        return typeof val === "undefined" || val === null;
    }

    public static isArrayNotEmpty(val: any[]): boolean {
        return typeof val !== "undefined" && val !== null && val.length > 0;
    }

    public static isArrayEmpty(val: any[]): boolean {
        return typeof val === "undefined" || val === null || val.length === 0;
    }

    public static getDiffInArrays(firstArray: any[], secondArray: any[]): any[] | null {
        if (Utils.isArrayNotEmpty(firstArray) && Utils.isArrayNotEmpty(secondArray)) {
            return firstArray.filter((idx: any) => secondArray.indexOf(idx) === -1);
        }

        return null;
    }

    public static isEqualArrays(firstArray: any[], secondArray: any[]): boolean {
        if (Utils.isArrayEmpty(firstArray) || Utils.isArrayEmpty(secondArray)) {
            return false;
        }

        const isTheyEqual: boolean = firstArray.filter((idx: any) => !(secondArray.indexOf(idx) !== -1)).length === 0;

        return isTheyEqual;
    }

    public static isObjNotEmpty(val: any): boolean {
        return typeof val !== "undefined" && val !== null && Object.keys(val).length !== 0 && val.constructor === Object;
    }

    public static isObjEmpty(val: any): boolean {
        return typeof val === "undefined" || val === null || (Object.keys(val).length === 0 && val.constructor === Object);
    }

    public static has(array: any[], val: any): boolean {
        if (Utils.isArrayNotEmpty(array) && Utils.isNotNull(val)) {
            for (let i = 0; i < array.length; i++) {
                if (array[i] === val) {
                    return true;
                }
            }
        }
        return false;
    }

    public static isMapNotEmpty(val: Map<any, any>): boolean {
        return typeof val !== "undefined" && val !== null && (val.size > 0 || Array.from(val.keys()).length > 0);
    }

    public static isMapEmpty(val: Map<any, any>): boolean {
        return typeof val === "undefined" || val === null || val.size === 0 || Array.from(val.keys()).length === 0;
    }

    public static isEmpty(val: string): boolean {
        return typeof val === "undefined" || val === null || val.length === 0;
    }

    public static checkNotNull<T>(reference: T, msg?: string): T {
        if (Utils.isNull(reference)) {
            throw new ReferenceError(msg);
        }
        return reference;
    }

    /**
     * Removes an item from an array, returns true if successful
     * @param arr
     * @param item
     */
    public static remove<T>(arr: T[], item: T): boolean {
        if (Utils.isArrayNotEmpty(arr) && item) {
            for (let i: number = 0; i < arr.length; i++) {
                if (arr[i] === item) {
                    arr.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    public static mergeMaps<K, V>(...maps: Array<Map<K, V>>): Map<K, V> {
        const result: Map<K, V> = new Map();
        if (Utils.isArrayNotEmpty(maps)) {
            maps.forEach((map: Map<K, V>) => {
                if (Utils.isMapNotEmpty(map)) {
                    map.forEach((v: V, k: K) => {
                        result.set(k, v);
                    });
                }
            });
        }
        return result;
    }

    public static isObject(item: any) {
        return (item && typeof item === "object" && !Array.isArray(item));
    }

    /*
        make a deep merge of
     */
    public static mergeDeep(target: { [x: string]: any }, ...sources: any[]): any {
        if (!sources.length) {
            return target;
        }
        const source = sources.shift();

        if (Utils.isObject(target) && Utils.isObject(source)) {
            for (const key in source) {
                if (Utils.isObject(source[key])) {
                    if (!target[key]) {
                        Object.assign(target, { [key]: {} });
                    }
                    Utils.mergeDeep(target[key], source[key]);
                } else if (Array.isArray(source[key])) {
                    Object.assign(target, { [key]: source[key] });
                } else if (typeof source[key] !== "undefined") {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return Utils.mergeDeep(target, ...sources);
    }

    public static toFixed(v: number, fraction?: number): number {
        return Utils.isNotNull(v) ? parseFloat(v.toFixed(Utils.isNotNull(fraction) ? fraction : 2)) : v;
    }

    public static isValidJSON(obj: any): boolean {
        if (typeof obj !== "string") {
            return false;
        }
        try {
            JSON.parse(obj);
        } catch (error) {
            return false;
        }
        return true;
    }

    public static isFunction(param: any): boolean {
        return param && typeof param === "function";
    }

    private static getCookie(name: string): string {
        const decodedCookie: string = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c: string = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length + 1, c.length);
            }
        }
        return "";
    }

    /**
     * Checks if a given string contains only numbers, dots and spaces
     * @param value string to be tested
     */
    public static containsOnlyNumbers = (value: string): boolean => /^\d*\.?(?:\d{1,2})?$/.test(value);

    /**
     * Returns only numeric values out of a given string
     * @param value string to be stripped
     */
    public static getOnlyNumbers = (value: string) => value.replace(/[^0-9. ]+/g, "");


    /**
     * @param value
     */
    public static convertStringToType(value: any): any {
        try {
            return (new Function(`return ${value};`))();
        } catch (e) {
            return value;
        }
    }

    public static hasParentWithMatchingSelector(target: Node | null, selector: string): boolean {
        const potentialParents = document.querySelectorAll<HTMLElement>(selector);
        let hasMatch: boolean = false;
        potentialParents.forEach((el: HTMLElement) => {
            hasMatch = el.contains(target);
        });
        return hasMatch;
    }
}

export { Utils };