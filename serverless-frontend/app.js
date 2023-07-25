const express = require('express');
const path = require('path');
const sls = require('serverless-http');
const cors = require('cors');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucketName = 'my-react-app-assets';

const app = express();
const staticPath = path.join(__dirname, 'dist');
app.use(cors());

// Serve static files from the dist folder
app.use(express.static(staticPath));

// Route for '/'
app.get('/', (req, res) => {
  const indexHtmlPath = path.join(staticPath, 'index.html');
  const indexJsPath = path.join(staticPath, 'index.js');
  const indexCssPath = path.join(staticPath, 'index.css');

  // Send multiple files in the response
  res.sendFile(indexHtmlPath);
  res.sendFile(indexJsPath);
  res.sendFile(indexCssPath);
});

// Route for '/static_page'
app.get('/static', (req, res) => {
  const indexHtmlPath = path.join(staticPath, 'index.html');
  const indexJsPath = path.join(staticPath, 'index.js');
  const indexCssPath = path.join(staticPath, 'index.css');
  const image1CssPath = path.join(staticPath, 'image1.jpg');
  const image2CssPath = path.join(staticPath, 'image2.jpg');
  const image3CssPath = path.join(staticPath, 'image3.jpg');

  // Send multiple files in the response
  res.sendFile(indexHtmlPath);
  res.sendFile(indexJsPath);
  res.sendFile(indexCssPath);
  res.sendFile(image1CssPath);
  res.sendFile(image2CssPath);
  res.sendFile(image3CssPath);
});

// Route for '/index.js'
app.get('/dev/index.js', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.js'));
});

// Route for '/index.css'
app.get('/dev/index.css', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.css'));
});

// Route for image files
app.get('/dev/:imageName', async (req, res) => {
  try {
    const { imageName } = req.params;
    const imageUrl = ''+imageName; // Replace with your S3 bucket image URL
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    const imageBuffer = Buffer.from(response.data, 'binary');
    res.set('Content-Type', 'image/jpeg');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).send('Error downloading image');
  }
});
module.exports.server = sls(app);
