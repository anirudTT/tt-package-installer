const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { executeStep, steps } = require("./stepExecutor");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Endpoint to start all steps
app.get("/api/start-all", (req, res) => {
  steps
    .reduce((promise, step, index) => {
      return promise.then(() => executeStep(index, io));
    }, Promise.resolve())
    .then(() => {
      io.emit("complete", "All steps completed");
    })
    .catch((error) => {
      console.error("Process terminated with error:", error);
    });

  res.send("Started all steps");
});

// Endpoint to start a specific step
app.get("/api/start-step/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (isNaN(index) || index < 0 || index >= steps.length) {
    return res.status(400).send("Invalid step index");
  }

  executeStep(index, io)
    .then(() => {
      res.send(`Step ${index} completed`);
    })
    .catch((error) => {
      res.status(500).send(`Error executing step ${index}: ${error.message}`);
    });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
