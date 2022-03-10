const router = require('express').Router();
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Cart = require('../models/Cart.model');



//get cart by user id
router.get('/:userId',async(req,res)=>{

    const cart = await Cart.findOne({userId:req.params.userId});
    
    if(cart){
        let items = cart.items.reverse();
        
        return res.status(200).json({status:true,cart:items});
    }else{
        return res.status(200).json({status:false,message:"No Cart"});
    }

})



//add item to cart
router.post('/add-item',async(req,res)=>{
    
    try{
        let cart = await Cart.findOne({userId:req.body.userId});
        
        // CASE of no cart yet - create cart nd add the first item
        if(!cart){  
            let firstItem = {
                userId:req.body.userId,
                items:[{
                    productId:req.body.productId,
                    productName:req.body.productName,
                    productImage:req.body.productImage,
                    productPrice:req.body.productPrice,
                    amount:req.body.amount
                }]  
            }
            cart = new Cart(firstItem);
            await cart.save();
            return res.status(200).json({status:true,message:'Itam added'});

        }else{
            let cartItems = [...cart.items];
            // CASE cart exist and product is in cart -> update amount of item in cart
            if(cartItems.filter(element=> element.productId == req.body.productId).length > 0){   
                for(let item of cartItems){
                    if(item.productId === req.body.productId){
                        item.amount = item.amount + req.body.amount;
                    }
                }
            //CASE cart exist but the item is not in cart -> add the item to cart
            }else{  
                cartItems.push({
                    productId:req.body.productId,
                    productName:req.body.productName,
                    productImage:req.body.productImage,
                    productPrice:req.body.productPrice,
                    amount:req.body.amount
                });
            }
            await Cart.findOneAndUpdate({userId:req.body.userId,$set:{items:cartItems}});
            return res.status(200).json({status:true,message:'cart updated'});
        }
    }catch(err){
        return res.status(400).send(err)
    }


})


//update amount of item in cart
router.patch('/update-amount',async(req,res)=>{

        const userId = req.body.userId;
        const productId = req.body.productId;
        const op = req.body.op;

    try {
        let {items} = await Cart.findOne({userId:userId});
        items.forEach(element => {
            if(element.productId == productId){

                if(op == "+"){
                    element.amount ++;
                }else if(op == "-" && element.amount > 1){
                    element.amount --;
                }
            }
        });
        
        await Cart.findOneAndUpdate({userId:userId,$set:{items:items}});
        return res.status(200).json({status:true,message:'cart updated'});

    } catch (error) {
        res.status(400).send(err);
    }
})


//remove item from cart
router.patch('/remove-item',async(req,res)=>{
    
    try{

        const userId = req.body.userId;
        const productId = req.body.productId;
        
        let {items} = await Cart.findOne({userId:userId});
        
        items = items.filter(element=>element.productId != productId);
        
        await Cart.findOneAndUpdate({userId:userId,$set:{items:items}});
        return res.status(200).json({status:true,message:'item removed'});
    }catch(err){
        return res.status(500).send(err);
    }


})


//delete cart / clear cart
router.delete('/clear-cart/:userId',async(req,res)=>{
    try{
        await Cart.findOneAndRemove({userId:req.params.userId});
        return res.status(200).json({status:true,message:'Cart Cleared'});
    }catch(err){
        return res.status(500).send(err);
    }
})

module.exports = router;
