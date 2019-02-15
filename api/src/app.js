import express from 'express';
import bodyParser from 'body-parser';

// init epress
const app = express();
//configure bodyParser for incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// assigned port variable
const PORT = 5000;
// call app to listen to the port
app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
});
