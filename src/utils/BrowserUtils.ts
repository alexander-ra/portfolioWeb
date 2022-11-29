import * as isAndroid from "@braintree/browser-detection/is-android";
import * as isIos from "@braintree/browser-detection/is-ios";
import isIE from "@braintree/browser-detection/is-ie";
import isEdge from "@braintree/browser-detection/is-edge";
import isChrome from "@braintree/browser-detection/is-chrome";
import MobileDetect from "mobile-detect";
import Utils from "./Utils";
import { UIOrientation } from "../components/core/UIOrientation";

export enum deviceFamily {
    "windows" = "windows",
    "linux" = "linux",
    "mac os x" = "mac",
    "android" = "android",
    "ios" = "ios",
}

enum DeviceType {
    "tablet" = "tablet",
    "smartphone" = "smartphone",
    "pc" = "pc"
}

enum ClientType {
    WEB_STANDALONE_MOBILE = 23,
    WEB_STANDALONE_DESKTOP = 24,
    WEB_DESKTOP = 25,
    WEB_MOBILE = 26
}

const PLATFORM_TYPE_WEB_MOBILE = "mobile";
const PLATFORM_TYPE_WEB_DESKTOP = "web";

export default class BrowserUtils {

    private static  _window: any = window;
    private static  _document: any = document;
    private static _md = new MobileDetect(window.navigator.userAgent);

    public static isBorderImageSupported() {
        return window.getComputedStyle(document.body).borderImageSource !== undefined;
    }

    public static getParentWindow(): Window {
        if (window !== window.parent) {
            return window.parent;
        } else if (window !== window.opener) {
            return window.opener;
        }
        return window.parent;
    }

    public static isWebClient(clientPlatform: number): boolean {
        return Utils.isNotNull(Utils.isNotNull(ClientType[clientPlatform]));
    }

    public static isIOS(): boolean {
        // Second part is to catch sneaky IPADs that have user agents like desktop
        return isIos() || (BrowserUtils.isTouchable() && this._md.match("Mac"));
    }

    public static isIPhoneX(): boolean {
        const screenInfo = BrowserUtils.getScreenInfo();

        return this.isIOS() && screenInfo.wh === 1125 / 2436 && screenInfo.ratio === 3;
    }

    public static isIPhone5(): boolean {
        const screenInfo = BrowserUtils.getScreenInfo();

        return BrowserUtils.isIOS() && (screenInfo.wh === 640 / 1136) && screenInfo.ratio === 2;
    }

    public static  isIPhone6_8(): boolean {
        const screenInfo = BrowserUtils.getScreenInfo();

        let iPhone6to8 = false;
        if (BrowserUtils.isIOS()) {
            // iPhone 6/6s/7/8
            if (screenInfo.wh === 750 / 1334 && screenInfo.ratio === 2) {
                iPhone6to8 = true;
            }
            // iPhone 6/6s/7 Plus/8 Plus
            if (screenInfo.wh === 1242 / 2208 && screenInfo.ratio === 3) {
                iPhone6to8 = true;
            }
            // iPhone 6/6s/7 Plus/8 Plus (Display Zoom)
            if (screenInfo.wh === 1125 / 2001 && screenInfo.ratio === 3) {
                iPhone6to8 = true;
            }
        }

        return iPhone6to8;
    }

    public static isTouchable(): boolean {
        return "ontouchstart" in document.documentElement;
    }

    public static isMobile(): boolean {
        return BrowserUtils.isTouchable();
    }

    public static isIpad(): boolean {
        return /\WiPad\W/i.test(navigator.userAgent);
    }

    // possible library https://github.com/hgoebl/mobile-detect.js
    public static isTablet(): boolean {
        return BrowserUtils.isMobile() && Utils.isNotNull(this._md.tablet());
    }

    // TODO: suppose to detect all tablets and desktop devices with big widget size
    public static isBigScreen(): boolean {
        const isDesktopWithBigFrame: boolean = (!BrowserUtils.isMobile() && (window.innerWidth >= 600 && window.innerHeight >= 600));

        return BrowserUtils.isTablet()
            || isDesktopWithBigFrame;
    }

    // Internet Explorer 6-11
    public static isIE(): boolean {
        return isIE();
    }

    // Edge 20+
    public static isEdge(): boolean {
        return isEdge();
    }

    // Chrome 1+
    public static isChrome(): boolean {
        return isChrome();
    }

    public static getOrientation(): UIOrientation {
        const orientationType: UIOrientation = ((window.innerWidth > window.innerHeight) && ((window.innerWidth / window.innerHeight) > 1.1)) ? UIOrientation.LANDSCAPE : UIOrientation.PORTRAIT;
        return orientationType;
    }

    public static isPageVisible(): boolean {
        return document.visibilityState === "visible";
    }

    public static getDeviceFamily(): string {
        return Utils.isNotNull(this.getDeviceFamilyFromURL()) ? this.getDeviceFamilyFromURL() : this.getDeviceFamilyFromUA();
    }

    /**
     * If there is deviceFamily parameter in URL it takes priority over the recognized one by the user agent
     */
    private static getDeviceFamilyFromURL(): string {
        const osNameParam: string = Utils.getUrlParam("deviceFamily");

        if (Utils.isNotNull(deviceFamily[osNameParam])) {
            return deviceFamily[osNameParam];
        }

        return null;
    }

    /**
     * Extract device name from user agent of the browser.
     * May not be available if the app is launched from web view in native app and UA is overwritten.
     */
    private static getDeviceFamilyFromUA(): string {
        for (const os in deviceFamily) {
            if (Utils.isNotNull(os)) {
                let pattern: string = os;
                switch (os) {
                    case deviceFamily.ios:
                        pattern = "iphone|ipad|ipod";
                        break;
                }
                if (RegExp(pattern).test(navigator.userAgent.toLowerCase())) {
                    return deviceFamily[os];
                }
            }
        }

        return null;
    }

    public static getDeviceType(): string {
        let deviceType: string = null;

        if (this.isMobile()) {
            if (this.isBigScreen()) {
                deviceType = DeviceType.tablet;
            } else {
                deviceType = DeviceType.smartphone;
            }
        } else {
            deviceType = DeviceType.pc;
        }

        return deviceType;
    }

    public static getDeviceOsVersion(): string {
        let osVersion: string = null;
        let pattern: RegExp;

        switch (this.getDeviceFamily()) {
            case deviceFamily.android:
                pattern = new RegExp(/Android (\d+(?:\.\d+){1,2})/);
                if (RegExp(pattern).test(navigator.userAgent)) {
                    osVersion = RegExp(pattern).exec(navigator.userAgent)[0];
                }
                break;
            case deviceFamily.ios:
                pattern = new RegExp(/OS (\d+.\d+)/);
                if (RegExp(pattern).test(navigator.userAgent)) {
                    osVersion = RegExp(pattern).exec(navigator.userAgent)[0];
                }
                break;
            case deviceFamily["mac os x"]:
                pattern = new RegExp(/OS X (\d+.\d+.\d+)/);
                if (RegExp(pattern).test(navigator.userAgent)) {
                    osVersion = RegExp(pattern).exec(navigator.userAgent)[0];
                }
                break;
            case deviceFamily.windows:
                pattern = new RegExp(/Windows NT (\d+\.\d+)/);
                if (RegExp(pattern).test(navigator.userAgent)) {
                    osVersion = RegExp(pattern).exec(navigator.userAgent)[0];
                }
                break;
            case deviceFamily.linux:
                pattern = new RegExp(/(Fedora|Ubuntu|Linux (.+_\d+|i\d+))/);
                if (RegExp(pattern).test(navigator.userAgent)) {
                    osVersion = RegExp(pattern).exec(navigator.userAgent)[0];
                }
                break;
        }

        return osVersion;
    }

    public static getDeviceName(): string {
        let deviceName: string = null;
        let pattern: RegExp;
        const isPlatformiPad: boolean = !!navigator.platform && /iPad/.test(navigator.platform);
        const isAgentiPad: boolean = /iPad/.test(navigator.userAgent);

        switch (this.getDeviceFamily()) {
            case deviceFamily.android:
                pattern = new RegExp(/Android (\d+(?:\.\d+){1,2}); (.*) Build/);
                if (RegExp(pattern).test(navigator.userAgent)) {
                    deviceName = RegExp(pattern).exec(navigator.userAgent)[2];
                }
                break;
            case deviceFamily.ios:
                if (this.isIPhone5()) {
                    deviceName = "IPhone5";
                } else if (this.isIPhoneX()) {
                    deviceName = "IPhoneX";
                } else if (this.isIPhone6_8()) {
                    deviceName = "IPhone6_8";
                } else if (isPlatformiPad || isAgentiPad) {
                    deviceName = "iPad";
                }
                break;
        }

        return deviceName;
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

    public static fullScreenApiEnabled(): boolean {
        return BrowserUtils.isMobile() && !BrowserUtils.isIOS() && BrowserUtils.fullScreenApi.fullscreenEnabled;
    }

    public static fullScreenApi = (() => {
        const key = {
            fullscreenEnabled: 0,
            fullscreenElement: 1,
            requestFullscreen: 2,
            exitFullscreen: 3,
            fullscreenchange: 4,
            fullscreenerror: 5
        };
        const webkit = [ "webkitFullscreenEnabled", "webkitFullscreenElement", "webkitRequestFullscreen", "webkitExitFullscreen", "webkitfullscreenchange", "webkitfullscreenerror" ];
        const moz = [ "mozFullScreenEnabled", "mozFullScreenElement", "mozRequestFullScreen", "mozCancelFullScreen", "mozfullscreenchange", "mozfullscreenerror" ];
        const ms = [ "msFullscreenEnabled", "msFullscreenElement", "msRequestFullscreen", "msExitFullscreen", "MSFullscreenChange", "MSFullscreenError" ];
        const vendor = "fullscreenEnabled" in document && Object.keys(key) || webkit[0] in document && webkit || moz[0] in document && moz || ms[0] in document && ms || [];

        return {
            requestFullscreen: function requestFullscreen(element) {
                return element[vendor[key.requestFullscreen]]();
            },
            requestFullscreenFunction: function requestFullscreenFunction(element) {
                return element[vendor[key.requestFullscreen]];
            },
            get exitFullscreen() {
                return document[vendor[key.exitFullscreen]].bind(document);
            },
            addEventListener: function addEventListener(type, handler, options) {
                return document.addEventListener(vendor[key[type]], handler, options);
            },
            removeEventListener: function removeEventListener(type, handler, options) {
                return document.removeEventListener(vendor[key[type]], handler, options);
            },
            get fullscreenEnabled() {
                return Boolean(document[vendor[key.fullscreenEnabled]]);
            },
            set fullscreenEnabled(val) {
            },
            get fullscreenElement() {
                return document[vendor[key.fullscreenElement]];
            },
            set fullscreenElement(val) {
            },
            get onfullscreenchange() {
                return document[("on" + vendor[key.fullscreenchange]).toLowerCase()];
            },
            set onfullscreenchange(handler) {
                document[("on" + vendor[key.fullscreenchange]).toLowerCase()] = handler;
            },
            get onfullscreenerror() {
                return document[("on" + vendor[key.fullscreenerror]).toLowerCase()];
            },
            set onfullscreenerror(handler) {
                document[("on" + vendor[key.fullscreenerror]).toLowerCase()] = handler;
            }
        };
    })();

    public static getBrowserScrollWidth(): number {
        return BrowserUtils.isMobile() ? 0 : 17;
    }

    public static inIframe(): boolean {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
}