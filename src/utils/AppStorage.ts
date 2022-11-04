export default class AppStorage {

    public static setStorage(key: StorageKey, value: any): void {
        window.localStorage.setItem(key, value);
    }

    public static getStorage(key: StorageKey): any {
        return window.localStorage.getItem(key);
    }

    public static deleteStorage(key: StorageKey): any {
        window.localStorage.removeItem(key);
    }
}

export enum StorageKey {
    THEME = "THEME",
    CHESS_GAME_ID = "CHESS_GAME_ID",
    PLAYER_AVATAR = "PLAYER_AVATAR",
}

export { AppStorage };