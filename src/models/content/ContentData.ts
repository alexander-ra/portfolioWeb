import { CustomContentTypes } from "./CustomContentTypes";

export interface ContentData {
    title: string;
    description: any;
    customContent?: CustomContentTypes;
}