const router = require('express').Router();
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');



//routes

//get all Orders
router.get('/',async(req,res)=>{
    const orders = await Order.find({});
    res.send(orders);
})

//add new Order
router.post('/:userId',async(req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        
        
        const order = new Order({
            userId:user._id,
            name:`${user.firstName} ${user.lastName}`,
            email:user.email,
            image:user.image,
            phone:user.phone,
            address:user.address,
            city:user.city,
            orders:user.orders,
            totalPrice:req.body.totalPrice,
            status:'new Order',
        })
        await order.save();
        res.status(200).send({order:order,message:'order Recived'});
    }catch(error){
        res.status(400).send(error.message);
    }
})


//get orders by users
router.get('/my-orders/:userId',async(req,res)=>{
    try {
        const orders = await Order.find({userId:req.params.userId})
        res.send(orders)
    } catch (error) {
        res.status(400).send(error.message);
    }
})


//update order status
router.patch('/update-status/:orderId',async (req,res)=>{
    try{
        await Order.findByIdAndUpdate(req.params.orderId,{status:req.body.status})
        res.status(200).send('Status changed to: '+req.body.status);
    }catch(error){
        res.status(400).send(error.message);
    }
})
    

    




module.exports = router;
