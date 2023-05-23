import { ReactElement } from "react";
import { Theme, VotingOptions } from "../../../types";

export type StudioVotingParam = {
    theme: Theme;
    text: string;
    color: string;
    bgColor: string;
    endAt: string;
    total?: number;
    choices: VotingOptions[];
    children?: ReactElement[];
    isPreview?: boolean;
}