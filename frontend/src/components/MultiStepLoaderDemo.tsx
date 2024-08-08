"use client";
import React, { useState, useEffect } from "react";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface LoadingState {
  text: string;
}

const loadingStates: LoadingState[] = [
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
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const socket: Socket = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("progress", (data: { step: number }) => {
      setCurrentStep(data.step);
    });

    socket.on("complete", (message: string) => {
      console.log(message);
      setLoading(false);
    });

    socket.on("error", (error: Error) => {
      console.error(error);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startLoading = (): void => {
    setLoading(true);
    setCurrentStep(0);
    axios.get("http://localhost:4000/api/start-all").catch((error) => {
      console.error("Error starting script:", error);
      setLoading(false);
    });
  };

  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
      <Loader
        loadingStates={loadingStates.slice(0, currentStep + 1)}
        loading={loading}
        duration={2000}
      />

      {!loading && (
        <button
          onClick={startLoading}
          className="bg-[#39C3EF] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center mt-4"
          style={{
            boxShadow:
              "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
          }}
        >
          Click to load all steps
        </button>
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
  );
}
