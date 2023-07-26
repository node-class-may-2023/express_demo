require('dotenv').config();
const express = require('express');
crypto = require('node:crypto');
const _ = require('lodash');
const Validator = require('validatorjs');
const { validateProduct } = require('./validateProduct');

const data = require('./mockData.json');

const app = express();
const PORT = process.env.PORT;

// route, endpoint, path

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/api/v1/products', (req, res) => {
  const { color, size } = req.query;
  let products = data;

  if (color && !size) {
    products = data.filter(item => item.color === color);
  } else if (!color && size) {
    products = data.filter(item => item.size === size);
  } else if (color && size) {
    products = data.filter(item => item.color === color && item.size === size);
  }

  res.send(products);
});

app.post('/api/v1/products2', (req, res) => {
  const newProduct = req.body;

  // define a validation rule (data schema)

  const rules = {
    name: 'required|string|between:3,512',
    size: ['required', { in: ['large', 'medium', 'small'] }],
    color: 'required'
  };

  const validationResults = new Validator(newProduct, rules);

  if (validationResults.fails()) {
    res.status(400).send(validationResults.errors);
    return;
  }

  if (_.isObject(newProduct)) {
    newProduct.id = crypto.randomUUID();
  }

  data.push(newProduct);
  console.log(data);
  res.send(newProduct);
});

app.post('/api/v1/products', (req, res) => {
  const newProduct = req.body;

  const { error, value } = validateProduct(newProduct);

  if (error) {
    res.status(400).send({ error });
  }

  value.id = crypto.randomUUID();

  data.push(value);
  console.log(data);
  res.send(newProduct);
});

// query params

// route param
app.get('/api/v1/products/:id/:color', (req, res) => {
  // extract (destructure) the id from the route parameters
  const { id, color } = req.params;

  // find that id in the products list
  const product = data.find(item => item.id == id && item.color == color);

  // if no id, return not found and exit
  if (!product) {
    res.status(404).send('Not Found');
    return;
  }

  // if there id is found, return the found product
  res.send(product);
});

// catch all endpoint
app.get('*', (req, res) => {
  res
    .status(404)
    .send(
      '<html><body><p>Sorry Page Not Found. <a href="/">Home</a></p></body></html>'
    );
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
