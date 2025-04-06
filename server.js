import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';  
import path from 'path';
import {Storage}  from '@google-cloud/storage';
import {v1, SpeechClient} from '@google-cloud/speech';
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


    // // write transcript file syncronously to utils folder
    // fs.writeFile('./src/utils/transcript.txt', transcript, (err) => {
    //   if (err) {
    //     console.log("issue!!!");
    //     throw Error("issue writing file to utils folder");
    //   }
    //   else {
    //     console.log("saved file successfully");
    //   }
    // });

  } catch (error) {
    console.error('Error uploading or transcribing filefile:', error);
    res.status(500).send('Failed to upload or transcribing file');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});