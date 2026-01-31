import { describe, it, expect } from "vitest";
import {
  Size,
  FormSize,
  Tone,
  Shade,
  MarginValue,
  SpacingPropsSchema,
  BorderPropsSchema,
  LayoutPropsSchema,
} from "./shared";

describe("Size enum", () => {
  it("accepts valid sizes", () => {
    for (const v of ["xsmall", "small", "medium", "large"]) {
      expect(Size.safeParse(v).success).toBe(true);
    }
  });

  it("rejects invalid values", () => {
    expect(Size.safeParse("huge").success).toBe(false);
    expect(Size.safeParse(42).success).toBe(false);
  });
});

describe("FormSize enum", () => {
  it("accepts small, medium, large", () => {
    for (const v of ["small", "medium", "large"]) {
      expect(FormSize.safeParse(v).success).toBe(true);
    }
  });

  it("rejects xsmall", () => {
    expect(FormSize.safeParse("xsmall").success).toBe(false);
  });
});

describe("Tone enum", () => {
  it("accepts valid tones", () => {
    for (const v of ["positive", "critical", "warning", "info"]) {
      expect(Tone.safeParse(v).success).toBe(true);
    }
  });

  it("rejects invalid values", () => {
    expect(Tone.safeParse("danger").success).toBe(false);
  });
});

describe("Shade enum", () => {
  it("accepts valid shades", () => {
    for (const v of [
      "background",
      "surface",
      "accent",
      "halftone",
      "muted",
      "foreground",
    ]) {
      expect(Shade.safeParse(v).success).toBe(true);
    }
  });

  it("rejects invalid values", () => {
    expect(Shade.safeParse("dark").success).toBe(false);
  });
});

describe("MarginValue", () => {
  it("accepts numbers", () => {
    expect(MarginValue.safeParse(8).success).toBe(true);
    expect(MarginValue.safeParse(0).success).toBe(true);
  });

  it('accepts "auto"', () => {
    expect(MarginValue.safeParse("auto").success).toBe(true);
  });

  it("rejects other strings", () => {
    expect(MarginValue.safeParse("10px").success).toBe(false);
    expect(MarginValue.safeParse("none").success).toBe(false);
  });
});

describe("SpacingPropsSchema", () => {
  it("accepts valid spacing props", () => {
    const result = SpacingPropsSchema.safeParse({ gap: 4, p: 8, mx: "auto" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    expect(SpacingPropsSchema.safeParse({}).success).toBe(true);
  });

  it("rejects non-number padding values", () => {
    expect(SpacingPropsSchema.safeParse({ p: "8px" }).success).toBe(false);
  });
});

describe("BorderPropsSchema", () => {
  it("accepts valid border props", () => {
    const result = BorderPropsSchema.safeParse({ b: 1, bt: 2 });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    expect(BorderPropsSchema.safeParse({}).success).toBe(true);
  });

  it("rejects non-number values", () => {
    expect(BorderPropsSchema.safeParse({ b: "thin" }).success).toBe(false);
  });
});

describe("LayoutPropsSchema", () => {
  it("accepts valid layout values", () => {
    const result = LayoutPropsSchema.safeParse({
      ax: "center",
      ay: "start",
      direction: "row",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid alignment values", () => {
    expect(LayoutPropsSchema.safeParse({ ax: "left" }).success).toBe(false);
  });

  it("accepts empty object", () => {
    expect(LayoutPropsSchema.safeParse({}).success).toBe(true);
  });
});
