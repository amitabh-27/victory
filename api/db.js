let mongoose = require("mongoose");
let dotenv = require("dotenv");
dotenv.config();

// Connect with MongoDB using mongoose at default port 27017

mongoose.connect(
  process.env.DB_URl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, res) => {
    if (err) {
      console.log(`Failed to connect to the database. ${err.stack}`);
    } else {
      console.log(process.env.DB_URl);
      console.log('MongoDB Connected.')
    }
  }
);

