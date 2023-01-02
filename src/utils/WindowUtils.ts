import {ThemeType} from "../models/common/ThemeType";
import store from "../reducers/store";
import {setUiOrientation, setWindowSize} from "../reducers/window/windowAction";
import BrowserUtils from "./BrowserUtils";
import {LayoutType} from "../models/common/LayoutType";
import {UIOrientation} from "../models/common/UIOrientation";
import {Page} from "../models/common/Page";

export class WindowUtils {
    static setLayoutType(layoutType: LayoutType) {
        if (layoutType === LayoutType.NATIVE) {
            this.addToClassList('layout-native');
            this.removeFromClassList('layout-mobile-portrait');
            this.removeFromClassList('layout-mobile-landscape');
            this.removeFromClassList('layout-tablet-portrait');
            this.removeFromClassList('layout-tablet-landscape');
        } else if (layoutType === LayoutType.MOBILE_PORTRAIT) {
            this.addToClassList('layout-mobile-portrait');
            this.removeFromClassList('layout-native');
            this.removeFromClassList('layout-mobile-landscape');
            this.removeFromClassList('layout-tablet-portrait');
            this.removeFromClassList('layout-tablet-landscape');
        } else if (layoutType === LayoutType.MOBILE_LANDSCAPE) {
            this.addToClassList('layout-mobile-landscape');
            this.removeFromClassList('layout-native');
            this.removeFromClassList('layout-mobile-portrait');
            this.removeFromClassList('layout-tablet-portrait');
            this.removeFromClassList('layout-tablet-landscape');
        } else if (layoutType === LayoutType.TABLET_PORTRAIT) {
            this.addToClassList('layout-tablet-portrait');
            this.removeFromClassList('layout-native');
            this.removeFromClassList('layout-mobile-portrait');
            this.removeFromClassList('layout-mobile-landscape');
            this.removeFromClassList('layout-tablet-landscape');
        } else if (layoutType === LayoutType.TABLET_LANDSCAPE) {
            this.addToClassList('layout-tablet-landscape');
            this.removeFromClassList('layout-native');
            this.removeFromClassList('layout-mobile-portrait');
            this.removeFromClassList('layout-mobile-landscape');
            this.removeFromClassList('layout-tablet-portrait');
        }
    }

    private static addToClassList = (classToAdd: string) => document.body.classList.add(classToAdd);
    private static removeFromClassList = (classToRemove: string) => document.body.classList.remove(classToRemove);

    public static setTheme(theme: ThemeType): void {
        if (theme === ThemeType.LIGHT) {
            this.addToClassList('light-theme');
            this.removeFromClassList('dark-theme');
        } else {
            this.addToClassList('dark-theme');
            this.removeFromClassList('light-theme');
        }
    }

    public static updateWindowClasses(element: Window): void {
        const layout = store.getState().windowReducer.layoutType;
        store.dispatch(setWindowSize(element.innerWidth, element.innerHeight));
        let uiOrientation = BrowserUtils.getOrientation();
        if (layout !== LayoutType.NATIVE) {
            if (layout === LayoutType.MOBILE_PORTRAIT || layout === LayoutType.TABLET_PORTRAIT) {
                uiOrientation = UIOrientation.PORTRAIT;
            } else if (layout === LayoutType.MOBILE_LANDSCAPE || layout === LayoutType.TABLET_LANDSCAPE) {
                uiOrientation = UIOrientation.LANDSCAPE;
            }
            store.dispatch(setUiOrientation(uiOrientation));
        } else {
            this.addToClassList('layout-native');
            this.removeFromClassList('layout-mobile-portrait');
            this.removeFromClassList('layout-mobile-landscape');
            this.removeFromClassList('layout-tablet-portrait');
            this.removeFromClassList('layout-tablet-landscape');
        }

        if (uiOrientation === UIOrientation.LANDSCAPE) {
            this.addToClassList("vw-landscape");
            this.removeFromClassList("vw-portrait");
        } else {
            this.addToClassList("vw-portrait");
            this.removeFromClassList("vw-landscape");

        }

        if (!BrowserUtils.isTouchable()) {
            this.addToClassList("vw-no-touch");
        }

        if (BrowserUtils.isMobile() || layout !== LayoutType.NATIVE) {
            if (BrowserUtils.isMobile()) {
                this.addToClassList("vw-mobile-real");
            }
            this.addToClassList("vw-mobile");
        } else {
            this.removeFromClassList("vw-mobile-real");
            this.removeFromClassList("vw-mobile");
        }
    }

    // Function that reads current url and returns it in array
    public static getURL(): string[] {
        let url = window.location.pathname;
        let urlArray = url.split("/").filter(part => part.length > 0).map(part => part.toLowerCase());
        return urlArray;
    }

    // Get page from string
    public static getPageFromURL(): Page {
        const urlArray = this.getURL();

        let page: Page;
        switch (urlArray[0]) {
            case Page.CHESS_DEMO.toLowerCase():
                return Page.CHESS_DEMO;
            case Page.CLIENT_APPROACH.toLowerCase():
                return Page.CLIENT_APPROACH;
            case Page.PAST_EXPERIENCE.toLowerCase():
                return Page.PAST_EXPERIENCE;
            default:
                return Page.LANDING;
        }
    }
}