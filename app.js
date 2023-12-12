const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());


const users = [];
const products = [];


const generateUniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};


app.post('/login', (req, res) => {
  const { username, userType } = req.body;

  if (!username || !userType) {
    return res.status(400).json({ message: 'Username and userType are required' });
  }

 
  const existingUser = users.find(user => user.username === username && user.userType === userType);

  if (existingUser) {
    return res.json({ message: 'Login successful', user: existingUser });
  } else {
   
    const newUser = { id: generateUniqueId(), username, userType };
    users.push(newUser);
    return res.json({ message: 'User created and logged in', user: newUser });
  }
});


app.post('/products', (req, res) => {
  const { name, category, tags } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Name and category are required for product creation' });
  }

  
  const newProduct = {
    id: generateUniqueId(),
    name,
    category,
    tags: tags || [],
    likes: 0,
    unlikes: 0
  };

  products.push(newProduct);

  return res.json({ message: 'Product created successfully', product: newProduct });
});


app.post('/products/:productId/like', (req, res) => {
  const { productId } = req.params;

  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }


  product.likes += 1;

  return res.json({ message: 'Product liked', product });
});


app.post('/products/:productId/unlike', (req, res) => {
  const { productId } = req.params;

  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

 
  product.unlikes += 1;

  return res.json({ message: 'Product unliked', product });
});


app.get('/products', (req, res) => {
  const { category, tags } = req.query;

  
  const filteredProducts = products.filter(product => {
    return (!category || product.category === category) &&
           (!tags || tags.split(',').every(tag => product.tags.includes(tag.trim())));
  });

  return res.json(filteredProducts);
});

// Update
app.put('/products/:productId', (req, res) => {
  const { productId } = req.params;
  const { name, category, tags } = req.body;

  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (name) product.name = name;
  if (category) product.category = category;
  if (tags) product.tags = tags;

  return res.json({ message: 'Product updated successfully', product });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// curl -X POST -H "Content-Type: application/json" -d '{"username": "pavan", "userType": "customer"}' http://localhost:3000/login

// curl -X POST -H "Content-Type: application/json" -d '{"name": "Phone", "category": "Electronics", "tags": ["smart", "gadget"]}' http://localhost:3000/products

// curl -X POST http://localhost:3000/products/{id}/like

// curl -X PUT -H "Content-Type: application/json" -d '{"name": "Laptop", "category": "System", "tags": ["technology", "gadget"]}' http://localhost:3000/products/Id



