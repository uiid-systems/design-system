import { render, screen, waitFor } from "@testing-library/react";
import { Box, Stack } from "@uiid/layout";
import { createRef } from "react";
import { afterEach, describe, it, expect, vi } from "vitest";

import * as Indicators from "../index";
import { Avatar } from "./avatar";
import * as Examples from "./avatar.examples";
import type { AvatarProps } from "./avatar.types";

import badgeStyles from "../badge/badge.module.css";

const part = (container: HTMLElement, slot: string) =>
  container.querySelector(`[data-slot='${slot}']`);

/**
 * happy-dom never fetches an image, so Base UI's loading probe (`new
 * window.Image()`) would stay at "loading". This stand-in settles on the
 * next tick: any src containing "broken" errors, everything else loads.
 */
class FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  complete = false;
  naturalWidth = 0;
  crossOrigin: string | null = null;
  set src(value: string) {
    setTimeout(() => {
      if (value.includes("broken")) this.onerror?.();
      else this.onload?.();
    });
  }
}

describe("Avatar", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ============================================
  // RENDERING
  // ============================================

  it("renders the container, layers and initials with data-slot", () => {
    const { container } = render(<Avatar initials="AF" />);
    const root = part(container, "avatar-container");
    expect(root).toBe(container.firstElementChild);
    expect(root).toContainElement(
      part(container, "avatar-layers") as HTMLElement,
    );
    expect(part(container, "avatar-layers")).toContainElement(
      part(container, "avatar-initials") as HTMLElement,
    );
  });

  it("renders the name and description when given", () => {
    const { container } = render(
      <Avatar initials="AF" name="Adam Fratino" description="Engineer" />,
    );
    expect(part(container, "avatar-name")).toHaveTextContent("Adam Fratino");
    expect(part(container, "avatar-description")).toHaveTextContent("Engineer");
  });

  it("renders only the layers with no name or description", () => {
    const { container } = render(<Avatar initials="AF" />);
    expect(part(container, "avatar-name")).toBeNull();
    expect(part(container, "avatar-description")).toBeNull();
    expect(part(container, "avatar-container")?.children).toHaveLength(1);
  });

  it("drops the name column but keeps a description without a name", () => {
    const { container } = render(
      <Avatar initials="AF" description="Engineer" />,
    );
    const description = part(container, "avatar-description");
    expect(description).toHaveTextContent("Engineer");
    expect(description?.parentElement).toBe(
      part(container, "avatar-container"),
    );
  });

  it("merges className onto the container", () => {
    const { container } = render(<Avatar initials="AF" className="custom" />);
    expect(part(container, "avatar-container")).toHaveClass("custom");
  });

  it("forwards ref to the container", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Avatar initials="AF" ref={ref} />);
    expect(ref.current).toBe(part(container, "avatar-container"));
  });

  it("passes remaining props to the container", () => {
    const { container } = render(
      <Avatar initials="AF" id="me" data-testid="avatar" p={2} />,
    );
    const root = part(container, "avatar-container");
    expect(root).toHaveAttribute("id", "me");
    expect(root).toHaveAttribute("data-testid", "avatar");
    expect(root).toHaveAttribute("data-ui-p", "2");
  });

  /*
   * Type-level: `pnpm typecheck` fails if the directive goes unused. Avatar
   * spreads its own props onto the container, so every key the container
   * takes is owned and there is no ContainerProps slot to pass one through.
   */
  it("rejects a container prop passed through ContainerProps", () => {
    void (
      <Avatar
        initials="AF"
        // @ts-expect-error -- ContainerProps no longer exists; pass `gap` on Avatar
        ContainerProps={{ gap: 6 }}
      />
    );
  });

  it("lays out in a row by default and a column when vertical", () => {
    /* A row is Box's own direction, so Group adds no class for it. The column
       comes from the class Stack adds over Box, read from the real component
       rather than guessed from its hashed module name. */
    const classesOf = (element: React.ReactElement) => {
      const { container, unmount } = render(element);
      const list = [...(container.firstElementChild?.classList ?? [])];
      unmount();
      return list;
    };
    const boxClasses = classesOf(<Box />);
    const [stackClass] = classesOf(<Stack />).filter(
      (c) => !boxClasses.includes(c),
    );
    expect(stackClass).toBeDefined();

    const { container, rerender } = render(
      <Avatar initials="AF" name="Adam" />,
    );
    const root = () => part(container, "avatar-container");
    expect(root()).not.toHaveClass(stackClass as string);

    rerender(<Avatar initials="AF" name="Adam" orientation="vertical" />);
    expect(root()).toHaveClass(stackClass as string);
  });

  // ============================================
  // VARIANTS
  // ============================================

  it("tints the layers with Badge's colour treatment", () => {
    const { container } = render(<Avatar initials="AF" color="blue" />);
    const layers = part(container, "avatar-layers");
    expect(layers).toHaveClass("palette-blue");
    expect(layers).toHaveClass(badgeStyles["colored"]);
  });

  it("leaves the layers untinted without a color", () => {
    const { container } = render(<Avatar initials="AF" />);
    expect(part(container, "avatar-layers")).not.toHaveClass(
      badgeStyles["colored"],
    );
  });

  // ============================================
  // IMAGE
  // ============================================

  it("shows the initials when there is no image", () => {
    const { container } = render(<Avatar initials="AF" />);
    expect(screen.getByText("AF")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });

  it("replaces the initials with the image once it loads", async () => {
    vi.stubGlobal("Image", FakeImage);
    const { container } = render(
      <Avatar initials="AF" src="/adam.png" ImageProps={{ alt: "Adam" }} />,
    );

    const img = await screen.findByRole("img", { name: "Adam" });
    expect(img).toHaveAttribute("src", "/adam.png");
    expect(img).toHaveAttribute("data-slot", "avatar-image");
    expect(part(container, "avatar-initials")).toBeNull();
  });

  it("keeps the initials when the image fails to load", async () => {
    vi.stubGlobal("Image", FakeImage);
    const onLoadingStatusChange = vi.fn();
    const { container } = render(
      <Avatar
        initials="AF"
        src="/broken.png"
        ImageProps={{ onLoadingStatusChange }}
      />,
    );

    await waitFor(() =>
      expect(onLoadingStatusChange).toHaveBeenLastCalledWith("error"),
    );
    expect(screen.getByText("AF")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });

  it("gives the image an empty alt when the name is shown beside it", async () => {
    vi.stubGlobal("Image", FakeImage);
    const { container } = render(
      <Avatar initials="AF" name="Adam Fratino" src="/adam.png" />,
    );
    await waitFor(() => expect(container.querySelector("img")).not.toBeNull());
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("names the image from the initials when no name is shown", async () => {
    vi.stubGlobal("Image", FakeImage);
    render(<Avatar initials="AF" src="/adam.png" />);
    expect(await screen.findByRole("img", { name: "AF" })).toHaveAttribute(
      "src",
      "/adam.png",
    );
  });

  // ============================================
  // SLOT PROPS
  // ============================================

  it("lets NameProps set the name weight", () => {
    const { container } = render(
      <Avatar initials="AF" name="Adam" NameProps={{ weight: "light" }} />,
    );
    expect(part(container, "avatar-name")).toHaveAttribute(
      "data-ui-weight",
      "light",
    );
  });

  it("lets InitialsProps set the initials weight", () => {
    const { container } = render(
      <Avatar initials="AF" InitialsProps={{ weight: "normal" }} />,
    );
    expect(part(container, "avatar-initials")).toHaveAttribute(
      "data-ui-weight",
      "normal",
    );
  });

  /* Type-level: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects a key Avatar owns in its slots", () => {
    void (
      <Avatar
        initials="AF"
        // @ts-expect-error -- `src` is set on Avatar itself
        ImageProps={{ src: "/other.png" }}
      />
    );
    void (
      <Avatar
        initials="AF"
        // @ts-expect-error -- `initials` is set on Avatar itself
        InitialsProps={{ initials: "XY" }}
      />
    );
    void (
      <Avatar
        initials="AF"
        // @ts-expect-error -- `initials` is the initials' content
        InitialsProps={{ children: "XY" }}
      />
    );
    void (
      <Avatar
        initials="AF"
        name="Adam"
        // @ts-expect-error -- `name` is set on Avatar itself
        NameProps={{ name: "Other" }}
      />
    );
    void (
      <Avatar
        initials="AF"
        name="Adam"
        // @ts-expect-error -- `name` is the name's content
        NameProps={{ children: "Other" }}
      />
    );
    void (
      <Avatar
        initials="AF"
        description="Engineer"
        // @ts-expect-error -- `description` is set on Avatar itself
        DescriptionProps={{ description: "Other" }}
      />
    );
    void (
      <Avatar
        initials="AF"
        description="Engineer"
        // @ts-expect-error -- `description` is the description's content
        DescriptionProps={{ children: "Other" }}
      />
    );
  });

  // Untyped on purpose: the types reject these keys, so this pins what a
  // caller without the types gets.
  const untyped = <T,>(slot: Record<string, unknown>) => slot as T;

  it("lets the top-level values win over the same keys in the slots", async () => {
    vi.stubGlobal("Image", FakeImage);
    const { container } = render(
      <Avatar
        initials="AF"
        src="/adam.png"
        name="Adam"
        description="Engineer"
        ImageProps={untyped<AvatarProps["ImageProps"]>({ src: "/other.png" })}
        InitialsProps={untyped<AvatarProps["InitialsProps"]>({
          initials: "XY",
        })}
        NameProps={untyped<AvatarProps["NameProps"]>({ name: "Other" })}
        DescriptionProps={untyped<AvatarProps["DescriptionProps"]>({
          description: "Other role",
        })}
      />,
    );

    expect(part(container, "avatar-initials")).toHaveTextContent("AF");
    expect(part(container, "avatar-name")).toHaveTextContent("Adam");
    expect(part(container, "avatar-description")).toHaveTextContent("Engineer");
    await waitFor(() => expect(container.querySelector("img")).not.toBeNull());
    expect(container.querySelector("img")).toHaveAttribute("src", "/adam.png");
  });

  it("exports its subcomponents from the package barrel", () => {
    expect(Indicators).toHaveProperty("AvatarLayers");
    expect(Indicators).toHaveProperty("AvatarImage");
    expect(Indicators).toHaveProperty("AvatarInitials");
  });
});

describe("Avatar examples", () => {
  it.each(Object.entries(Examples))("%s renders an avatar", (_, Example) => {
    const { container } = render(<Example />);
    expect(part(container, "avatar-layers")).toBeInTheDocument();
  });
});
