/**
 * API route for AI-powered UI generation.
 *
 * Uses Vercel AI SDK to stream responses from Claude or GPT-4o.
 * Provider is configurable via AI_PROVIDER env var (default: anthropic).
 */

import { generateText, type CoreMessage } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

import type { UITree } from "@json-render/core";

import { buildSystemPrompt } from "@/lib/system-prompt";

// Configure AI providers
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get the configured model based on environment
function getModel() {
  const provider = process.env.AI_PROVIDER || "anthropic";

  if (provider === "anthropic") {
    // Claude Sonnet 4 (3.5 Sonnet was deprecated August 2025)
    return anthropic("claude-sonnet-4-20250514");
  }

  // Default to OpenAI GPT-4o
  return openai("gpt-4o");
}

// Mock responses for testing without API credits
const MOCK_RESPONSES: Record<string, string> = {
  login: `I'll create a login form with email and password fields.

\`\`\`json
{
  "root": "login-form",
  "elements": {
    "login-form": {
      "key": "login-form",
      "type": "Card",
      "props": { "title": "Sign In", "description": "Enter your credentials to continue" },
      "children": ["form-fields"]
    },
    "form-fields": {
      "key": "form-fields",
      "type": "Stack",
      "props": { "gap": 4, "ax": "stretch" },
      "children": ["email-input", "password-input", "submit-btn"],
      "parentKey": "login-form"
    },
    "email-input": {
      "key": "email-input",
      "type": "Input",
      "props": { "label": "Email", "type": "email", "placeholder": "you@example.com", "required": true },
      "parentKey": "form-fields"
    },
    "password-input": {
      "key": "password-input",
      "type": "Input",
      "props": { "label": "Password", "type": "password", "placeholder": "Enter your password", "required": true },
      "parentKey": "form-fields"
    },
    "submit-btn": {
      "key": "submit-btn",
      "type": "Button",
      "props": { "children": "Sign In", "fullwidth": true },
      "parentKey": "form-fields"
    }
  }
}
\`\`\``,
  pricing: `I'll create a pricing card layout with three tiers.

\`\`\`json
{
  "root": "pricing",
  "elements": {
    "pricing": {
      "key": "pricing",
      "type": "Stack",
      "props": { "gap": 4 },
      "children": ["heading", "cards"]
    },
    "heading": {
      "key": "heading",
      "type": "Text",
      "props": { "size": 5, "weight": "bold", "children": "Choose Your Plan" },
      "parentKey": "pricing"
    },
    "cards": {
      "key": "cards",
      "type": "Group",
      "props": { "gap": 4, "evenly": true },
      "children": ["basic", "pro", "enterprise"],
      "parentKey": "pricing"
    },
    "basic": {
      "key": "basic",
      "type": "Card",
      "props": { "title": "Basic", "description": "$9/month - Perfect for individuals" },
      "parentKey": "cards"
    },
    "pro": {
      "key": "pro",
      "type": "Card",
      "props": { "title": "Pro", "description": "$29/month - Great for teams", "tone": "info" },
      "parentKey": "cards"
    },
    "enterprise": {
      "key": "enterprise",
      "type": "Card",
      "props": { "title": "Enterprise", "description": "$99/month - For large organizations" },
      "parentKey": "cards"
    }
  }
}
\`\`\``,
  settings: `I'll create a settings panel with toggle switches.

\`\`\`json
{
  "root": "settings",
  "elements": {
    "settings": {
      "key": "settings",
      "type": "Card",
      "props": { "title": "Settings", "description": "Manage your preferences" },
      "children": ["options"]
    },
    "options": {
      "key": "options",
      "type": "Stack",
      "props": { "gap": 4, "ax": "stretch" },
      "children": ["notifications", "dark-mode", "analytics"],
      "parentKey": "settings"
    },
    "notifications": {
      "key": "notifications",
      "type": "Switch",
      "props": { "label": "Email Notifications", "description": "Receive updates via email" },
      "parentKey": "options"
    },
    "dark-mode": {
      "key": "dark-mode",
      "type": "Switch",
      "props": { "label": "Dark Mode", "description": "Use dark theme" },
      "parentKey": "options"
    },
    "analytics": {
      "key": "analytics",
      "type": "Switch",
      "props": { "label": "Analytics", "description": "Help improve the product" },
      "parentKey": "options"
    }
  }
}
\`\`\``,
};

function getMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (
    lower.includes("login") ||
    lower.includes("sign in") ||
    (lower.includes("email") && lower.includes("password"))
  ) {
    return MOCK_RESPONSES.login;
  }
  if (
    lower.includes("pricing") ||
    lower.includes("tier") ||
    lower.includes("plan")
  ) {
    return MOCK_RESPONSES.pricing;
  }
  if (
    lower.includes("setting") ||
    lower.includes("toggle") ||
    lower.includes("switch")
  ) {
    return MOCK_RESPONSES.settings;
  }
  // Default to login form
  return MOCK_RESPONSES.login;
}

export async function POST(req: Request) {
  console.log("[API] POST /api/generate called");

  try {
    const { prompt, history, currentTree } = (await req.json()) as {
      prompt: string;
      history?: CoreMessage[];
      currentTree?: UITree;
    };

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if we should use mock mode (no API keys or explicitly enabled)
    const useMock =
      process.env.USE_MOCK === "true" ||
      (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY);

    if (useMock) {
      console.log("[API] Using mock mode");
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockResponse = getMockResponse(prompt);
      return new Response(mockResponse, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // Check for API keys
    const provider = process.env.AI_PROVIDER || "openai";
    console.log("[API] Provider:", provider);

    if (provider === "openai" && !process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (provider === "anthropic" && !process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not set" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Build system prompt with optional current tree context
    const systemPrompt = buildSystemPrompt(currentTree);

    // Build messages array with history
    const messages: CoreMessage[] = [
      ...(history || []),
      { role: "user", content: prompt },
    ];

    console.log("[API] Making API call...");

    const result = await generateText({
      model: getModel(),
      system: systemPrompt,
      messages,
    });

    console.log("[API] Response length:", result.text.length);

    return new Response(result.text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("[API] Generation error:", error);
    console.error(
      "[API] Error stack:",
      error instanceof Error ? error.stack : "no stack",
    );
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Generation failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
