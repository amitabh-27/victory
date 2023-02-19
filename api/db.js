let mongoose = require("mongoose");
let dotenv = require("dotenv");
dotenv.config();

// Connect with MongoDB using mongoose at default port 27017

mongoose.connect(
  "mongodb://127.0.0.1:27017/victory",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, res) => {
    if (err) {
      console.log(`Failed to connect to the database. ${err.stack}`);
    } else {
      console.log('MongoDB Connected.')
    }
  }
);

