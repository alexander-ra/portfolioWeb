import Utils from "./Utils";

export default class StorageUtil {

    public static setStorage(key: StorageKey, value: any): void {
        window.localStorage.setItem(key, value);
    }

    public static getStorage(key: StorageKey): any {
        return window.localStorage.getItem(key);
    }

    public static deleteStorage(key: StorageKey): any {
        window.localStorage.removeItem(key);
    }

    public static saveArrayToLocalStorage(key: StorageArrayKey, array: any[]) {
        if (Utils.isArrayEmpty(array)) {
            localStorage.setItem(key, JSON.stringify([]));
        }
        localStorage.setItem(key, JSON.stringify(array));
    }

    public static getArrayFromLocalStorage(key: StorageArrayKey) {
        let array = []
        try {
            array = JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.warn("Error parsing array from local storage", e);
        }
        return array;
    }

    public static addItemToArrayInLocalStorage(key: StorageArrayKey, item: any) {
        let array = StorageUtil.getArrayFromLocalStorage(key);
        if (Utils.isArrayEmpty(array)) {
            array = [];
        }
        array.push(item);
        StorageUtil.saveArrayToLocalStorage(key, array);
    }

}

export enum StorageKey {
    THEME = "THEME",
    CHESS_GAME_ID = "CHESS_GAME_ID",
    PLAYER_AVATAR = "PLAYER_AVATAR"
}

export enum StorageArrayKey {
    VISITED_SECTIONS = "VISITED_SECTIONS",
}

export { StorageUtil };