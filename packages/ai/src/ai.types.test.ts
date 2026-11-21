import type {
  ChatStatus as SdkChatStatus,
  DynamicToolUIPart,
  ToolUIPart,
  UIMessage,
} from "ai";
import { describe, expectTypeOf, it } from "vitest";

import type { ChatRole, ChatStatus, ToolState } from "./ai.types";
import type { ToolPart } from "./tool/tool.types";

/* These assertions are type-level. Vitest runs them as no-ops. tsc is what fails
   when a union drifts: `pnpm typecheck` covers this file on every PR. The package
   build leaves tests out, so it does not. */
describe("ai shared types", () => {
  it("matches the AI SDK's UIMessage role", () => {
    expectTypeOf<UIMessage["role"]>().toEqualTypeOf<ChatRole>();
  });

  it("matches the AI SDK's ChatStatus", () => {
    expectTypeOf<SdkChatStatus>().toEqualTypeOf<ChatStatus>();
  });

  it("matches the AI SDK's ToolUIPart state", () => {
    expectTypeOf<ToolUIPart["state"]>().toEqualTypeOf<ToolState>();
  });

  it("accepts both of the AI SDK's tool parts as a ToolPart", () => {
    expectTypeOf<ToolUIPart>().toExtend<ToolPart>();
    expectTypeOf<DynamicToolUIPart>().toExtend<ToolPart>();
  });
});
