import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';  
import path from 'path';
import {Storage}  from '@google-cloud/storage';
import {v1, SpeechClient} from '@google-cloud/speech';
import { Db, MongoClient } from "mongodb";
import cors from 'cors';

const DB_URI = 'mongodb+srv://admin:ASLgorithmPass@aslgorithm.omfm586.mongodb.net/'
const PORT = 5050
import fs from 'fs';

// const {Speech} = pkg
const app = express();
const upload = multer({ dest: 'uploads/' });

const enums = v1.enums;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Cloud Storage configuration
const storage = new Storage({
  keyFilename: './test-chirp-455919-b947a0ef0bfd.json', // Path to your service account key JSON file
});
const bucket = storage.bucket('aslgorithm-testbucket'); 
const transcriptClient = new SpeechClient({
  keyFilename: './test-chirp-455919-b947a0ef0bfd.json', // Path to your service account key JSON file
});

// app.get('/', (req, res) => {
app.use(cors());
//   console.log('hello');
// });

// Route to handle file upload and eventual transcript
app.post('/upload', upload.single('file'), async (req, res) => {
  try {

    console.log('my request file ' + req.file.originalname);
    console.log('my express director' + __dirname);

    const filePath = path.join(__dirname, req.file.path);

    // currently, save every file as same file name
    const gcsFile = bucket.file('tempfile.mp3');

    // Upload the file to Google Cloud Storage
    await gcsFile.save(fs.readFileSync(filePath), {
      contentType: 'audio/mp3',
    });


    // Optionally, you can delete the file from the server after upload
    // fs.unlinkSync(filePath);

    // res.status(200).send('File uploaded successfully');
  
    // call speech to texttranscript api

    const gcsUri = 'gs://aslgorithm-testbucket/tempfile.mp3';
    // const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      uri: gcsUri,
    };
    const config = {
      encoding: 'MP3',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableSpeakerDiarization: true,
      enableWordTimeOffsets: true,
    };

    const transcript_req = {
      audio: audio,
      config: config,
    };
    console.log('attempting to transcribe')
    // Detects speech in the audio file
    const [operation] = await transcriptClient.longRunningRecognize(transcript_req);
    console.log('performed operation, trying to resolve operation')
    const [response] = await operation.promise();
    console.log('received response')

    let transcriptArray = []

    response.results.forEach(result => {
      console.log(`Transcription: ${result.alternatives[0].transcript}`);
      result.alternatives[0].words.forEach(wordInfo => {
        // NOTE: If you have a time offset exceeding 2^32 seconds, use the
        // wordInfo.{x}Time.seconds.high to calculate seconds.
        const startSecs =
          `${wordInfo.startTime.seconds}` +
          '.' +
          wordInfo.startTime.nanos / 100000000;

        transcriptArray.push(`${startSecs} - ${wordInfo.word}`)
      });
    });
    console.log("bug 1")
    // transcript has time stamp, word the new line

    const transcript = transcriptArray.join(`\n`)
    console.log(transcript)
    console.log("bug 2")
    res.status(200).send(transcript);

  } catch (error) {
    console.error('Error uploading or transcribing filefile:', error);
    res.status(500).send('Failed to upload or transcribing file');
  }
});


app.get('/dbGet', async (req, res) => {
    console.log('fetching from database')
    try {    
      const client = new MongoClient(DB_URI);

      let conn = await client.connect();
    
      let db = conn.db("dsa");
      // for now we are hard coding looking at dsa collections. a collection is similar to a table
      let dsaCollection = await db.collection("dsa-collections");
      let results = await dsaCollection.find({}, { projection: {_id:0} })
      .limit(50)
      .toArray();
      
      console.log('result from mongoDB call');
      console.log(results);
      res.status(200).send(results);
    }
    catch (error) {
      console.error('issue fetching from mongodb: ', error)
      res.status(500).send('Failed to upload or transcribing file');
    }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});