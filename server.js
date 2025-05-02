const express = require("express")
const dotenv = require("dotenv").config()
const authRoutes = require('./routes/authRoutes.js'); 
const cookieParser = require('cookie-parser');
const dbConnect = require("./config/dbConnect.js")
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const farmerRoutes = require("./routes/farmerRoutes.js");
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require("./routes/reviewRoutes.js")
const cors = require("cors")
const path = require('path');
const cartRoutes = require('./routes/cartRoutes');
const protect = require('./middleware/protect.js');


const app = express();
app.use(cookieParser());
// Middleware to parse JSON
app.use(express.json());

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); // allow all origins dynamically
  },
  credentials: true,
}));


dbConnect();

app.get("/",(req,res)=>{
    res.send("Agro E-com api is running");
})

app.get('/auth/me',protect, (req, res) => {
  
    res.json({ user: req.user });
   
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/auth', authRoutes);

app.use('/api', productRoutes);

app.use('/api', orderRoutes);
app.use('/api', farmerRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/reviews', reviewRoutes);

app.use('/api/cart', cartRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT ,()=>{
    console.log(`server connected on ${PORT}`)
})