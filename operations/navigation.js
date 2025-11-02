import fs from "fs/promises";
import path from "path";

export const goUp = (currentPath) => {
  const parentDir = path.dirname(currentPath);

  if (parentDir === currentPath) {
    return currentPath;
  }

  return parentDir;
};

export const changeDirectory = async (currentPath, targetPath) => {
  const newPath = path.resolve(currentPath, targetPath);

  const stats = await fs.stat(newPath);

  if (!stats.isDirectory()) {
    throw new Error("Not a directory");
  }

  return newPath;
};
