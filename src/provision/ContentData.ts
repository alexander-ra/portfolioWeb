import {MenuContent} from "../models/content/MenuContent";
import {CustomContentTypes} from "../models/content/CustomContentTypes";
import {CircleMenuStates} from "../models/landing/CircleMenuStates";
import {ContentLabels} from "./ContentLabels";
import {CommonLabels} from "./CommonLabels";

export class ContentProvisioner {
    private static readonly EXPERIENCE_HOME: MenuContent = {
        title: CommonLabels.HOME,
        leftContent: {
            title: CommonLabels.INTRODUCTION,
            description: ContentLabels.EXPERIENCE_HOME_LEFT
        },
        rightContent: {
            title: CommonLabels.MASTERED_SKILLS,
            description: ContentLabels.EXPERIENCE_HOME_RIGHT,
            customContent: CustomContentTypes.TECHNOLOGY_LIST
        }
    } as MenuContent;

    private static readonly EXPERIENCE_BY_TITLE: MenuContent = {
        title: CommonLabels.BY_TITLE,
        leftContent: {
            title: CommonLabels.SENIOR_FRONT_END_DEV,
            description: ContentLabels.POSITION_EXPERIENCE_TEXT_LEFT
        },
        rightContent: {
            title: CommonLabels.OTHER_POSITIONS,
            description: ContentLabels.POSITION_EXPERIENCE_TEXT_RIGHT
        }
    } as MenuContent;

    private static readonly EXPERIENCE_BY_FRAMEWORK: MenuContent = {
        title: CommonLabels.BY_FRAMEWORK,
        leftContent: {
            title: CommonLabels.ANGULAR_JS,
            icon: ['fab', 'angular'] as any,
            description: ContentLabels.FRAMEWORK_EXPERIENCE_TEXT_LEFT
        },
        rightContent: {
            title: CommonLabels.REACT_JS,
            icon: ['fab', 'react'] as any,
            description: ContentLabels.FRAMEWORK_EXPERIENCE_TEXT_RIGHT
        }
    } as MenuContent;

    private static readonly EXPERIENCE_BY_FIELD: MenuContent = {
        title: CommonLabels.BY_FIELD,
        leftContent: {
            title: CommonLabels.BUSINESS,
            description: ContentLabels.FIELD_EXPERIENCE_TEXT_LEFT
        },
        rightContent: {
            title: CommonLabels.GAMING,
            description: ContentLabels.FIELD_EXPERIENCE_TEXT_RIGHT
        }
    } as MenuContent;

    private static readonly CLIENT_HOME: MenuContent = {
        title: CommonLabels.HOME,
        leftContent: {
            title: CommonLabels.INTRODUCTION,
            description: ContentLabels.CLIENT_APPROACH_HOME_LEFT
        },
        rightContent: {
            title: CommonLabels.PAST_CLIENTS,
            description: ContentLabels.CLIENT_APPROACH_HOME_RIGHT,
            customContent: CustomContentTypes.COMPANIES_LIST
        }
    } as MenuContent;

    private static readonly CLIENT_BUSINESS: MenuContent = {
        title: CommonLabels.BUSINESS,
        leftContent: {
            title: CommonLabels.COMMUNICATION,
            description: ContentLabels.BUSINESS_APPROACH_LEFT
        },
        rightContent: {
            title: CommonLabels.SCALING_GROWTH,
            description: ContentLabels.BUSINESS_APPROACH_RIGHT
        }
    } as MenuContent;

    private static readonly CLIENT_SECURITY: MenuContent = {
        title: CommonLabels.SECURITY,
        leftContent: {
            title: CommonLabels.ENCRYPTION,
            description: ContentLabels.SECURITY_APPROACH_LEFT
        },
        rightContent: {
            title: CommonLabels.QUALITY_ASSURANCE,
            description: ContentLabels.SECURITY_APPROACH_RIGHT
        }
    } as MenuContent;

    private static readonly CLIENT_SWIFTNESS: MenuContent = {
        title: CommonLabels.SWIFTNESS,
        leftContent: {
            title: CommonLabels.SLIM_APPROACH,
            description: ContentLabels.SWIFTNESS_APPROACH_LEFT
        },
        rightContent: {
            title: CommonLabels.FAST_LOADING,
            description: ContentLabels.SWIFTNESS_APPROACH_RIGHT
        }
    } as MenuContent;

    private static readonly CLIENT_COMPATIBILITY: MenuContent = {
        title: CommonLabels.COMPATIBILITY,
        leftContent: {
            title: CommonLabels.DEVICE_COMPATIBILITY,
            description: ContentLabels.COMPATIBILITY_APPROACH_LEFT
        },
        rightContent: {
            title: CommonLabels.USER_ACCESSIBILITY,
            description: ContentLabels.COMPATIBILITY_APPROACH_RIGHT
        }
    } as MenuContent;

    public static getMenuContent(menuState: CircleMenuStates): MenuContent {
        switch (menuState) {
            case CircleMenuStates.EXPERIENCE_HOME:
                return this.EXPERIENCE_HOME;
            case CircleMenuStates.FIELD:
                return this.EXPERIENCE_BY_FIELD;
            case CircleMenuStates.POSITION:
                return this.EXPERIENCE_BY_TITLE;
            case CircleMenuStates.FRAMEWORK:
                return this.EXPERIENCE_BY_FRAMEWORK;
            case CircleMenuStates.APPROACH_HOME:
                return this.CLIENT_HOME;
            case CircleMenuStates.BUSINESS:
                return this.CLIENT_BUSINESS;
            case CircleMenuStates.SWIFTNESS:
                return this.CLIENT_SWIFTNESS;
            case CircleMenuStates.SECURITY:
                return this.CLIENT_SECURITY;
            case CircleMenuStates.ACCESSIBILITY:
                return this.CLIENT_COMPATIBILITY;
            default:
                return this.CLIENT_HOME;
        }

    }

}