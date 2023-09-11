// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://lg23:dtBHZXMwmLBniCv3@cluster0.urh7n0j.mongodb.net/?retryWrites=true&w=majority/product_list', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });