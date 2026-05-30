import { Markdown } from "@storybook/addon-docs/blocks";

type Props = { source: string };

export const Changelog = ({ source }: Props) => <Markdown>{source}</Markdown>;
