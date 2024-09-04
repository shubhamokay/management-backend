const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // Enable CORS to allow requests from the frontend

app.use(cors({
    origin : 'https://management-frontend-zeta.vercel.app'
}))

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend Working')
})


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
