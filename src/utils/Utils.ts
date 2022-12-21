export default class Utils {

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

    public static isMapNotEmpty(val: Map<any, any>): boolean {
        return typeof val !== "undefined" && val !== null && (val.size > 0 || Array.from(val.keys()).length > 0);
    }

    public static isMapEmpty(val: Map<any, any>): boolean {
        return typeof val === "undefined" || val === null || val.size === 0 || Array.from(val.keys()).length === 0;
    }
}

export { Utils };