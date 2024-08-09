"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

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

  const startSpecificStep = (): void => {
    setLoading(true);
    setLogMessages((prev) => [...prev, `Got request to run step ${selectedStep + 1}: ${steps[selectedStep].text}`]);
    axios.get(`http://localhost:4000/api/start-step/${selectedStep}?sudo=${runAsSudo}`).catch((error) => {
      console.error("Error starting script:", error);
      setLogMessages((prev) => [...prev, `Error starting script: ${error}`]);
      setLoading(false);
    });
  };

  const continueToNextStep = (): void => {
    if (selectedStep < steps.length - 1) {
      setSelectedStep((prev) => prev + 1);
    }
  };

  return (
    <div className="flex h-[70vh] w-full">
      {/* Sidebar with Scroll Area */}
      <ScrollArea className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-semibold mb-4">Steps</h2>
        <ul className="space-y-2">
          {steps.map((step, index) => (
            <li
              key={index}
              onClick={() => setSelectedStep(index)}
              className={`flex items-center cursor-pointer rounded-lg transition duration-300 ${
                selectedStep === index ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  step.status === "completed"
                    ? "bg-green-500"
                    : step.status === "running"
                    ? "bg-yellow-500"
                    : selectedStep === index
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }`}
              />
              <Separator className={`mx-2 h-px flex-1 ${selectedStep > index ? "bg-green-500" : "bg-gray-400"}`} />
              <span>{step.text}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>

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
          {steps[selectedStep].status === "completed" ? (
            <Button
              onClick={continueToNextStep}
              variant="default"
              className="mb-4"
              disabled={selectedStep >= steps.length - 1}
            >
              Continue to Next Step
            </Button>
          ) : (
            <Button
              onClick={startSpecificStep}
              variant="default"
              className="mb-4"
              disabled={loading || steps[selectedStep].status === "running"}
            >
              Run This Step
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
