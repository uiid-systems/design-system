import { Card } from "@uiid/cards";
import { TrophyIcon, HeartCrackIcon } from "@uiid/icons";
import { Separator } from "@uiid/layout";

import { ProfileList, ProfileListItem } from "../subcomponents";

import { VersusText, ScoreBadge } from "./subcomponents";

export type RecentMatchCardProps = {
  opponent: string;
  format: string;
  frames: number;
  date: string;
  result: "win" | "loss";
  heroScore: number;
  villainScore: number;
};

export const RecentMatchCard = ({
  opponent,
  format,
  frames,
  date,
  result,
  heroScore,
  villainScore,
}: RecentMatchCardProps) => {
  return (
    <Card
      gap={4}
      title={<VersusText opponent={opponent} />}
      IconProps={{
        icon: result === "win" ? TrophyIcon : HeartCrackIcon,
        className: result === "win" ? "text-yellow-500" : "text-red-500",
      }}
      action={
        <ScoreBadge
          heroScore={heroScore}
          villainScore={villainScore}
          result={result}
        />
      }
    >
      <Separator shade="muted" />

      <ProfileList>
        <ProfileListItem label="Format" value={format} />
        <ProfileListItem label="Frames" value={`${frames}`} />
        <ProfileListItem label="Date" value={date} />
      </ProfileList>
    </Card>
  );
};
RecentMatchCard.displayName = "RecentMatchCard";
