const express = require("express");
const { exec } = require("child_process");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

const runScript = (scriptName, res) => {
  const scriptPath = path.join(__dirname, "steps", scriptName);
  const script = exec(`bash ${scriptPath}`);

  script.stdout.on("data", (data) => {
    io.emit("progress", data.toString());
  });

  script.stderr.on("data", (data) => {
    io.emit("error", data.toString());
  });

  script.on("close", (code) => {
    io.emit("complete", `Script ${scriptName} finished with code ${code}`);
  });

  res.send(`Script ${scriptName} started`);
};

app.get("/api/start-all", (req, res) => {
  const script = exec("bash run.sh");

  script.stdout.on("data", (data) => {
    io.emit("progress", data.toString());
  });

  script.stderr.on("data", (data) => {
    io.emit("error", data.toString());
  });

  script.on("close", (code) => {
    io.emit("complete", `All steps finished with code ${code}`);
  });

  res.send("All steps started");
});

app.get("/api/start-step/:step", (req, res) => {
  const { step } = req.params;
  const scriptName = `step${step}.sh`;
  runScript(scriptName, res);
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
