import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";

import * as Indicators from "../index";
import { Avatar } from "./avatar";

import css from "./avatar.module.css?raw";

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

  it("leaves font-weight to the Text props, not its CSS module", () => {
    expect(css).not.toMatch(/font-weight/);
  });

  it("exports its subcomponents from the package barrel", () => {
    expect(Indicators).toHaveProperty("AvatarLayers");
    expect(Indicators).toHaveProperty("AvatarImage");
    expect(Indicators).toHaveProperty("AvatarInitials");
  });
});
