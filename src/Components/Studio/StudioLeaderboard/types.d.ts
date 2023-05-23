import { ReactElement } from "react";
import { Theme } from "../../../types";
import { PaymentAggregate } from "../../../Pages/Studio/types";

export type StudioLeaderboardParam = {
    theme: Theme;
    text: string;
    color: string;
    bgColor: string;
    topDonators?: PaymentAggregate[];
    children?: ReactElement[];
    isPreview?: boolean;
}