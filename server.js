import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import { Storage } from "@google-cloud/storage";
import { v1, SpeechClient } from "@google-cloud/speech";
import { Db, MongoClient } from "mongodb";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";
import net from "net";

const DB_URI =
  "mongodb+srv://admin:ASLgorithmPass@aslgorithm.omfm586.mongodb.net/";
const PORT = 3000;
const STT_CONTROL_PORT = 8011;
const STT_DATA_PORT = 8012;

// Express app setup
const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const upload = multer({ dest: "uploads/" });

const enums = v1.enums;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Cloud Storage configuration
const storage = new Storage({
  keyFilename: "./test-chirp-455919-b947a0ef0bfd.json", // Path to your service account key JSON file
});
const bucket = storage.bucket("aslgorithm-testbucket");
const transcriptClient = new SpeechClient({
  keyFilename: "./test-chirp-455919-b947a0ef0bfd.json", // Path to your service account key JSON file
});

app.use(cors());
app.use(express.json());

// Check if STT Server is running
function checkSTTServerRunning() {
  return new Promise((resolve) => {
    // Try to connect to the control port
    const client = net.createConnection({ port: STT_CONTROL_PORT }, () => {
      // Connection successful, server is running
      client.end();
      resolve(true);
    });

    client.on("error", () => {
      // Connection failed, server is not running
      resolve(false);
    });

    // Set a timeout in case the connection hangs
    client.setTimeout(1000, () => {
      client.end();
      resolve(false);
    });
  });
}

// Create a persistent connection to RealtimeSTT data port
function createRealtimeSTTConnection() {
  return new Promise((resolve, reject) => {
    const sttSocket = new net.Socket();

    sttSocket.connect(STT_DATA_PORT, "localhost", () => {
      console.log("[DEBUG] Connected to RealtimeSTT data port");
      resolve(sttSocket);
    });

    sttSocket.on("error", (err) => {
      console.error("[ERROR] RealtimeSTT connection error:", err);
      reject(err);
    });
  });
}

// Add a default route handler for the root path
app.get("/", (req, res) => {
  res.send("ASLgorithm Server is running");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const isSTTRunning = await checkSTTServerRunning();
    res.json({
      status: "ok",
      sttServerRunning: isSTTRunning,
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to check STT server status",
      sttServerRunning: false,
    });
  }
});
// Socket.io connection handling
io.on("connection", (socket) => {
  // Check STT server status immediately on connection
  checkSTTServerRunning().then((isRunning) => {
    socket.emit("stt-status", { running: isRunning });
  });

  socket.on("check-stt-status", async () => {
    try {
      const isRunning = await checkSTTServerRunning();
      socket.emit("stt-status", { running: isRunning });
    } catch (error) {
      console.error("Error checking STT status:", error);
      socket.emit("stt-status", { running: false });
    }
  });

  let realtimeSTTSocket = null;

  // Rest of the existing connection handling code...
});

// Route to handle file upload and eventual transcript
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("my request file " + req.file.originalname);
    console.log("my express director" + __dirname);

    const filePath = path.join(__dirname, req.file.path);

    // currently, save every file as same file name
    const gcsFile = bucket.file("tempfile.mp3");

    // Upload the file to Google Cloud Storage
    await gcsFile.save(fs.readFileSync(filePath), {
      contentType: "audio/mp3",
    });

    // Optionally, you can delete the file from the server after upload
    // fs.unlinkSync(filePath);

    // call speech to texttranscript api

    const gcsUri = "gs://aslgorithm-testbucket/tempfile.mp3";
    // const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      uri: gcsUri,
    };
    const config = {
      encoding: "MP3",
      sampleRateHertz: 16000,
      languageCode: "en-US",
      enableSpeakerDiarization: true,
      enableWordTimeOffsets: true,
    };

    const transcript_req = {
      audio: audio,
      config: config,
    };
    console.log("attempting to transcribe");
    // Detects speech in the audio file
    const [operation] = await transcriptClient.longRunningRecognize(
      transcript_req
    );
    console.log("performed operation, trying to resolve operation");
    const [response] = await operation.promise();
    console.log("received response");

    let transcriptArray = [];

    response.results.forEach((result) => {
      console.log(`Transcription: ${result.alternatives[0].transcript}`);
      result.alternatives[0].words.forEach((wordInfo) => {
        // NOTE: If you have a time offset exceeding 2^32 seconds, use the
        // wordInfo.{x}Time.seconds.high to calculate seconds.
        const startSecs =
          `${wordInfo.startTime.seconds}` +
          "." +
          wordInfo.startTime.nanos / 100000000;

        transcriptArray.push(`${startSecs} - ${wordInfo.word}`);
      });
    });
    console.log("bug 1");
    // transcript has time stamp, word the new line

    const transcript = transcriptArray.join(`\n`);
    console.log(transcript);
    console.log("bug 2");
    res.status(200).send(transcript);
  } catch (error) {
    console.error("Error uploading or transcribing filefile:", error);
    res.status(500).send("Failed to upload or transcribing file");
  }
});

app.get("/dbGet", async (req, res) => {
  console.log("fetching from database");
  try {
    const client = new MongoClient(DB_URI);

    let conn = await client.connect();

    let db = conn.db("dsa");
    // for now we are hard coding looking at dsa collections. a collection is similar to a table
    let dsaCollection = await db.collection("dsa-collections");
    let results = await dsaCollection
      .find({}, { projection: { _id: 0 } })
      .limit(50)
      .toArray();

    console.log("result from mongoDB call");
    console.log(results);
    res.status(200).send(results);
  } catch (error) {
    console.error("issue fetching from mongodb: ", error);
    res.status(500).send("Failed to upload or transcribing file");
  }
});

// Start the server using the http server instance, not the Express app
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
