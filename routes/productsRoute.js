const router = require('express').Router();
const multer = require('multer');
const Product = require('../models/productsModel');

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
    const products = await Product.find({});
    res.send(products);
})

//add new product
router.post('/',upload.single('image'),async(req,res)=>{
    let product = new Product(req.body);
    if(req.file){
        product.image = req.file.path;
    }else{
        product.image = './uploads/defultImages/noImage.png';
    }
    await product.save();
    res.status(200).send('Product Saved');
})


//delete product
router.delete('/delete-product/:id',async (req,res)=>{
    try {
        const response = await Product.findByIdAndRemove(req.params.id);
        res.status(200).send(`${response.title} deleted`);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

//edit product
router.patch('/update-product/:id',upload.single('image'),async(req,res)=>{
    if(req.file){
        let updateProduct = req.body;
        updateProduct.image = req.file.path;
        const response = await Product.findByIdAndUpdate(req.params.id,updateProduct);
        return res.status(200).send(`${response.title} updated`);
    }

    const response = await Product.findByIdAndUpdate(req.params.id,req.body);
    return res.status(200).send(`${response.title} updated`);

})

//get products by category
router.get('/:category',async(req,res)=>{
    try {
        const products  = await Product.find({category:req.params.category});
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send(error.message);
        
    }
})


module.exports = router;
