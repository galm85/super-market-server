const router = require('express').Router();
const multer = require('multer');
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const bcrypt = require('bcrypt');

//multer config
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file){
            cb(null,'./uploads/usersImages');
        }
    },
    filename:(req,file,cb)=>{
        if(file){
            cb(null,new Date().toISOString()+'-'+file.originalname);

        }
    }
})

const upload = multer({storage:storage})



//routes

//get all users
router.get('/',async(req,res)=>{
    try {
        const users = await User.find({});
        return res.status(200).json({status:true,users});
        
        
    } catch (error) {
        return res.status(200).json({status:false,message:error});
        
    }
})

//add new user - register
router.post('/',upload.single('image'),async(req,res)=>{
    
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(200).json({status:false,message:'Email is already taken'});
    }
    const salt = await bcrypt.genSalt(10);

    user = new User(req.body);

    if(user.password.length <6) return res.status(200).json({status:false,message:'Password must be al least 6 char'});

    if(req.file){
        user.image = req.file.path;
    }else{
        user.image = '/uploads/defultImages/no-user.jpeg'
    }
    
    user.password = await bcrypt.hash(req.body.password,salt);

    await user.save();
    res.json({status:true,message:`Welcome ${user.firstName}, Please Sign in`});
})


//sign in user
router.post('/sign-in',async(req,res)=>{
    
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(200).json({status:false,message:'Wrong Email or Password'});

    const compare = await bcrypt.compare(req.body.password,user.password);
    if(!compare) return res.status(200).json({status:false,message:'Wrong Email or Password'});

    res.status(200).json({status:true,message:'Welcome Back '+ user.firstName,token:user.generateToken()});
})


//delete user
router.delete('/delete-user/:id',async (req,res)=>{
    try {
        const response = await User.findByIdAndRemove(req.params.id);
        res.status(200).send(`${response.firstName} ${response.lastName} deleted`);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

//edit user
router.patch('/update-user/:userId',upload.single('image'),async(req,res)=>{
    if(req.file){
        let updateUser = req.body;
        updateUser.image = req.file.path;
        const response = await User.findByIdAndUpdate(req.params.userId,updateUser);
        return res.status(200).send(`${response.firstName} updated`);
    }

    const response = await User.findByIdAndUpdate(req.params.userId,req.body);
    return res.status(200).send(`${response.firstName} updated`);

})

//get user by id
router.get('/:userId',async(req,res)=>{
    try {
        const user  = await User.findOne({_id:req.params.userId});
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error.message);
        
    }
})



// get orders by user id
router.get('/orders/:userId',async(req,res)=>{
    try{
        const {orders} = await User.findById(req.params.userId);
        res.status(200).send(orders);
    }catch(error){
        res.status(400).send(error.message);
    }
})



//update Orders - the main update of an order from the add item to cart menu + the amount to add
router.patch('/orders/update-order/:userId',async(req,res)=>{
    let product = await Product.findById(req.body.productId);
   
    let {orders} = await User.findById(req.params.userId);
    
    for(let item of orders){
        if(item.product_id === product.id){
            item.amount =req.body.amount ;
            await User.findByIdAndUpdate(req.params.userId,{orders:orders});
            return res.send({message:'update amoun',orders:orders});
        }
        
    }

    
    let newOrder = {
        product_id:product.id,
        product_title:product.title,
        product_price:product.salePrice ? product.salePrice : product.price,
        product_image:product.image,
        amount:req.body.amount
    }

    orders.push(newOrder);
    await User.findByIdAndUpdate(req.params.userId,{orders:orders});
    return res.send({message:'new item added',orders:orders});

})

//update only the amount of product that already exist in cart uning + / - button on checkout page
router.patch('/orders/update-amount/:userId',async(req,res)=>{
    let product = await Product.findById(req.body.productId);
    let {orders} = await User.findById(req.params.userId);
    
    for(let item of orders){
        if(item.product_id === product.id && req.body.sign === '+'){
            item.amount = ++item.amount;
            await User.findByIdAndUpdate(req.params.userId,{orders:orders});
            return res.send(orders);
        }
        if(item.product_id === product.id && req.body.sign === '-'){
            item.amount = --item.amount;
            if(item.amount <= 0 ){
                orders = orders.filter(item=>item.amount >0);
            }
            await User.findByIdAndUpdate(req.params.userId,{orders:orders});
            return res.send(orders);
        }
    }
})



//remove product from cart
router.patch('/orders/remove-item/:userId',async(req,res)=>{
    try{
        let {orders} = await User.findById(req.params.userId);
        console.log(req.body);
       
        orders = orders.filter(order=>order.product_id !== req.body.productId);
        await User.findByIdAndUpdate(req.params.userId,{orders:orders});
        res.status(200).send({message:'item removed',orders:orders});
    }catch(error){
        console.log(error);
    }

})

//clear cart
router.patch('/orders/checkout/:userId',async(req,res)=>{
    try{
        await User.findByIdAndUpdate(req.params.userId,{orders:[]});
        res.status(200).send('cart cleared');
    }catch(error){
        console.log(error)
    }
})




router.patch('/change-password/:userId',async(req,res)=>{

    try{
        const user = await User.findById(req.params.userId);
        const valid = await bcrypt.compare(req.body.oldPassword,user.password);
        if(!valid){
            return res.status(200).json({status:false,message:'Wrong Password'});
        }

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.newPassword,salt);

        await User.findByIdAndUpdate(req.params.userId,{password:newPassword});
        return res.status(200).json({status:true,message:'Password Changed'})

    }catch(error){
        return res.status(200).json({status:false,message:error.message});

    }

})



module.exports = router;
