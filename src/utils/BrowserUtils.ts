import Utils from "./Utils";
import {UIOrientation} from "../components/core/UIOrientation";
import {Page} from "../models/common/Page";
import {CircleMenuStates} from "../models/landing/CircleMenuStates";
import image1 from "../resources/categoryImages/chess/home.jpg";
import image2 from "../resources/categoryImages/client/home.jpg";
import image3 from "../resources/categoryImages/experience/home.jpg";

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
        const orientationType: UIOrientation = ((width > height) && ((width / height) >= 1.1)) ? UIOrientation.LANDSCAPE : UIOrientation.PORTRAIT;
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

    public static async loadResources(resourcePaths: string[]): Promise<void> {
        const requests = resourcePaths.map(path => {
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