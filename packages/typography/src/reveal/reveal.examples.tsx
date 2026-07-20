import { Reveal } from "./reveal";

const SAMPLE =
  "UIID is a registry-first design system. Tokens define the design language, the registry describes it semantically, and blocks compose it into product surfaces.";

export const Basic = () => <Reveal render={<p />}>{SAMPLE}</Reveal>;

export const SlowStagger = () => (
  <Reveal render={<p />} stagger={80} duration={700} blur={10}>
    Each word waits a little longer, drifts in a little softer.
  </Reveal>
);

export const Styled = () => (
  <>
    <Reveal render={<p />} size={4} weight="bold">
      Ship the same interface, everywhere.
    </Reveal>
    <Reveal render={<p />} size={1} family="serif" shade="muted" stagger={60}>
      Tokens define the language. The registry describes it. Blocks compose it.
    </Reveal>
  </>
);
