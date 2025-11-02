import { createReadStream } from "fs";
import { createHash } from "crypto";
import path from "path";

export const calculateHash = async (currentPath, filename) => {
  const filePath = path.resolve(currentPath, filename);
  const hash = createHash("sha256");
  const stream = createReadStream(filePath);

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      hash.update(chunk);
    });

    stream.on("end", () => {
      const result = hash.digest("hex");
      console.log(result);
      resolve();
    });

    stream.on("error", reject);
  });
};
