import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";

const LiveTranscription = ({ onNewConcepts }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [partialTranscription, setPartialTranscription] = useState("");
  const [error, setError] = useState(null);
  const [sttServerStatus, setSttServerStatus] = useState("checking");

  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Helper function to get audio level
  const getAudioLevel = (inputData) => {
    let sum = 0;
    for (let i = 0; i < inputData.length; i++) {
      sum += inputData[i] * inputData[i];
    }
    return Math.sqrt(sum / inputData.length);
  };

  // Helper function to convert audio format
  const convertFloat32ToInt16 = (buffer) => {
    const l = buffer.length;
    const buf = new Int16Array(l);

    for (let i = 0; i < l; i++) {
      buf[i] = Math.min(1, Math.max(-1, buffer[i])) * 0x7fff;
    }

    return buf;
  };

  // Establish Socket.IO connection
  useEffect(() => {
    // Connect to Node.js server
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      console.log("[DEBUG] Connected to server");
      setIsConnected(true);

      // Check STT server status
      socketRef.current.emit("check-stt-status");
    });

    socketRef.current.on("disconnect", () => {
      console.log("[DEBUG] Disconnected from server");
      setIsConnected(false);
      setSttServerStatus("offline");
    });

    // Handle partial transcription updates
    socketRef.current.on("partial-transcription", (data) => {
      console.log("[DEBUG] Received partial transcription:", data);
      if (data && data.text) {
        setPartialTranscription(data.text);
      }
    });

    // Handle final transcription updates
    socketRef.current.on("transcription-update", (data) => {
      console.log("[DEBUG] Received final transcription:", data);
      if (data && data.text) {
        setTranscription((prev) =>
          prev ? `${prev}\n${data.text}` : data.text
        );
        setPartialTranscription(""); // Clear partial transcription
      }
    });

    // Handle STT server status
    socketRef.current.on("stt-status", (status) => {
      console.log("[DEBUG] STT Server status:", status);
      setSttServerStatus(status.running ? "online" : "offline");
    });

    // Handle connection errors
    socketRef.current.on("error", (errorData) => {
      console.error("[DEBUG] Socket error:", errorData);
      setError(errorData.message || "Server error occurred");
      setSttServerStatus("offline");
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      stopRecording();
    };
  }, []);

  // Start recording and sending audio
  const startRecording = async () => {
    try {
      console.log("[DEBUG] Start recording clicked");

      if (!isConnected) {
        setError("Not connected to server");
        return;
      }

      // Reset transcription
      setTranscription("");
      setPartialTranscription("");

      // Get microphone access
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });
      console.log(
        "[DEBUG] Microphone access granted:",
        streamRef.current.getAudioTracks()[0].label
      );

      // Set up audio processing
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();

      const source = audioContextRef.current.createMediaStreamSource(
        streamRef.current
      );

      // Let's use AudioWorklet if available, or fall back to ScriptProcessor
      let processor;

      console.log("[DEBUG] Attempting to create ScriptProcessor");

      if (audioContextRef.current.createScriptProcessor) {
        processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        // Reset audio chunks
        audioChunksRef.current = [];

        // Connect the audio processing nodes
        source.connect(processor);
        processor.connect(audioContextRef.current.destination);

        // Process audio chunks
        processor.onaudioprocess = (e) => {
          if (isRecording && socketRef.current && socketRef.current.connected) {
            // Get audio data
            const inputData = e.inputBuffer.getChannelData(0);
            const audioData = convertFloat32ToInt16(inputData);

            console.log(
              `[DEBUG] Processing audio chunk: ${audioData.length} samples`
            );

            const audioLevel = getAudioLevel(inputData);
            console.log(`[DEBUG] Audio level: ${audioLevel.toFixed(2)}`);

            // Only send audio if the level is above a threshold (e.g., background noise)
            if (audioLevel > 0.05) {
              // Collect audio chunks
              audioChunksRef.current.push(Array.from(audioData));

              // Send to server periodically (e.g., every 5 chunks)
              if (audioChunksRef.current.length >= 5) {
                const combinedChunks = audioChunksRef.current.flat();
                console.log(
                  "[DEBUG] Sending audio chunks to server, length:",
                  combinedChunks.length
                );

                // Send via Socket.IO
                socketRef.current.emit("audio-data", {
                  audio: combinedChunks,
                  sampleRate: audioContextRef.current.sampleRate,
                });

                // Clear collected chunks
                audioChunksRef.current = [];
              }
            }
          }
        };
      } else {
        setError(
          "Your browser doesn't support the required audio processing features"
        );
        return;
      }

      // Set recording state to true
      setIsRecording(true);
      setError(null);
      console.log("[DEBUG] Recording started successfully");
    } catch (error) {
      console.error("[DEBUG] Error starting recording:", error);
      setError(`Failed to access microphone: ${error.message}`);
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    console.log("[DEBUG] Stopping recording");

    // Send any remaining audio chunks
    if (
      audioChunksRef.current.length > 0 &&
      socketRef.current &&
      socketRef.current.connected
    ) {
      const combinedChunks = audioChunksRef.current.flat();
      socketRef.current.emit("audio-data", {
        audio: combinedChunks,
        sampleRate: audioContextRef.current?.sampleRate || 44100,
        end: true, // Indicate this is the final chunk
      });
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }

    // Reset audio chunks
    audioChunksRef.current = [];

    // Update recording state
    setIsRecording(false);

    console.log("[DEBUG] Recording stopped");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-teal-800">
          Live Transcription
        </h2>
        <div className="flex items-center">
          <div
            className={`h-3 w-3 rounded-full mr-2 ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm text-gray-600 mr-4">
            {isConnected ? "Connected" : "Disconnected"}
          </span>

          <div
            className={`h-3 w-3 rounded-full mr-2 ${
              sttServerStatus === "online"
                ? "bg-green-500"
                : sttServerStatus === "checking"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            STT:{" "}
            {sttServerStatus === "online"
              ? "Ready"
              : sttServerStatus === "checking"
              ? "Checking..."
              : "Offline"}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-gray-50 p-4 rounded-lg h-32 overflow-y-auto">
          <div className="text-gray-500 italic">{partialTranscription}</div>
          <div className="text-gray-700">{transcription}</div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={!isConnected || sttServerStatus !== "online"}
            className="flex items-center justify-center py-2 px-4 bg-teal-600 rounded-md text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center py-2 px-4 bg-red-600 rounded-md text-white hover:bg-red-700"
          >
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveTranscription;
