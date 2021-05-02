const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 4001;

//routes imports
const productsRoute = require('./routes/productsRoute');
const categoriesRoute = require('./routes/categoriesRoute');
const usersRoute = require('./routes/usersRoute');
const ordersRoute = require('./routes/ordersRoute');

//Connect to mongod
mongoose.connect(process.env.MONGO_URL,{
    useFindAndModify:false,
    useUnifiedTopology:true,
    useNewUrlParser:true,
}).then(console.log('Connect to MongoDB'))






//middleware
app.use(cors());
app.use(express.json());
app.use('/uploads',express.static('uploads'));

app.use('/products',productsRoute);
app.use('/categories',categoriesRoute);
app.use('/users',usersRoute);
app.use('/orders',ordersRoute);



app.get('/',(req,res)=>{
    res.send('super-market-root');
})





app.listen(PORT,()=>{console.log('Server is running on port: ' + PORT)})