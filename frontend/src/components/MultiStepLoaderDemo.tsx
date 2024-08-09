"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface Step {
  text: string;
  status?: "pending" | "completed" | "running" | "failed";
}

const steps: Step[] = [
  { text: "System update and package installation", status: "pending" },
  { text: "Download and install specific packages", status: "pending" },
  { text: "Install Rust using rustup", status: "pending" },
  { text: "Clone Git repositories", status: "pending" },
  { text: "Run hugepages-setup.sh script", status: "pending" },
  { text: "Verify hugepages setup", status: "pending" },
  { text: "Install tt-smi using pip3", status: "pending" },
  { text: "Verify tt-smi installation", status: "pending" },
  { text: "Install tt-kmd using dkms", status: "pending" },
  { text: "Install tt-flash using pip", status: "pending" },
  { text: "Flash firmware using tt-flash", status: "pending" },
];

export function MultiStepLoaderDemo(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [runAsSudo, setRunAsSudo] = useState<boolean>(false);

  useEffect(() => {
    const socket: Socket = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("progress", (data: { step: number; status: "running" | "completed" }) => {
      setLogMessages((prev) => [...prev, `Step ${data.step + 1}: ${data.status}`]);
      steps[data.step].status = data.status;
    });

    socket.on("complete", (message: string) => {
      setLogMessages((prev) => [...prev, message]);
      console.log(message);
      setLoading(false);
      if (selectedStep < steps.length - 1) {
        setSelectedStep((prev) => prev + 1);
      }
    });

    socket.on("error", (data: { step: number; error: string }) => {
      console.error(data.error);
      setLogMessages((prev) => [...prev, `Step ${data.step + 1} failed: ${data.error}`]);
      steps[data.step].status = "failed";
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startLoading = (): void => {
    setLoading(true);
    setLogMessages((prev) => [...prev, "Got request to run all steps"]);
    axios.get(`http://localhost:4000/api/start-all?sudo=${runAsSudo}`).catch((error) => {
      console.error("Error starting script:", error);
      setLogMessages((prev) => [...prev, `Error starting script: ${error}`]);
      setLoading(false);
    });
  };

  const startSpecificStep = (): void => {
    setLoading(true);
    setLogMessages((prev) => [...prev, `Got request to run step ${selectedStep + 1}: ${steps[selectedStep].text}`]);
    axios.get(`http://localhost:4000/api/start-step/${selectedStep}?sudo=${runAsSudo}`).catch((error) => {
      console.error("Error starting script:", error);
      setLogMessages((prev) => [...prev, `Error starting script: ${error}`]);
      setLoading(false);
    });
  };

  return (
    <div className="flex h-[70vh] w-full">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-semibold mb-4">Steps</h2>
        <ul className="space-y-2">
          {steps.map((step, index) => (
            <li
              key={index}
              onClick={() => setSelectedStep(index)}
              className={`flex items-center p-2 cursor-pointer rounded-lg ${
                selectedStep === index ? "bg-gray-600" : "hover:bg-gray-700"
              } transition duration-300`}
            >
              <span
                className={`mr-2 h-2 w-2 rounded-full ${
                  step.status === "completed"
                    ? "bg-green-500"
                    : step.status === "running"
                    ? "bg-yellow-500"
                    : step.status === "failed"
                    ? "bg-red-500"
                    : "bg-gray-400"
                }`}
              />
              <span>{step.text}</span>
              <Badge
                variant={
                  step.status === "completed"
                    ? "success"
                    : step.status === "running"
                    ? "secondary"
                    : step.status === "failed"
                    ? "destructive"
                    : "default"
                }
                className="ml-auto"
              >
                {step.status}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="w-3/4 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <Card className="mb-4 p-4">
            <h3 className="text-xl font-semibold mb-2">{steps[selectedStep].text}</h3>
            <p>Details and instructions for the selected step will go here.</p>
          </Card>

          <div className="flex items-center mt-4">
            <Checkbox
              checked={runAsSudo}
              onCheckedChange={(checked) => setRunAsSudo(checked === true)}
              className="mr-2"
            />
            <label>Run as sudo</label>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Log Messages</h2>
            <div className="bg-gray-700 p-4 rounded-lg h-40 overflow-y-auto">
              {logMessages.map((msg, index) => (
                <p key={index} className="text-sm">
                  {msg}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            onClick={startSpecificStep}
            variant="default"
            className="mb-4"
            disabled={steps[selectedStep].status === "completed"}
          >
            Run This Step
          </Button>

          <Button
            onClick={startSpecificStep}
            variant="default"
            className="mb-4"
            disabled={selectedStep >= steps.length - 1 || loading}
          >
            Continue to Next Step
          </Button>
        </div>
      </div>
    </div>
  );
}
