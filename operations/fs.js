import fs from "fs/promises";
import path from "path";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";

export const listDirectory = async (currentPath) => {
  const items = await fs.readdir(currentPath, { withFileTypes: true });

  const dirs = [];
  const files = [];

  for (const item of items) {
    if (item.isDirectory()) {
      dirs.push({ Name: item.name, Type: "directory" });
    } else {
      files.push({ Name: item.name, Type: "file" });
    }
  }

  dirs.sort((a, b) => a.Name.localeCompare(b.Name));
  files.sort((a, b) => a.Name.localeCompare(b.Name));

  const combined = [...dirs, ...files];

  console.table(combined);
};

export const readFile = async (currentPath, filename) => {
  const filePath = path.resolve(currentPath, filename);
  const stream = createReadStream(filePath, "utf8");

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    stream.on("end", () => {
      console.log();
      resolve();
    });

    stream.on("error", reject);
  });
};

export const createFile = async (currentPath, filename) => {
  const filePath = path.resolve(currentPath, filename);
  const handle = await fs.open(filePath, "wx");
  await handle.close();
};

export const createDirectory = async (currentPath, dirname) => {
  const dirPath = path.resolve(currentPath, dirname);
  await fs.mkdir(dirPath);
};

export const renameFile = async (currentPath, oldName, newName) => {
  const oldPath = path.resolve(currentPath, oldName);
  const newPath = path.resolve(currentPath, newName);
  await fs.rename(oldPath, newPath);
};

export const copyFile = async (currentPath, source, destination) => {
  const srcPath = path.resolve(currentPath, source);
  const destPath = path.resolve(currentPath, destination);

  const stats = await fs.stat(destPath).catch(() => null);
  let finalDest = destPath;

  if (stats && stats.isDirectory()) {
    const basename = path.basename(srcPath);
    finalDest = path.join(destPath, basename);
  }

  const readStream = createReadStream(srcPath);
  const writeStream = createWriteStream(finalDest);

  await pipeline(readStream, writeStream);
};

export const moveFile = async (currentPath, source, destination) => {
  await copyFile(currentPath, source, destination);

  const srcPath = path.resolve(currentPath, source);
  await fs.unlink(srcPath);
};

export const deleteFile = async (currentPath, filename) => {
  const filePath = path.resolve(currentPath, filename);
  await fs.unlink(filePath);
};
