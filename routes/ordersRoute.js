const router = require('express').Router();
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');



//routes

//get all Orders
router.get('/',async(req,res)=>{
    try{
        const orders = await Order.find({});
        res.status(200).json({status:true,orders:orders});
    }catch(err){
        res.status(200).json({status:false,message:err});

    }
})

//add new Order
router.post('/new-order',async(req,res)=>{
    
    try{
        let order = new Order(req.body);
        let payment = {
            creditCardType:req.body.creditCardType,
            creditCardNumber:req.body.creditCardNumber,
            creditCardOwner:req.body.creditCardOwner,
            creditCardNumberExpireDate:req.body.creditCardNumberExpireDate,
            ccvCode:req.body.ccvCode,
            paymentsNumber:req.body.paymentsNumber,
        }
        order.payment = payment;
        await order.save();
        res.status(200).json({status:true,message:'order Saved'});
    }catch(err){
        res.status(400).send(err)
    }

})


//get orders by users
router.get('/my-orders/:userId',async(req,res)=>{
    try {
        const orders = await Order.find({userId:req.params.userId}).sort({createdAt:-1});
        res.send(orders)
    } catch (error) {
        res.status(400).send(error.message);
    }
})


//update order status
router.patch('/update-status/:orderId',async (req,res)=>{
    try{
        await Order.findByIdAndUpdate(req.params.orderId,{status:req.body.status})
        res.status(200).json({status:true,message:'Status changed to: '+req.body.status});
    }catch(error){
        res.status(200).json({status:false,message:error.message});
    }
})

//get a single order by order ID
router.get('/single-order/:orderId',async(req,res)=>{

    try {
        const order = await Order.findById(req.params.orderId);
        return res.status(200).json({status:true,order:order});
    } catch (error) {
        return res.status(200).json({status:false,message:error});
        
    }
})


    

    




module.exports = router;
