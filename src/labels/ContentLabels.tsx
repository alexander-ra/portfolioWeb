import {
    faArrowUpRightDots, faBolt,
    faCircleNodes,
    faCookie,
    faDice,
    faFeather,
    faForwardStep,
    faMoneyBillTransfer,
    faPaintBrush,
    faRulerCombined, faTablet, faThumbsUp,
    faTty, faUniversalAccess, faVialVirus,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import {faBuildingColumns} from "@fortawesome/free-solid-svg-icons/faBuildingColumns";
import {Icon} from "@fortawesome/fontawesome-svg-core";
import {CircleMenuStates} from "../models/landing/CircleMenuStates";

export interface MenuContent {
    title: string;
    leftContent: ContentData;
    rightContent: ContentData;
}

export enum CustomContentTypes {
    TECHNOLOGY_LIST = "TECHNOLOGY_LIST",
    COMPANIES_LIST = "COMPANIES_LIST"
}

export interface ContentData {
    title: string;
    description: any;
    icon: IconDefinition;
    customContent?: CustomContentTypes;
}


export enum ContentLabels {
    EXPERIENCE_HOME_LEFT = "I am a graduated software engineer with a decade of professional experience. I have been interested in the field since high school and have been writing code since I was 14. Over time, I have developed an excellent understanding of software development principles and potential pitfalls. Starting as a .NET developer and working in various roles and industries, I have gained a well-rounded perspective on the development process. My passion is front-end web development, where I excel at combining clients' ideas and requirements with a user-friendly and engaging product that meets goals such as speed, compatibility, accessibility, and brand development.",
    EXPERIENCE_HOME_RIGHT = "Javascript, Typescript, HTML, CSS/SASS, React, Angular, NPM, Node.js, BootStrap, SAP UI, CI/CD, BRD/FSD creation, Java, C#, JIRA, GIT, Encryption, UI, UX, Agile, Scrum, Unit Testing, E2E Testing, ...And many more",
    POSITION_EXPERIENCE_TEXT_LEFT = "I have primarily been a front-end software developer since 2017. I have mastered the core inner workings of Javascript/Typescript, DOM manipulation, responsive design, and animations via CSS. I have also completed multiple large projects using the Angular framework or ReactJS library. For more information, please see the 'Framework Experience' section of my website. In the 'Client Approach' section, I have written extensively about some key aspects of front-end development that set high-quality solutions apart from ordinary ones.",
    POSITION_EXPERIENCE_TEXT_RIGHT = "Before I found my love for web development, I worked in various positions that gave me a well-rounded understanding of the software development workflow. I have a great understanding of OOP principles, which are valuable in the front-end world. My experience with database management, CI/CD, and API organization makes me an effective mediator when communicating with colleagues from different parts of the team. I have also led medium-sized projects and developed strong planning and soft skills. As a technical product analyst, I participated in the complete redesign of workflows for an international bank, where I learned professional etiquette and how to handle complex and confidential information to create the best possible outcomes for each situation.",
    FIELD_EXPERIENCE_TEXT_LEFT = "In addition to being a tech analyst, I have also prepared front-end solutions for various banks in the past. This has given me the knowledge and expertise to securely handle sensitive data at all times (see `Encrypting`). I am also skilled at using end-to-end and unit tests to ensure the quality of front-end solutions. As the financial industry is one of the most protected and confidential fields with complex data management workflows, I am able to define and organize heavy processes in a way that is easily understandable and usable by end users. (Companies I have worked with include Deloitte, Raiffeisen Bank International AG, and KBC Group.)",
    FIELD_EXPERIENCE_TEXT_RIGHT = "Creating a high-quality gaming experience on the web that is consistent across different devices and unique in its design is a challenging task. I have worked with product owners and designers to deliver engaging user experiences for multiple casinos, including BetClic, Bet365, and William Hill. My experience in the regulated gaming industry has taught me to be meticulous in following user requirements and international formatting standards. This has helped me create web products that are both engaging and compliant with industry regulations.",
    FRAMEWORK_EXPERIENCE_TEXT_LEFT = "Initially started working on projects in the initial AngularJS and transitioning to Angular2+ after that. I have exellent understanding of all the inner modules of the framework (Component Livecycles, Angular Directives, RxJS, Angular Animations, Reactive forms, etc..) and have been a Team Lead for projects written in Angular2+. I love angular for the fact that many of the common problems for new project have already been solved in a meaningfull way, so team familiar with it can go straight into developing the business part of the project with relative ease.",
    FRAMEWORK_EXPERIENCE_TEXT_RIGHT = "Around the beginning of 2021 I have decided to move on and try something new by discovering the ReactJS library. Delivering software mostly for real-money handling gaming companies I have a great understanding of how best to handle a lot of dynamic elements for many types of devices using the Virtual DOM, optimising them with The useful React Hooks, while not compromising security of data. I love ReactJS for its ease of use, high responsibility for the user and freedom to really go out of the box and stand out in a unique way in every different project.",
    CLIENT_APPROACH_HOME_LEFT = "My professional experience includes a variety of projects and roles, giving me a well-rounded skillset and the ability to adapt to new challenges. As a freelancer, I have had the opportunity to work with a diverse group of clients, each with their own unique needs and goals. This has taught me the value of clear communication and the ability to tailor my approach to each project. In my full-time positions, I have honed my skills in project management and have gained experience working within a team to deliver high-quality results. I am confident in my ability to tackle new projects and am always looking for opportunities to learn and grow.",
    CLIENT_APPROACH_HOME_RIGHT = "bet365, betclic, deloitte, kbc, metro, playtech, raiffeisen, williamhill",
    BUSINESS_APPROACH_LEFT = "Effective communication with the product owner and internal team is essential for successful delivery. It is important to help developers understand the core ideas behind the product and how it should be perceived by the end user, in order to exceed the owner's initial expectations. With my experience participating in the initial development stages of numerous projects, I can provide valuable input on designing the software solution, identifying potential issues, and suggesting solutions before they become costly problems.",
    BUSINESS_APPROACH_RIGHT = "Each software challenge can be solved in many different ways. Some times a simpler solution is prefferable as it is more cost effectife, in some cases a more generic approach with bigger infrastructure is needed so the chosen solution is easly supported and grown in the future. Being a proffesional with many projects in the past, I have the expertise to understand a given problem with all it's context and to explain to the product owner multiple solutions and the benefits each of them yeld.",
    SECURITY_APPROACH_LEFT = "The importance of protecting sensitive data and keeping it out of the hands of malicious individuals is becoming more widely recognized every day. As users of various platforms where we share personal information, we all understand the need for high levels of security when handling this data. With years of experience developing software for sensitive industries such as FinTech, online banking, and online casinos, I have mastered the knowledge and skills necessary to protect sensitive data with multiple types of encryption, secure the software and its inner workings from malicious individuals, and review user flows and identify potential vulnerabilities in each step.",
    SECURITY_APPROACH_RIGHT = "Testing may require extra time for planning and execution, but it is an essential part of any product development process and brings stability and long-term predictability to medium and large size projects. In my experience developing banking apps, it was necessary to use unit and integration tests extensively for every business process, while end-to-end tests provided additional support for QA specialists in their effort to ensure the final product was of the highest quality. Testing is a crucial step that cannot be skipped if we want to deliver a reliable, high-quality product to our customers.",
    SWIFTNESS_APPROACH_LEFT = "Using pre-existing libraries can save development time, but it is not always recommended. It is rare that a project will need all the functionality that a given library provides, so the project becomes unnecessarily heavier. The biggest problem is that if a bug is found in the library, the development team has no control over fixing it. The best solution is to only use a complete library if absolutely necessary, and to fork and wrap it in new adapters to maintain independence. With my experience doing this, I can quickly understand new code, identify flaws, and integrate it effectively into the project.",
    SWIFTNESS_APPROACH_RIGHT = "Fast loading websites are essential for providing a good user experience and keeping visitors engaged. A slow-loading website can be frustrating for users, leading to increased bounce rates and reduced conversions. To ensure that a website loads quickly, it is important to optimize the size and number of assets, minimize the use of external resources, and enable caching. I have experience in implementing these and other strategies to improve the performance and loading speed of websites, and can help ensure that your website delivers a fast and seamless experience for your users.",
    COMPATIBILITY_APPROACH_LEFT = "As someone who is passionate about psychology and the art of perfecting user experience, I am able to bring innovative ideas to the table that will improve the usability of a product. Depending on the target audience, a product may require a different design and user flow to meet the expectations and needs of the users. With my technical background, I am also able to identify important but rare use cases that the design and product teams may have overlooked, and provide assistance in ensuring that the solution is free of any potential issues.",
    COMPATIBILITY_APPROACH_RIGHT = "Accessibility and compatibility are crucial considerations in web development. Ensuring that a website is accessible to users with disabilities and can be accessed from a variety of devices and browsers is essential for providing a good user experience and reaching a wider audience. I have experience in implementing accessibility and compatibility standards and guidelines, such as WCAG and cross-browser testing, and can help ensure that your website is accessible and compatible with a range of users and devices."
}

export class ContentData {
    private static readonly EXPERIENCE_HOME: MenuContent = {
        title: "Home",
        leftContent: {
            title: "Introduction",
            icon: faForwardStep,
            description: ContentLabels.EXPERIENCE_HOME_LEFT
        },
        rightContent: {
            title: "Mastered Skills",
            icon: faCircleNodes,
            description: ContentLabels.EXPERIENCE_HOME_RIGHT,
            customContent: CustomContentTypes.TECHNOLOGY_LIST
        }
    } as MenuContent;

    private static readonly EXPERIENCE_BY_TITLE: MenuContent = {
        title: "By Title",
        leftContent: {
            title: "Senior Front-end Dev",
            icon: faRulerCombined,
            description: ContentLabels.POSITION_EXPERIENCE_TEXT_LEFT
        },
        rightContent: {
            title: "Other Positions",
            icon: faBuildingColumns,
            description: ContentLabels.POSITION_EXPERIENCE_TEXT_RIGHT
        }
    } as MenuContent;

    private static readonly EXPERIENCE_BY_FRAMEWORK: MenuContent = {
        title: "By Framework",
        leftContent: {
            title: "Angular JS/2+",
            icon: ['fab', 'angular'] as any,
            description: ContentLabels.FRAMEWORK_EXPERIENCE_TEXT_LEFT
        },
        rightContent: {
            title: "ReactJS",
            icon: ['fab', 'react'] as any,
            description: ContentLabels.FRAMEWORK_EXPERIENCE_TEXT_RIGHT
        }
    } as MenuContent;

    private static readonly EXPERIENCE_BY_FIELD: MenuContent = {
        title: "By Field",
        leftContent: {
            title: "Banking",
            icon: faMoneyBillTransfer,
            description: ContentLabels.FIELD_EXPERIENCE_TEXT_LEFT
        },
        rightContent: {
            title: "Online Gambling",
            icon: faDice,
            description: ContentLabels.FIELD_EXPERIENCE_TEXT_RIGHT
        }
    } as MenuContent;

    private static readonly CLIENT_HOME: MenuContent = {
        title: "Home",
        leftContent: {
            title: "Introduction",
            icon: faForwardStep,
            description: ContentLabels.CLIENT_APPROACH_HOME_LEFT
        },
        rightContent: {
            title: "Past Clients",
            icon: faThumbsUp,
            description: ContentLabels.CLIENT_APPROACH_HOME_RIGHT,
            customContent: CustomContentTypes.COMPANIES_LIST
        }
    } as MenuContent;

    private static readonly CLIENT_BUSINESS: MenuContent = {
        title: "Business",
        leftContent: {
            title: "Communication",
            icon: faTty,
            description: ContentLabels.BUSINESS_APPROACH_LEFT
        },
        rightContent: {
            title: "Scaling Growth",
            icon: faArrowUpRightDots,
            description: ContentLabels.BUSINESS_APPROACH_RIGHT
        }
    } as MenuContent;

    private static readonly CLIENT_SECURITY: MenuContent = {
        title: "Security",
        leftContent: {
            title: "Encryption",
            icon: faCookie,
            description: ContentLabels.SECURITY_APPROACH_LEFT
        },
        rightContent: {
            title: "Quality assurance",
            icon: faVialVirus,
            description: ContentLabels.SECURITY_APPROACH_RIGHT
        }
    } as MenuContent;

    private static readonly CLIENT_SWIFTNESS: MenuContent = {
        title: "Swiftness",
        leftContent: {
            title: "Slim approach",
            icon: faFeather,
            description: ContentLabels.SWIFTNESS_APPROACH_LEFT
        },
        rightContent: {
            title: "Fast Loading",
            icon: faBolt,
            description: ContentLabels.SWIFTNESS_APPROACH_RIGHT
        }
    } as MenuContent;

    private static readonly CLIENT_COMPATIBILITY: MenuContent = {
        title: "Compatibility",
        leftContent: {
            title: "Device Compatibility",
            icon: faTablet,
            description: ContentLabels.COMPATIBILITY_APPROACH_LEFT
        },
        rightContent: {
            title: "User Accessibility",
            icon: faUniversalAccess,
            description: ContentLabels.COMPATIBILITY_APPROACH_RIGHT
        }
    } as MenuContent;

    public static getMenuContent(menuState: CircleMenuStates): MenuContent {
        switch (menuState) {
            case CircleMenuStates.EXPERIENCE_HOME:
                return ContentData.EXPERIENCE_HOME;
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