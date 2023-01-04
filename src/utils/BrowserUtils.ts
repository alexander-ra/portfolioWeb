import Utils from "./Utils";
import {UIOrientation} from "../models/common/UIOrientation";
import {Page} from "../models/common/Page";
import {CircleMenuStates} from "../models/landing/CircleMenuStates";
import ResourceInfo from "../asset-manifest.json";

export default class BrowserUtils {

    public static isTouchable(): boolean {
        return "ontouchstart" in document.documentElement;
    }

    public static isMobile(): boolean {
        return BrowserUtils.isTouchable();
    }

    public static getOrientation(innerWidth?: number, innerHeight?: number): UIOrientation {
        const width = innerWidth || window.innerWidth;
        const height = innerHeight || window.innerHeight;
        const orientationType: UIOrientation = ((width > height) && ((width / height) >= 1.05)) ? UIOrientation.LANDSCAPE : UIOrientation.PORTRAIT;
        return orientationType;
    }


    private static getScreenInfo(): any {
        const w = (window.screen.width > window.screen.height) ? window.screen.height : window.screen.width;
        const h = (window.screen.width > window.screen.height) ? window.screen.width : window.screen.height;

        return {
            width: w,
            height: h,
            wh: w / h,
            ratio: window.devicePixelRatio
        };
    }

    public static async loadResources(resourceNames: string[]): Promise<void> {
        const requests = resourceNames.map(image => {
            const path = ResourceInfo["files"][`static/media/${image}`];
            return new Promise<void>((resolve, reject) => {
                const request = new XMLHttpRequest();
                request.open("GET", path, true);
                request.onload = () => {
                    if (request.status === 200) {
                        resolve();
                    } else {
                        reject(new Error(`Failed to load resource: ${request.statusText}`));
                    }
                }
                request.onerror = () => {
                    reject(new Error("An error occurred while loading the resource"));
                }
                request.send();
            });
        });

        await Promise.all(requests);
    }

}