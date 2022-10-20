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

export interface ContentData {
    title: string;
    description: any;
    icon: IconDefinition;
}


export enum ContentLabels {
    EXPERIENCE_HOME_LEFT = "I am a graduated software engineer with 9 years of experience. With interest in the field since highscool I have been writing code ever since i was 14-15 in my spare time. In that time I have build an exellent understanding of the core principles in writing Software, the pitfalls that any project may fall into and how to handle these difficult situations so the end product is exceptional.\n" +
        "\tInitially started as a .NET developer I had the blessing to be able to see the software developement process from many different roles and in different busines fields.\n" +
        "\tEventually I found my passion in Front-End web developement where I mastered the fushion between Clients's ideas and requirements and the end-user experience with the product that not only looks good, but also fulfils all of it Functional (swiftness, compatibility, accesibility) and Non-functional (giving a unique experience, brand developement) goals.",
    EXPERIENCE_HOME_RIGHT = "PLAYTECH, BET365, RAIFFEISNEBANK, KBC group etc.",
    POSITION_EXPERIENCE_TEXT_LEFT = "I Have been primarily a font-end software developer since 2017. I have mastered the core innerworkings of Javascript/Typescript, DOM Manipulation, Responsive Design and Animations via CSS. I have also completed multiple big projects written using the Angular framework or ReactJS library. More info for that check in [Section3. Framework Experience]. In the part \"Client Approach\" in the website I have written extensifely on some fields of the front end developement that differentiate the ordinary web solution, compared to these that are top of the class.",
    POSITION_EXPERIENCE_TEXT_RIGHT = "Until I have found my love for web developing I have gone trough some different positions that helped me to understand the whole workflow of software developement and shape me as the Proffesional that I am now:\n" +
        "\t- Full-stack developer. Spending hundreds of hours writing back-end software I have a great understanding of the OOP principles, which are much valued in the Front-end world nowadays. Being familliar with Database management, CI/CD, API organisation etc. makes me a great mediator when corrensponding with colleagues from different parts of the team.\n" +
        "\t- Tech Lead - I have led medium sized projects. The work there being much more organisational and managerial than technical I have developed great planning and soft skills.\n" +
        "\t- Technical product analyst: I participated in the complete redesigning of the workflows for an International Bank in one of its countries. Deigning complex workflows as Client onboarding and Mortgage approaval teached me exellent Proffesional Etiquette, Handling information in highly confidential and complex corporate structure and combining expertise from multiple fields to create the best possible outcome for each situation.",
    FIELD_EXPERIENCE_TEXT_LEFT = "- Other than being being a Tech Analyst I have also prepared front end solutions for different banks in the past. From there I gained the knowledge to keep sensitive data secured at all times (See enrypting in client approach). To fully check the quality of the frontend solution using End to End as well as Encapsulated Unit tests. Being the most protected and confidential field with one of the most complex workflows in terms of data management I can easily define and orchestrate heavy processes to be easily usable and understandable by the end user.\n" +
        "\t[Deloitte, Raiffeisen Bank International AG, KBC Group]",
    FIELD_EXPERIENCE_TEXT_RIGHT = "- Gaming in the WEB is quite a difficult task to be executed properly. Having the absolute same experience in term of quality on a vast range of different devices, meanwhile having an unortodox web product is no easy task to achieve. Working with product owners and designers to achieve all of that while keeping user engagement at a high have teached me a lot of ways to make the User Experience pristine. Delivering products for multiple casinos like BetClic, Bet365, William Hill etc. made me pedantic followers of user requirements and international formatting, as the gaming industry is one of the most regulated ones online.",
    FRAMEWORK_EXPERIENCE_TEXT_LEFT = "Initially started working on projects in the initial AngularJS and transitioning to Angular2+ after that. I have exellent understanding of all the inner modules of the framework (Component Livecycles, Angular Directives, RxJS, Angular Animations, Reactive forms, etc..) and have been a Team Lead for projects written in Angular2+. I love angular for the fact that many of the common problems for new project have already been solved in a meaningfull way, so team familiar with it can go straight into developing the business part of the project with relative ease.",
    FRAMEWORK_EXPERIENCE_TEXT_RIGHT = "Around the beggining of 2021 I have decided to move on and try something new by discovering the ReactJS library. Delivering software mostly for real-money handling gaming companies I have a great understanding of how best to handle a lot of dynamic elements for many types of devices using the Virtual DOM, optimising them with The useful React Hooks, while not compromising security of data. I love ReactJS for its ease of use, high responsibility for the user and freedom to really go out of the box and stand out in a unique way in every different project.",
    CLIENT_APPROACH_HOME_LEFT = "Creating unique frontend experience is a difficult task",
    CLIENT_APPROACH_HOME_RIGHT = "reactjs, angular, js, ts, coding, oop",
    BUSINESS_APPROACH_LEFT = "Communication with the product owner, together with the internal team is crucial for a successful delivery. Helping the developers to understand the fundamental ideas behind the product and how it wants to be seen by the end user is key so the final result exceeds the initial expectations of the owner.\n" +
        "\t\tTaking part in the initial creating processes for tens of projects I can give valuable output in the designing the software solution, finding potential problems and giving ideas how to solve them long before they become costly.",
    BUSINESS_APPROACH_RIGHT = "Each software challenge can be solved in many different ways. Some times a simpler solution is prefferable as it is more cost effectife, in some cases a more generic approach with bigger infrastructure is needed so the chosen solution is easly supported and grown in the future. Being a proffesional with many projects in the past, I have the expertise to understand a given problem with all it's context and to explain to the product owner multiple solutions and the benefits each of them yeld.",
    SECURITY_APPROACH_LEFT = "Fortunately, the topic of sensitive data and keeping it out of malicious hands is becoming more and more polular by each day. Being users of multiple different platform where we share personal data constantly, everyone understands the importance of handling personal data with the highest level of security. Spending years developing  the most sensitive areas of software developing (FinTech, Online Banking, Online Casinos), I master knowledge on how to:\n" +
        "\t\t- Protect sensitive data with multiple types of encryption.\n" +
        "\t\t- Protect the software and its inner working out of malicious hands.\n" +
        "\t\t- Review any given user flows and find any potential safety cracks in each step.",
    SECURITY_APPROACH_RIGHT = "While testing requires time for planning and execution, it is a must for the most important processes of a product and bring stability and long term predictability for medium and large size projects. While developing banking apps it was a must to use Unit and Integration tests uncompromisingly for every business process, while End to end tests give a helping hand to QA Specialist in their task to guarantee that the final product is in its best quality.",
    SWIFTNESS_APPROACH_LEFT = "Using already made libraries that completes a certain task is a double edged sword. While it may cut developement time to provide a fully working feature in most cases this is not reccomented, as it is very rare that a project will need all of the functionalities that a giver library provide (So the project unnesesarily becomes heavier). And the most problematic thing is that if a specific bug is found inside the lbirary the developement team has no direct control of fixing it and a simple problem may become a timesink in finding workarounds to fix it in a enclosed system. So the solution that is most acceptable for me is only to use a complete library only if really necessary and always via a fork and wrapping it in brand new adapters with the idea of keeping independance at a high level. As I have done this in the past many times I can guarantee that I can quickly dive into new code, understand its inner workings and flaws and efficiently integrate it in the best way possible for the product in developement.",
    SWIFTNESS_APPROACH_RIGHT = "faster loading times vs leaner solution (including animations)",
    COMPATIBILITY_APPROACH_LEFT = "Being really passionate in the psychology and understanding of perfecting the User Experience, I can brinf into the table ideas that will improve the usability into their products. Depending on the target group, a product may look and handle drastically different, taking into consideration the user's expectations and actions. Having the technical point of view too, I can detect rare but important use cases, where the Graphic or Product team may have left out, and give my help in order to clean out the solution from any issues.",
    COMPATIBILITY_APPROACH_RIGHT = "accesibility and compatibility"
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
            title: "Past Clients",
            icon: faThumbsUp,
            description: ContentLabels.EXPERIENCE_HOME_RIGHT
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
            title: "Mastered Skills",
            icon: faCircleNodes,
            description: ContentLabels.CLIENT_APPROACH_HOME_RIGHT
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