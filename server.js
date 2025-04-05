import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import Storage from 'google-cloud/storage'
// const {Storage} = require('@google-cloud/storage');


const BUCKET_NAME= 'aslgorithm-testbucket';
const DISTINATION_FILE = 'destfile.mp3'
const app = express();
const PORT = 3000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The path to your file to upload
// const filePath = 'path/to/your/file';

// The new ID for your GCS file
// const destFileName = 'your-new-file-name';

// Imports the Google Cloud client library

// Creates a client
const storage = new Storage();

async function uploadFile(filePath) {
  const options = {
    destination: DISTINATION_FILE,
    // Optional:
    // Set a generation-match precondition to avoid potential race conditions
    // and data corruptions. The request to upload is aborted if the object's
    // generation number does not match your precondition. For a destination
    // object that does not yet exist, set the ifGenerationMatch precondition to 0
    // If the destination object already exists in your bucket, set instead a
    // generation-match precondition using its generation number.
    // preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
  };

  await storage.bucket(BUCKET_NAME).upload(filePath, options);
  console.log(`${filePath} uploaded to ${BUCKET_NAME}`);
}

uploadFile().catch(console.error);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});