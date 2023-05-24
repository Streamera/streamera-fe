import { ReactElement } from "react";
import { Theme } from "../../../types";

export type StudioAnnouncementParam = {
    theme: Theme;
    speed: number;
    text: string;
    color: string;
    bgColor: string;
    children?: ReactElement[];
    isPreview?: boolean;
}