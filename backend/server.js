const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const stepsDir = path.join(__dirname, "steps");

const steps = [
  { script: path.join(stepsDir, "step1.sh"), time: 2000 },
  { script: path.join(stepsDir, "step2.sh"), time: 2000 },
  { script: path.join(stepsDir, "step3.sh"), time: 2000 },
  { script: path.join(stepsDir, "step4.sh"), time: 2000 },
  { script: path.join(stepsDir, "step5.sh"), time: 2000 },
  { script: path.join(stepsDir, "step6.sh"), time: 2000 },
  { script: path.join(stepsDir, "step7.sh"), time: 2000 },
  { script: path.join(stepsDir, "step8.sh"), time: 2000 },
  { script: path.join(stepsDir, "step9.sh"), time: 2000 },
  { script: path.join(stepsDir, "step10.sh"), time: 2000 },
  { script: path.join(stepsDir, "step11.sh"), time: 2000 },
];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("/api/start-all", (req, res) => {
  steps.forEach((step, index) => {
    setTimeout(() => {
      console.log(`Starting ${step.script}`); // Log the script execution
      exec(`sh ${step.script}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing ${step.script}:`, stderr);
          io.emit("error", { step: index, error: stderr });
          return;
        }
        console.log(`Completed ${step.script}:`, stdout);
        io.emit("progress", { step: index });
        if (index === steps.length - 1) {
          io.emit("complete", "All steps completed");
        }
      });
    }, step.time * index);
  });
  res.send("Started all steps");
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
