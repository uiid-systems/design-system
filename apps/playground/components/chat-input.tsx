"use client";

import { useState } from "react";

import { Button } from "@uiid/buttons";
import { Textarea } from "@uiid/forms";
import { Stack } from "@uiid/layout";

export const ChatInput = ({
  onSend,
  isLoading,
}: {
  onSend: (prompt: string) => void;
  isLoading: boolean;
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Stack gap={2} fullwidth ax="stretch">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe the UI you want to create..."
        rows={8}
        resize="none"
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <Button onClick={handleSubmit} disabled={!input.trim() || isLoading}>
        {isLoading ? "Generating..." : "Generate"}
      </Button>
    </Stack>
  );
};
ChatInput.displayName = "ChatInput";
