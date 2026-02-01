"use client";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Textarea } from "@uiid/forms";
import { SendHorizonalIcon, CircleQuestionMark } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Popover } from "@uiid/overlays";

export const LandingScreenChat = () => {
  return (
    <Stack gap={4} ax="center" ay="center" fullwidth fullheight br={1}>
      <Card
        title="Lorem ipsum dolor sit amet"
        fullwidth
        style={{ maxWidth: "40rem" }}
      >
        <Textarea
          fullwidth
          resize="none"
          rows={4}
          placeholder="Enter a prompt to start building..."
        />

        <Group fullwidth ay="center" ax="space-between">
          <Popover
            PositionerProps={{ side: "right", align: "start" }}
            trigger={
              <Button size="small" circle ghost>
                <CircleQuestionMark size={18} />
              </Button>
            }
          >
            This is a popover.
          </Popover>

          <Button size="small" pill>
            Send
            <SendHorizonalIcon size={18} />
          </Button>
        </Group>
      </Card>
    </Stack>
  );
};
LandingScreenChat.displayName = "LandingScreenChat";
