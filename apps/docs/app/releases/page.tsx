import fs from "fs";
import path from "path";

import { Separator, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

type Change = {
  description: string;
  raw: string;
  semverType: string;
  pr?: number;
  packages: string[];
};

type Release = {
  version: string;
  date: string;
  packages: string[];
  changes: {
    features: Change[];
    fixes: Change[];
    refactors: Change[];
    performance: Change[];
    documentation: Change[];
    other: Change[];
  };
};

const CATEGORY_LABELS: Record<string, string> = {
  features: "Features",
  fixes: "Bug Fixes",
  refactors: "Refactors",
  performance: "Performance",
  documentation: "Documentation",
};

function getChangelog(): Release[] {
  const filePath = path.join(process.cwd(), "../../packages/changelog.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export default function ReleasesPage() {
  const releases = getChangelog();

  return (
    <Stack gap={8} p={8}>
      <Stack gap={4}>
        <Text render={<h1 />} size={6} weight="bold">
          Releases
        </Text>
        <Text shade="muted" size={1}>
          {releases.length} release{releases.length !== 1 ? "s" : ""}
        </Text>
      </Stack>

      {releases.map((release, i) => (
        <Stack key={release.version} gap={6}>
          {i > 0 && <Separator />}
          <Stack gap={2}>
            <Text render={<h2 />} size={4} weight="bold">
              v{release.version}
            </Text>
            <Text shade="muted" size={0}>
              {release.date}
            </Text>
          </Stack>

          {(
            Object.entries(release.changes) as [
              keyof typeof CATEGORY_LABELS,
              Change[],
            ][]
          )
            .filter(([key, items]) => items.length > 0 && key in CATEGORY_LABELS)
            .map(([key, items]) => (
              <Stack key={key} gap={3}>
                <Text render={<h3 />} size={2} weight="bold">
                  {CATEGORY_LABELS[key]}
                </Text>
                <Stack render={<ul />} gap={2} px={4}>
                  {items.map((item) => (
                    <Text
                      key={item.raw}
                      render={<li />}
                      size={1}
                      className="list-disc"
                    >
                      {item.description}
                    </Text>
                  ))}
                </Stack>
              </Stack>
            ))}
        </Stack>
      ))}
    </Stack>
  );
}
