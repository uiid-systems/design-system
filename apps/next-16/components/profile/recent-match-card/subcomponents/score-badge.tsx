import { Badge } from "@uiid/indicators";

export type ScoreBadgeProps = {
  heroScore: number;
  villainScore: number;
  result: "win" | "loss";
};

export const ScoreBadge = ({
  heroScore,
  villainScore,
  result,
}: ScoreBadgeProps) => (
  <Badge
    size="large"
    tone={result === "win" ? "positive" : "critical"}
    hideIndicator
  >
    {heroScore} - {villainScore}
  </Badge>
);
ScoreBadge.displayName = "ScoreBadge";
