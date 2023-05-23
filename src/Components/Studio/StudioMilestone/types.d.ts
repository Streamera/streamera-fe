import { ReactElement } from "react";
import { Theme } from "../../../types";

export type StudioMilestoneParam = {
    theme: Theme;
    text: string;
    color: string;
    bgColor: string;
    progressColor: string;
    progressBgColor: string;
    progress: number;
    target: number;
    current: number;
    children?: ReactElement[];
    isPreview?: boolean;
}