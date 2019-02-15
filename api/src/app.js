import express from 'express';

// init epress
const app = express();

// assigned port variable
const PORT = 5000;
// call app to listen to the port
app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
});
