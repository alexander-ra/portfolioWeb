import {IconType} from "../components/common/icon/IconType";
import { Section } from "../components/contentPage/ContentPage";
import {CircleMenuStates} from "../models/landing/CircleMenuStates";

export class ProvisionUtils {

    public static getClientApproachSections(): Section[] {
        return [
            {
                icon: IconType.faHome,
                menu: CircleMenuStates.APPROACH_HOME
            },
            {
                icon: IconType.faBusinessTime,
                menu: CircleMenuStates.BUSINESS
            },
            {
                icon: IconType.faKey,
                menu: CircleMenuStates.SECURITY
            },
            {
                icon: IconType.faGauge,
                menu: CircleMenuStates.SWIFTNESS
            },
            {
                icon: IconType.faAccessibleIcon,
                menu: CircleMenuStates.ACCESSIBILITY
            }
        ];
    }

    public static getPastExperienceSections(): Section[] {
        return [
            {
                icon: IconType.faHome,
                menu: CircleMenuStates.EXPERIENCE_HOME
            },
            {
                icon: IconType.faUserTie,
                menu: CircleMenuStates.POSITION
            },
            {
                icon: IconType.faMoneyBillTrendUp,
                menu: CircleMenuStates.FIELD
            },
            {
                icon: IconType.faFileCode,
                menu: CircleMenuStates.FRAMEWORK
            }
        ];
    }

    public static landingResources(): string[] {
        return [ "./public/resources/categoryImages/chess/home.jpg",
            "./public/resources/categoryImages/client/home.jpg",
            "./public/resources/categoryImages/experience/home.jpg",
            "./public/resources/images/avatar-jpeg.jpg",
            "./public/resources/fonts/bandar-font/Bandar.ttf",
            "./public/resources/fonts/bandar-font/BandarBold.tff",
            "./public/resources/fonts/comfortaa/Comfortaa-Bold.ttf",
            "./public/resources/fonts/comfortaa/Comfortaa-Light.ttf",
            "./public/resources/fonts/comfortaa/Comfortaa-Regular.ttf",
            ProvisionUtils.getIconResourcePath(IconType.faHandshake),
            ProvisionUtils.getIconResourcePath(IconType.faSuitcase),
            ProvisionUtils.getIconResourcePath(IconType.faChess),
        ];
    }

    public static deviceSimulatorResources(): string[] {
        return [ "./public/resources/svgAssets/deviceSimulatorIcons/desktop.svg",
            "./public/resources/svgAssets/deviceSimulatorIcons/phone.svg",
            "./public/resources/svgAssets/deviceSimulatorIcons/tablet.svg",
            "./public/resources/svgAssets/deviceSimulatorIcons/desktopSelected.svg",
            "./public/resources/svgAssets/deviceSimulatorIcons/phoneSelected.svg",
            "./public/resources/svgAssets/deviceSimulatorIcons/tabletSelected.svg",
            "./public/resources/svgAssets/gradient-cubes.svg",
        ];
    }

    public static getIconResourcePath(icon: IconType): string {
        return `./public/resources/icons/${icon.toString()}`;
    }

    public static headerIconResources(): string[] {
        const icons = [IconType.faCompass,
            IconType.faAngleDown,
            IconType.faAddressCard,
            IconType.faGithubAlt,
            IconType.faLink,
            IconType.faPalette,
            IconType.faSun,
            IconType.faMoon,
            IconType.faCube,
            IconType.faMobile,
            IconType.faLinkedin,
            IconType.faEnvelope,];

        return Object.values(IconType).map((value) => {
            return ProvisionUtils.getIconResourcePath(value);
        });
    }
}