/**
 * The `uiid-recipes` command line: parses `argv` and hands it to `add` or
 * `create`. `cli.mjs` is the bin and only calls `runCli` here.
 */
import { type CliIo, q, Refusal, runAdd } from "./add.ts";
import { runCreate } from "./create.ts";

export const USAGE = `Usage: uiid-recipes add <recipe> [--cwd <dir>] [--dry-run]
       uiid-recipes create <dir> [--dry-run]

add     Copies a recipe into the Next.js app in the current directory, or in --cwd <dir>.
create  Makes a new Next.js app in <dir> with create-next-app, then puts the app shell in it.

Options:
  --cwd <dir>  add only: the app's root directory. Defaults to the current directory.
  --dry-run    Run every check and print what would be written and run, changing nothing.
  -h, --help   Print this help.`;

type Parsed =
  | { help: true }
  | {
      help: false;
      command: "add";
      recipe: string;
      cwd: string | undefined;
      dryRun: boolean;
    }
  | { help: false; command: "create"; dir: string; dryRun: boolean };

function parseArgs(argv: string[]): Parsed {
  if (argv.includes("--help") || argv.includes("-h")) return { help: true };
  const positional: string[] = [];
  let cwd: string | undefined;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--cwd") {
      const value = argv[++i];
      if (value === undefined || value === "") {
        throw new Refusal(`--cwd needs a directory: pass --cwd <dir>.`);
      }
      cwd = value;
    } else if (arg.startsWith("--cwd=")) {
      cwd = arg.slice("--cwd=".length);
      if (!cwd) throw new Refusal(`--cwd needs a directory: pass --cwd <dir>.`);
    } else if (arg.startsWith("-")) {
      throw new Refusal(
        `Unknown option ${q(arg)}: run uiid-recipes --help to see the options.`,
      );
    } else positional.push(arg);
  }
  const [command, target, ...rest] = positional;
  if (command === undefined) {
    throw new Refusal(
      `Name a command: run uiid-recipes --help to see the commands.`,
    );
  }
  if (command === "create") {
    if (cwd !== undefined) {
      throw new Refusal(
        `--cwd is an option of add only: run uiid-recipes create <dir>, naming the new app's directory.`,
      );
    }
    if (target === undefined) {
      throw new Refusal(
        `Name the directory to create: run uiid-recipes create <dir>, such as uiid-recipes create my-app.`,
      );
    }
    if (rest.length > 0) {
      throw new Refusal(
        `Unexpected argument ${q(rest[0])}: create takes one directory, so pass uiid-recipes create <dir> and nothing more.`,
      );
    }
    return { help: false, command, dir: target, dryRun };
  }
  if (command !== "add") {
    throw new Refusal(
      `Unknown command ${q(command)}: run uiid-recipes --help to see the commands.`,
    );
  }
  if (target === undefined) {
    throw new Refusal(
      `Name the recipe to add: run uiid-recipes add <recipe>, such as uiid-recipes add app-shell.`,
    );
  }
  if (rest.length > 0) {
    throw new Refusal(
      `Unexpected argument ${q(rest[0])}: add takes one recipe, so pass uiid-recipes add <recipe> and nothing more.`,
    );
  }
  return { help: false, command, recipe: target, cwd, dryRun };
}

/** The whole command: parses `argv`, runs `add` or `create`, and returns the exit code. */
export function runCli(argv: string[], io: CliIo): number {
  let parsed: Parsed;
  try {
    parsed = parseArgs(argv);
  } catch (error) {
    io.error((error as Error).message);
    return 1;
  }
  if (parsed.help) {
    io.log(USAGE);
    return 0;
  }
  return parsed.command === "add"
    ? runAdd(parsed.recipe, parsed.cwd, parsed.dryRun, io)
    : runCreate(parsed.dir, parsed.dryRun, io);
}
