import { compileMDX } from "next-mdx-remote/rsc";

import { Badge } from "@uiid/indicators";
import { CodeInline } from "@uiid/code";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { getChangesets } from "@/lib/get-changesets";

const mdxComponents = {
  p: (props: Record<string, unknown>) => (
    <Text render={<p />} size={0} {...props} />
  ),
  strong: (props: Record<string, unknown>) => (
    <Text render={<strong />} weight="bold" {...props} />
  ),
  code: (props: Record<string, unknown>) => <CodeInline {...props} />,
  a: (props: Record<string, unknown>) => (
    <Text render={<a />} size={0} underline {...props} />
  ),
};

async function ChangesetSummary({ summary }: { summary: string }) {
  const { content } = await compileMDX({
    source: summary,
    components: mdxComponents,
  });
  return <>{content}</>;
}

export default async function ChangelogPage() {
  const changesets = getChangesets();

  return (
    <Stack gap={8} p={8}>
      <Stack gap={4}>
        <Text render={<h1 />} size={4} weight="bold">
          Changelog
        </Text>
        <Text size={1} shade="muted">
          Upcoming changes queued for the next release.
        </Text>
      </Stack>

      {changesets.length === 0 ? (
        <Text size={0} shade="halftone">
          No pending changes.
        </Text>
      ) : (
        <Stack gap={4}>
          {changesets.map((changeset) => (
            <Stack key={changeset.id} gap={3} bb={1} pb={4}>
              <Group gap={2} ay="center" style={{ flexWrap: "wrap" }}>
                {changeset.packages.map((pkg) => (
                  <Badge
                    key={pkg.name}
                    size="small"
                    hideIndicator
                  >
                    {pkg.name} · {pkg.bump}
                  </Badge>
                ))}
              </Group>
              <ChangesetSummary summary={changeset.summary} />
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
