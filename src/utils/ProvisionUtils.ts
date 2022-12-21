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
        return [ "./src/resources/categoryImages/chess/home.jpg",
            "./src/resources/categoryImages/client/home.jpg",
            "./src/resources/categoryImages/experience/home.jpg",
            "./src/resources/images/avatar-jpeg.jpg",
            "./src/resources/fonts/bandar-font/Bandar.ttf",
            "./src/resources/fonts/bandar-font/BandarBold.tff",
            "./src/resources/fonts/comfortaa/Comfortaa-Bold.ttf",
            "./src/resources/fonts/comfortaa/Comfortaa-Light.ttf",
            "./src/resources/fonts/comfortaa/Comfortaa-Regular.ttf",
            ProvisionUtils.getIconResourcePath(IconType.faHandshake),
            ProvisionUtils.getIconResourcePath(IconType.faSuitcase),
            ProvisionUtils.getIconResourcePath(IconType.faChess),
        ];
    }

    public static deviceSimulatorResources(): string[] {
        return [ "./src/resources/svgAssets/deviceSimulatorIcons/desktop.svg",
            "./src/resources/svgAssets/deviceSimulatorIcons/phone.svg",
            "./src/resources/svgAssets/deviceSimulatorIcons/tablet.svg",
            "./src/resources/svgAssets/deviceSimulatorIcons/desktopSelected.svg",
            "./src/resources/svgAssets/deviceSimulatorIcons/phoneSelected.svg",
            "./src/resources/svgAssets/deviceSimulatorIcons/tabletSelected.svg",
            "./src/resources/svgAssets/gradient-cubes.svg",
        ];
    }

    public static getIconResourcePath(icon: IconType): string {
        return `./src/resources/icons/${icon.toString()}`;
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