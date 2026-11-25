import { Reveal } from "./reveal";

/** Shared with the Reveal story's playground, so the two samples can't drift. */
export const REVEAL_SAMPLE =
  "UIID is a modular React component library. Design tokens define the visual language, and components built on Base UI compose it into product surfaces.";

export const Basic = () => <Reveal render={<p />}>{REVEAL_SAMPLE}</Reveal>;

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
    <Reveal
      render={<p />}
      size={1}
      family="serif"
      emphasis="muted"
      stagger={60}
    >
      Tokens define the language. Components compose it.
    </Reveal>
  </>
);
