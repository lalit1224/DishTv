const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://lg23:dtBHZXMwmLBniCv3@cluster0.urh7n0j.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const productSchema = new mongoose.Schema({
  productNumber: { type: Number, required: true },
  productName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, required: true },
  percentComplete: { type: Number, required: true },
});


const Product = mongoose.model('Product', productSchema, 'product_list');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});


app.get('/fetch-tasks', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/tasks'); // Replace with the actual URL and port
    const tasks = response.data;
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});


app.post('/api/products', (req, res) => {
  const newProduct = new Product(req.body);
  console.log(newProduct)
  newProduct.save()
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      console.error('Error saving product:', err);
      res.status(500).json({ error: 'Failed to save the product' });
    });
});

app.get('/api/products', (req, res) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to fetch products' });
    });
});


// Fetch product details by ID
app.get('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;

  // Validate the product ID before querying the database
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    })
    .catch((err) => {
      console.error('Error fetching product details:', err);
      res.status(500).json({ error: 'Failed to fetch product details' });
    });
});


// Endpoint for updating product details
app.put('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;

  // Validate the product ID before updating
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  const updatedProductData = req.body;
  // Validate the updated product data here if needed

  // Find the product by ID and update its details
  Product.findByIdAndUpdate(productId, updatedProductData, { new: true })
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updatedProduct);
    })
    .catch((err) => {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Failed to update the product' });
    });
});

// Endpoint for deleting a product
app.delete('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;

  // Validate the product ID before deleting
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  // Find the product by ID and delete it
  Product.findByIdAndRemove(productId)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    })
    .catch((err) => {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Failed to delete the product' });
    });
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});