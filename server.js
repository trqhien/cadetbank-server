// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerOptions = require('./swaggerOptions')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const routes = require('./routers/routes');
const swaggerAccessRestriction = require('./middleware/swaggerAccessRestriction');

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  setTimeout(next, 300);
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));
app.use('/api', swaggerAccessRestriction, routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
