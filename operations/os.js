import os from "os";

export const handleOsCommand = (arg) => {
  switch (arg) {
    case "--EOL":
      console.log(JSON.stringify(os.EOL));
      break;

    case "--cpus":
      const cpus = os.cpus();
      console.log(`Overall amount of CPUs: ${cpus.length}`);
      cpus.forEach((cpu, idx) => {
        const ghz = (cpu.speed / 1000).toFixed(2);
        console.log(`CPU ${idx + 1}: ${cpu.model}, ${ghz} GHz`);
      });
      break;

    case "--homedir":
      console.log(os.homedir());
      break;

    case "--username":
      console.log(os.userInfo().username);
      break;

    case "--architecture":
      console.log(os.arch());
      break;

    default:
      throw new Error("Invalid input");
  }
};
