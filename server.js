const express = require('express');
const cors = require('cors'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('src'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/public/index.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});