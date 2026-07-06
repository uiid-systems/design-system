import Link from "next/link";

import {
  Card,
  CodeBlock,
  Group,
  Separator,
  Stack,
  StackProps,
  Table,
  Text,
} from "@uiid/design-system";
import { ArrowLeftIcon, ArrowRightIcon } from "@uiid/icons";

type PropRow = {
  prop: React.ReactNode;
  type: React.ReactNode;
  default: React.ReactNode;
  description: string;
};

const Mono = ({
  children,
  muted,
}: React.PropsWithChildren<{ muted?: boolean }>) => (
  <Text family="mono" size={-1} shade={muted ? "muted" : undefined}>
    {children}
  </Text>
);

const EMPTY = <Text shade="muted">—</Text>;

const PROPS_MOCK_DATA: PropRow[] = [
  {
    prop: <Mono>code</Mono>,
    type: <Mono muted>string</Mono>,
    default: EMPTY,
    description: "The code to display.",
  },
  {
    prop: <Mono>language</Mono>,
    type: <Mono muted>BundledLanguage</Mono>,
    default: <Mono muted>&quot;typescript&quot;</Mono>,
    description: "Language used for syntax highlighting.",
  },
  {
    prop: <Mono>filename</Mono>,
    type: <Mono muted>string</Mono>,
    default: EMPTY,
    description: "Filename shown in the header.",
  },
  {
    prop: <Mono>showLineNumbers</Mono>,
    type: <Mono muted>boolean</Mono>,
    default: <Mono muted>false</Mono>,
    description: "Render line numbers in the gutter.",
  },
  {
    prop: <Mono>highlightLines</Mono>,
    type: <Mono muted>number[]</Mono>,
    default: EMPTY,
    description: "Line numbers to highlight (1-indexed).",
  },
  {
    prop: <Mono>rows</Mono>,
    type: <Mono muted>number</Mono>,
    default: EMPTY,
    description:
      "Maximum visible rows before content collapses behind a toggle.",
  },
];

const EXAMPLE_CODE = `import { CodeBlock } from "@uiid/design-system";

export const Example = () => (
  <CodeBlock
    language="tsx"
    filename="button.tsx"
    showLineNumbers
    code={buttonSource}
  />
);`;

export default function HomePage() {
  return (
    <PageContainer data-slot="home-page">
      <HeaderSection />
      <Separator />
      <CodeBlockSection />
      <Separator />
      <PropsSection />
      <Separator />
      <FooterSection />
    </PageContainer>
  );
}

const PageContainer = ({ children, ...props }: StackProps) => (
  <Stack px={4} pt={8} pb={32} gap={8} ax="stretch" fullwidth {...props}>
    {children}
  </Stack>
);
PageContainer.displayName = "PageContainer";

const HeaderSection = () => (
  <Stack data-slot="page-intro" gap={3} maxw={640}>
    <Text render={<h1 />} size={5} weight="semibold">
      CodeBlock
    </Text>
    <Text size={1} shade="muted" balance>
      A syntax-highlighted code block with a copy button, optional line numbers,
      a soft-wrap toggle, and collapsible rows.
    </Text>
  </Stack>
);
HeaderSection.displayName = "HeaderSection";

const SectionTitle = ({ children }: React.PropsWithChildren) => (
  <Text render={<h2 />} size={4} weight="semibold">
    {children}
  </Text>
);
SectionTitle.displayName = "SectionTitle";

const CodeBlockSection = () => (
  <Stack data-slot="code-block-section" id="code-example" gap={4} ax="stretch">
    <SectionTitle>Example</SectionTitle>
    <CodeBlock
      language="tsx"
      filename="example.tsx"
      code={EXAMPLE_CODE}
      showLineNumbers
    />
  </Stack>
);
CodeBlockSection.displayName = "CodeBlockSection";

const PropsSection = () => (
  <Stack data-slot="props-section" id="props" gap={3}>
    <SectionTitle>Props</SectionTitle>
    <Table<PropRow>
      items={PROPS_MOCK_DATA}
      footer={`${PROPS_MOCK_DATA.length} props`}
      bordered
      striped
    />
  </Stack>
);
PropsSection.displayName = "PropsSection";

const FooterSection = () => (
  <Group data-slot="footer-section" id="footer" gap={4} evenly>
    <Card
      render={<Link href="/" />}
      icon={ArrowLeftIcon}
      title="Previous component"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    />
    <Card
      render={<Link href="/" />}
      icon={ArrowRightIcon}
      title="Next component"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      /** @todo create reverse prop? */
      HeaderProps={{ className: "flex-row-reverse" }}
    />
  </Group>
);
FooterSection.displayName = "FooterSection";
