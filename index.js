import os from "os";
import readline from "readline";
import { stdin as input, stdout as output } from "process";
import * as fsOps from "./operations/fs.js";
import * as navOps from "./operations/navigation.js";
import * as osOps from "./operations/os.js";
import * as hashOps from "./operations/hash.js";
import * as compressOps from "./operations/compress.js";

let currentDir = os.homedir();
let username = "Anonymous";

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--username=")) {
    username = args[i].split("=")[1];
    break;
  }
}

const rl = readline.createInterface({ input, output, prompt: "" });

const showCurrentDir = () => {
  console.log(`You are currently in ${currentDir}`);
};

const showPrompt = () => {
  showCurrentDir();
  rl.prompt();
};

const parseCommand = (input) => {
  const trimmed = input.trim();
  const spaceIdx = trimmed.indexOf(" ");

  if (spaceIdx === -1) {
    return { cmd: trimmed, args: [] };
  }

  const cmd = trimmed.substring(0, spaceIdx);
  const argsStr = trimmed.substring(spaceIdx + 1).trim();
  const args = argsStr.split(" ").filter((a) => a.length > 0);

  return { cmd, args };
};

const handleCommand = async (line) => {
  const { cmd, args } = parseCommand(line);

  try {
    switch (cmd) {
      case "up":
        currentDir = navOps.goUp(currentDir);
        break;

      case "cd":
        if (args.length === 0) {
          throw new Error("Invalid input");
        }
        currentDir = await navOps.changeDirectory(currentDir, args[0]);
        break;

      case "ls":
        await fsOps.listDirectory(currentDir);
        break;

      case "cat":
        if (args.length === 0) {
          throw new Error("Invalid input");
        }
        await fsOps.readFile(currentDir, args[0]);
        break;

      case "add":
        if (args.length === 0) {
          throw new Error("Invalid input");
        }
        await fsOps.createFile(currentDir, args[0]);
        break;

      case "mkdir":
        if (args.length === 0) {
          throw new Error("Invalid input");
        }
        await fsOps.createDirectory(currentDir, args[0]);
        break;

      case "rn":
        if (args.length < 2) {
          throw new Error("Invalid input");
        }
        await fsOps.renameFile(currentDir, args[0], args[1]);
        break;

      case "cp":
        if (args.length < 2) {
          throw new Error("Invalid input");
        }
        await fsOps.copyFile(currentDir, args[0], args[1]);
        break;

      case "mv":
        if (args.length < 2) {
          throw new Error("Invalid input");
        }
        await fsOps.moveFile(currentDir, args[0], args[1]);
        break;

      case "rm":
        if (args.length === 0) {
          throw new Error("Invalid input");
        }
        await fsOps.deleteFile(currentDir, args[0]);
        break;

      case "os":
        if (args.length === 0) {
          throw new Error("Invalid input");
        }
        osOps.handleOsCommand(args[0]);
        break;

      case "hash":
        if (args.length === 0) {
          throw new Error("Invalid input");
        }
        await hashOps.calculateHash(currentDir, args[0]);
        break;

      case "compress":
        if (args.length < 2) {
          throw new Error("Invalid input");
        }
        await compressOps.compressFile(currentDir, args[0], args[1]);
        break;

      case "decompress":
        if (args.length < 2) {
          throw new Error("Invalid input");
        }
        await compressOps.decompressFile(currentDir, args[0], args[1]);
        break;

      case ".exit":
        rl.close();
        return;

      default:
        if (cmd.length > 0) {
          throw new Error("Invalid input");
        }
    }
  } catch (err) {
    if (err.message === "Invalid input") {
      console.log("Invalid input");
    } else {
      console.log("Operation failed");
    }
  }

  showPrompt();
};

console.log(`Welcome to the File Manager, ${username}!`);
showPrompt();

rl.on("line", handleCommand);

rl.on("close", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});

process.on("SIGINT", () => {
  rl.close();
});
