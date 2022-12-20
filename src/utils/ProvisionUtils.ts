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
}