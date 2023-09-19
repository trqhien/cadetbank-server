const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routers/routes');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/cadetbank-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', (error) => {
  console.error('MongoDB Connection Error:', error);
});

app.use(express.json());
app.use((req, res, next) => {
  setTimeout(next, 300);
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});