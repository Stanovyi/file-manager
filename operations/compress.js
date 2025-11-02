import { createReadStream, createWriteStream } from "fs";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { pipeline } from "stream/promises";
import path from "path";

export const compressFile = async (currentPath, source, destination) => {
  const srcPath = path.resolve(currentPath, source);
  const destPath = path.resolve(currentPath, destination);

  const readStream = createReadStream(srcPath);
  const brotli = createBrotliCompress();
  const writeStream = createWriteStream(destPath);

  await pipeline(readStream, brotli, writeStream);
};

export const decompressFile = async (currentPath, source, destination) => {
  const srcPath = path.resolve(currentPath, source);
  const destPath = path.resolve(currentPath, destination);

  const readStream = createReadStream(srcPath);
  const brotli = createBrotliDecompress();
  const writeStream = createWriteStream(destPath);

  await pipeline(readStream, brotli, writeStream);
};
