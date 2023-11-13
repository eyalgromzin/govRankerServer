import express from 'express';

const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

var cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  console.log('/')
  res.send('Hello World32!')
})

app.get('/test2', (req, res) => {
  console.log('test2')
  res.send('test 322')
});


app.listen(port, () => {
  return console.log(`Express is 22 listening at http://localhost:${port}`);
});
