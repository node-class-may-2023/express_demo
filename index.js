require('dotenv').config();
const express = require('express');
const data = require('./mockData.json');

const app = express();
const PORT = process.env.PORT;

// route, endpoint, path

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
