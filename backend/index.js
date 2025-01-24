const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./db/index');

dotenv.config({
  path: "./env",
});
const PORT = process.env.PORT || 5000;


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port : ${process.env.port}`);
    });
  })
  .catch((error) => {
    console.log("MONGO DB connection failed! ", error);
  });
