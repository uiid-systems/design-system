import { House } from "@uiid/icons";
import { Stack } from "@uiid/layout";
import { Text, type TextProps } from "@uiid/typography";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Stack gap={4} ax="center" fullwidth>
          <House size={24} strokeWidth={3} />
          {Array.from({ length: 8 }).map((_, i) => (
            <Text key={i} level={i as TextProps["level"]}>
              TKTKTKTK
            </Text>
          ))}
        </Stack>
      </main>
    </div>
  );
}
