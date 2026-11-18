import { render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, it, expect, vi } from "vitest";

import * as Indicators from "../index";
import { Avatar } from "./avatar";
import * as Examples from "./avatar.examples";

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

  it("lets ContainerProps override the top-level props", () => {
    const { container } = render(
      <Avatar
        initials="AF"
        id="outer"
        ContainerProps={{ id: "inner", gap: 6 }}
      />,
    );
    const root = part(container, "avatar-container");
    expect(root).toHaveAttribute("id", "inner");
    expect(root).toHaveAttribute("data-ui-gap", "6");
  });

  it("lays out in a row by default and a column when vertical", () => {
    const { container, rerender } = render(
      <Avatar initials="AF" name="Adam" />,
    );
    expect(part(container, "avatar-container")?.className).toMatch(/group/);

    rerender(<Avatar initials="AF" name="Adam" orientation="vertical" />);
    expect(part(container, "avatar-container")?.className).toMatch(/stack/);
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
      <Avatar
        initials="AF"
        InitialsProps={{ initials: "AF", weight: "normal" }}
      />,
    );
    expect(part(container, "avatar-initials")).toHaveAttribute(
      "data-ui-weight",
      "normal",
    );
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
