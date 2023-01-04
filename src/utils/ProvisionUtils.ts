import {IconType} from "../models/common/IconType";
import { Section } from "../models/content/Section";
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
        return [ "chessImage.jpg",
            "experienceImage.jpg",
            "clientImage.jpg",
            "avatar-jpeg.jpg",
            ProvisionUtils.getIconResourcePath(IconType.faHandshake),
            ProvisionUtils.getIconResourcePath(IconType.faSuitcase),
            ProvisionUtils.getIconResourcePath(IconType.faChess),
        ];
    }

    public static deviceSimulatorResources(): string[] {
        return [ "desktop.svg",
            "phone.svg",
            "tablet.svg",
            "desktopSelected.svg",
            "phoneSelected.svg",
            "tabletSelected.svg",
            "gradient-cubes.svg",
        ];
    }

    public static getIconResourcePath(icon: IconType): string {
        return `${icon.toString()}.svg`;
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