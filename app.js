const express = require('express');
const jwtVerify = require('./src/middleware/jwtVerify');
const cors = require('cors')


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(jwtVerify.decodeToken);

app.use(require('./src/routes/users'));
app.use(require('./src/routes/transaction'));
app.use(require('./src/routes/beneficiaries'));
app.use(require('./src/routes/bankAccount'));

app.use((req, res) => {
  res.status(404).send('404 Not Found');
})

app.listen(port, () =>
  console.log(`API Internet Banking app is listening on port ${port}!`)
);