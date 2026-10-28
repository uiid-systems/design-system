import { Shimmer } from "./shimmer";

export const Basic = () => <Shimmer>Thinking…</Shimmer>;

export const Sizes = () => (
  <>
    <Shimmer render={<p />} my={2} size={-1}>
      Thinking…
    </Shimmer>
    <Shimmer render={<p />} my={2} size={0}>
      Thinking…
    </Shimmer>
    <Shimmer render={<p />} my={2} size={1}>
      Thinking…
    </Shimmer>
    <Shimmer render={<p />} my={2} size={2}>
      Thinking…
    </Shimmer>
    <Shimmer render={<p />} my={2} size={3}>
      Thinking…
    </Shimmer>
    <Shimmer render={<p />} my={2} size={4}>
      Thinking…
    </Shimmer>
  </>
);

export const Color = () => (
  <>
    <Shimmer render={<p />} my={2} color="blue">
      Searching the web…
    </Shimmer>
    <Shimmer render={<p />} my={2} color="purple">
      Reasoning…
    </Shimmer>
    <Shimmer render={<p />} my={2} color="green">
      Running tests…
    </Shimmer>
    <Shimmer render={<p />} my={2} color="neutral">
      Generating…
    </Shimmer>
  </>
);

export const DurationAndSpread = () => (
  <>
    <Shimmer render={<p />} my={2} duration={1000}>
      A faster sweep, one second per pass
    </Shimmer>
    <Shimmer render={<p />} my={2} duration={4000}>
      A slower sweep, four seconds per pass
    </Shimmer>
    <Shimmer render={<p />} my={2} spread={1}>
      A narrow highlight, one pixel per character
    </Shimmer>
    <Shimmer render={<p />} my={2} spread={6}>
      A wide highlight, six pixels per character
    </Shimmer>
  </>
);
