require('dotenv').config();
const express = require('express');
crypto = require('node:crypto');
const _ = require('lodash');
const cors = require('cors');
const {
  validateCreateProduct,
  validateUpdateProduct
} = require('./validateProduct');

const data = require('./mockData.json');

const app = express();
const PORT = process.env.PORT;

// route, endpoint, path

app.use(cors());
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

app.post('/api/v1/products', (req, res) => {
  const newProduct = req.body;

  const { error, value } = validateCreateProduct(newProduct);

  if (error) {
    res.status(400).send({ error });
  }

  value.id = crypto.randomUUID();

  data.push(value);
  console.log(data);
  res.send(newProduct);
});

app.patch('/api/v1/products/:id', (req, res) => {
  // destructure the id from the request params
  const { id } = req.params;

  // get the product by id
  const index = data.findIndex(product => product.id == id);
  // if the product doesn't exist? 404 - NOT FOUND
  if (index === -1) {
    res.status(404).send({ message: 'Not Found' });
    return;
  }
  // if the product is found?
  // validate the data to be updated
  const { error, value } = validateUpdateProduct(req.body);
  // validation fails? 400 - Bad Request
  if (error) {
    res.status(400).send({
      error,
      statusCode: 400,
      endUserMessage: 'Invalid data',
      data: null
    });
    return;
  }
  // validation pass? update the record (data)
  data[index] = { ...data[index], ...value };
  // res 200 + the new data
  res.send({
    error: null,
    statusCode: 200,
    endUserMessage: '',
    data: data[index]
  });
});

app.delete('/api/v1/products/:id', (req, res) => {
  // destructure the id from the request params : id=1
  const { id } = req.params;
  // find if the product record with the id exists
  const index = data.findIndex(product => product.id == id);
  // if the product doesn't exist : respond with 404 - not found
  if (index === -1) {
    res.status(404).send({ message: 'Not Found' });
    return;
  }
  // if the product exist
  // delete the product from the data set
  const deletedProduct = data.splice(index, 1);
  // return the rest of the product list, and status 200
  res.send(deletedProduct);
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
