import { exec } from "child_process";
import path from "path";

// Start RealtimeSTT server
console.log("Starting RealtimeSTT server...");
const sttProcess = exec(
  "stt-server --control_port 8011 --data_port 8012 --enable_realtime_transcription"
);

sttProcess.stdout.on("data", (data) => {
  console.log(`RealtimeSTT: ${data}`);
});

sttProcess.stderr.on("data", (data) => {
  console.error(`RealtimeSTT Error: ${data}`);
});

sttProcess.on("close", (code) => {
  console.log(`RealtimeSTT server exited with code ${code}`);
});

console.log(
  "RealtimeSTT server started on ports 8011 (control) and 8012 (data)"
);
