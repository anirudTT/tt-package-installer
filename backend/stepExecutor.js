const { exec } = require("child_process");
const path = require("path");

const stepsDir = path.join(__dirname, "steps");

const steps = [
  { script: path.join(stepsDir, "step1.sh") },
  { script: path.join(stepsDir, "step2.sh") },
  { script: path.join(stepsDir, "step3.sh") },
  { script: path.join(stepsDir, "step4.sh") },
  { script: path.join(stepsDir, "step5.sh") },
  { script: path.join(stepsDir, "step6.sh") },
  { script: path.join(stepsDir, "step7.sh") },
  { script: path.join(stepsDir, "step8.sh") },
  { script: path.join(stepsDir, "step9.sh") },
  { script: path.join(stepsDir, "step10.sh") },
  { script: path.join(stepsDir, "step11.sh") },
];

function executeStep(index, socket) {
  return new Promise((resolve, reject) => {
    const step = steps[index];
    if (!step) {
      return reject(new Error("Step not found"));
    }

    socket.emit("progress", { step: index, status: "running" });

    exec(`sh ${step.script}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${step.script}:`, stderr);
        socket.emit("error", { step: index, error: stderr });
        return reject(error);
      }

      console.log(`Completed ${step.script}:`, stdout);
      socket.emit("progress", { step: index, status: "completed" });
      resolve();
    });
  });
}

module.exports = { executeStep, steps };
