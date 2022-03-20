const router = require('express').Router();
const multer = require('multer');
const Product = require('../models/Product.model');

//multer config
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file){
            cb(null,'./uploads/productsImages');
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


//get all products
router.get('/',async(req,res)=>{
    const products = await Product.aggregate([
        {
            $lookup:{
                from:'categories',
                localField:'category_id',
                foreignField:'_id',
                as:'category'
            }
        },{
            $lookup:{
                from:'departments',
                localField:'department_id',
                foreignField:'_id',
                as:'department'
            }
        }
    ]);
    res.send(products);
})


//add new product
router.post('/',upload.single('image'),async(req,res)=>{
    try{

        let product = new Product(req.body);
        if(req.file){
            product.image = req.file.path;
        }else{
            product.image = './uploads/defultImages/noImage.png';
        }
        await product.save();
        res.status(200).json({status:true,message:'Product Saved'});
    }catch(error){
        res.status(500).send({status:false,message:error});
    }
})


//delete product
router.delete('/delete-product/:id',async (req,res)=>{
    try {
        const response = await Product.findByIdAndRemove(req.params.id);
        res.status(200).json({status:true,message:`${response.title} deleted`});
    } catch (error) {
        res.status(500).json({status:false,message:`Product did not delete`});
    }
})

//edit product
router.patch('/update-product/:id',upload.single('image'),async(req,res)=>{
    try{

        if(req.file){
            let updateProduct = req.body;
            updateProduct.image = req.file.path;
            const response = await Product.findByIdAndUpdate(req.params.id,updateProduct);
            return res.status(200).json({status:true,message:`${response.title} updated`});
        }
        
        const response = await Product.findByIdAndUpdate(req.params.id,req.body);
        return res.status(200).json({status:true,message:`${response.title} updated`});
    }catch(err){
        return res.status(200).json({status:false,message:err});

    }

})

//get products by category
router.get('/:categoryId/:limit',async(req,res)=>{

    const limit = Number(req.params.limit);
    let products;

    try {
        if(limit > 0){
             products  = await Product.find({category_id:req.params.categoryId}).limit(limit);
        }else{
             products  = await Product.find({category_id:req.params.categoryId});
        }
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send(error.message);
        
    }
})



//get sale products
router.get('/products/sales-products/:limit',async(req,res)=>{
    const limit = Number(req.params.limit);
    let products;

    try{
        if(limit != 0){
             products = await Product.find({onSale:true}).limit(limit);
        }else{
             products = await Product.find({onSale:true});
        }
        return res.status(200).json({status:true,data:products});

    }catch(err){
        console.log('no')
        return res.status(200).json({status:false,data:err.message});

    }
})



//get all products
router.get('/products/search-products/:search',async(req,res)=>{
  
    try {
        const products = await Product.find({title:{ $regex: new RegExp("^" + req.params.search.toLowerCase(), "i") } });
        return res.status(200).json({status:true,products:products})
    } catch (error) {
        return res.status(200).json({status:false,message:error.message});
    }
})



module.exports = router;
