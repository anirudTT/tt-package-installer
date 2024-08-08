"use client";
import React, { useState, useEffect } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface Step {
  text: string;
}

const steps: Step[] = [
  { text: "System update and package installation" },
  { text: "Download and install specific packages" },
  { text: "Install Rust using rustup" },
  { text: "Clone Git repositories" },
  { text: "Run hugepages-setup.sh script" },
  { text: "Verify hugepages setup" },
  { text: "Install tt-smi using pip3" },
  { text: "Verify tt-smi installation" },
  { text: "Install tt-flash using pip" },
  { text: "Flash firmware using tt-flash" },
  { text: "Install tt-kmd using dkms" },
];

export function MultiStepLoaderDemo(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [selectedStep, setSelectedStep] = useState<number>(0);

  useEffect(() => {
    const socket: Socket = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on(
      "progress",
      (data: { step: number; status: "running" | "completed" }) => {
        setLogMessages((prev) => [
          ...prev,
          `Step ${data.step + 1}: ${data.status}`,
        ]);
      }
    );

    socket.on("complete", (message: string) => {
      setLogMessages((prev) => [...prev, message]);
      console.log(message);
      setLoading(false);
    });

    socket.on("error", (data: { step: number; error: string }) => {
      console.error(data.error);
      setLogMessages((prev) => [
        ...prev,
        `Step ${data.step + 1} failed: ${data.error}`,
      ]);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startLoading = (): void => {
    setLoading(true);
    setLogMessages([]);
    axios.get("http://localhost:4000/api/start-all").catch((error) => {
      console.error("Error starting script:", error);
      setLogMessages((prev) => [...prev, `Error starting script: ${error}`]);
      setLoading(false);
    });
  };

  const startSpecificStep = (index: number): void => {
    setLoading(true);
    setLogMessages([]);
    axios
      .get(`http://localhost:4000/api/start-step/${index}`)
      .catch((error) => {
        console.error("Error starting script:", error);
        setLogMessages((prev) => [...prev, `Error starting script: ${error}`]);
        setLoading(false);
      });
  };

  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center mt-4">
        {!loading && (
          <>
            <button
              onClick={startLoading}
              className="bg-[#39C3EF] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center mb-4"
              style={{
                boxShadow:
                  "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
              }}
            >
              Click to load all steps
            </button>
            <select
              value={selectedStep}
              onChange={(e) => setSelectedStep(Number(e.target.value))}
              className="bg-[#39C3EF] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center mb-4"
              style={{
                boxShadow:
                  "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
              }}
            >
              {steps.map((step, index) => (
                <option key={index} value={index}>
                  {`Start ${step.text}`}
                </option>
              ))}
            </select>
            <button
              onClick={() => startSpecificStep(selectedStep)}
              className="bg-[#39C3EF] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center mb-4"
              style={{
                boxShadow:
                  "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
              }}
            >
              Start Selected Step
            </button>
          </>
        )}
        {loading && (
          <button
            className="fixed top-4 right-4 text-black dark:text-white z-[120]"
            onClick={() => setLoading(false)}
          >
            <IconSquareRoundedX className="h-10 w-10" />
          </button>
        )}
      </div>

      <div className="w-full mt-4">
        <h2 className="text-lg font-semibold mb-2">Log Messages</h2>
        <div className="bg-gray-100 p-4 rounded-lg h-40 overflow-y-auto">
          {logMessages.map((msg, index) => (
            <p key={index} className="text-sm text-gray-800">
              {msg}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
