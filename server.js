const express = require('express');
const cors = require('cors');
const port = 4500;
const mongoose = require('mongoose');
const Games = require('./API/Models/HexReviewsAPIModel');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

//  Initialising app variable.
const app = express();

//  Setup EJS.
app.set('view engine', 'ejs');

//  Setup static directories.
app.use(express.static(__dirname + '/CSS'));
app.use(express.static(__dirname + '/Logic'));

// Configuring app.
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

//  MongoDB configuration.
const mongoURI = 'mongodb://localhost/hex-reviews-database';

//  Mongoose connection details to MongoDB.
const conn = mongoose.createConnection(mongoURI);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hex-reviews-database')

//  Initialise GFS.
let gfs;

// Initialise GridFS stream.
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

var storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/AddGamePage');
});

//  Display all file's data.
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if(!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist.'
      });
    }

    return res.json(files);
  });
});

//  Display a single files's data.
app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) =>{
    if(!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exist.'
      });
    }

    return res.json(file);
  });
});

//  Display a single image.
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) =>{
    if(!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exist.'
      });
    }
    
    if(file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res)
    } else {
      res.status(404).json({
        err: 'Not an image'
      })
    }
  });
});

app.get('/AddGamePage', (req, res) =>  {
  gfs.files.find().toArray((err, files) => {
    if(!files || files.length === 0) {
      res.render('HexReviewsAddGamePage', {files: false});
      
    } else {
      files.map(file => {
        if(file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('HexReviewsAddGamePage', {files: files});
    }
  });
});

app.delete('/files/:id', (req, res) => {
  gfs.remove({_id: req.params.id, root: 'uploads'}, (err, gridStore) => {
    if(err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/AddGamePage');
  });
});

app.get('/ViewGamesPage', (req, res) => res.render('HexReviewsViewGamesPage.ejs'));
app.get('/ViewSingleGamePage', (req, res) => res.render('HexReviewsViewSingleGamePage.ejs'));

var routes = require('./API/Routes/HexReviewsAPIRoutes');
routes(app);

app.listen(port);

console.log('Hex Reviews API server started on port: ' + port);