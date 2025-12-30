import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const Headline = () => {
  return (
    <Stack gap={8}>
      <Stack gap={4}>
        <Text render={<h1 />} size={6} bold className="flex items-center gap-4">
          The <Logo /> Design System
        </Text>

        <Text render={<p />} size={1}>
          A modern, modular component library built with{" "}
          <strong>
            <a href="https://www.typescriptlang.org/" target="_blank">
              TypeScript
            </a>
            ,{" "}
            <a href="https://vitejs.dev/" target="_blank">
              Vite
            </a>
            ,{" "}
            <strong>
              <a href="https://react.dev/" target="_blank">
                React
              </a>
            </strong>
            , and{" "}
            <a
              href="https://github.com/css-modules/css-modules"
              target="_blank"
            >
              CSS Modules
            </a>
          </strong>
          .
        </Text>
      </Stack>
    </Stack>
  );
};
Headline.displayName = "Headline";

const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 926.17 334.46"
      style={{ overflow: "visible", width: 120 }}
    >
      <path
        style={{ fill: "tomato" }}
        d="M144.17,334.46c-30.96,0-57.12-5.75-78.5-17.25-21.38-11.5-37.67-27.78-48.87-48.87C5.6,247.27,0,222.29,0,193.39V2.79h82.25v192.37c0,12.68,2.43,23.74,7.3,33.17,4.86,9.44,11.86,16.66,21.01,21.67,9.13,5.02,20.34,7.52,33.61,7.52s24.47-2.5,33.61-7.52c9.13-5.01,16.06-12.16,20.78-21.45,4.71-9.29,7.08-20.41,7.08-33.39V2.79h82.25v190.6c0,28.9-5.53,53.88-16.58,74.96-11.06,21.08-27.27,37.37-48.65,48.87-21.38,11.5-47.54,17.25-78.5,17.25Z"
      />
      <path
        style={{ fill: "tomato" }}
        d="M308.03,325.62V2.79h82.25v322.83h-82.25Z"
      />
      <path
        style={{ fill: "gold" }}
        d="M410.5,325.62V2.79h82.25v322.83h-82.25Z"
      />
      <path
        style={{ fill: "gold" }}
        d="M513.09,327.39V.14h82.25v327.25h-82.25ZM586.5,327.39v-76.95c23.66-.97,69.16,3.24,90.44-5.97,34.7-11.86,52.55-44.92,51.96-81.15.7-36.69-16.53-69.6-51.96-80.71-21.14-8.55-67.09-4.72-90.43-5.53V.14c38.74-.11,93.29-1.99,126.26,12.38,62.66,21.96,100.16,80.99,99.28,145.93,3.63,66.66-35.12,130.94-99.28,155.44-32.85,15.63-87.49,13.72-126.25,13.49Z"
      />
      <path
        style={{ fill: "mediumseagreen" }}
        d="M860.89,334.46l-61.47-23.88,48.65-142.4,68.1,24.76-55.28,141.51ZM819.76,115.12V27.56h86.68v87.56h-86.68Z"
      />
    </svg>
  );
};
