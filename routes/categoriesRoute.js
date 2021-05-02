const router = require('express').Router();
const multer = require('multer');
const Categorie = require('../models/categoriesModel');

//multer config
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file){
            cb(null,'./uploads/categoriesImages');
        }
    },
    filename:(req,file,cb)=>{
        if(file){
            cb(null,new Date().toISOString()+'-'+file.originalname);
        }
    }
})

const upload = multer({storage:storage})




//get all categories
router.get('/',async(req,res)=>{
    const categories = await Categorie.find({});
    res.send(categories);
})

//add new Category
router.post('/',upload.single('image'),async(req,res)=>{
    
    let categorie = new Categorie(req.body);
    if(req.file){
        categorie.image = req.file.path;
    }else{
        categorie.image = './uploads/defultImages/noImage.png';
    }
    await categorie.save();
    res.send('categorie saved');
})

//delete category
router.delete('/remove-category/:id',async(req,res)=>{
    try {
        const response = await Categorie.findByIdAndRemove(req.params.id);
        res.status(200).send('Category ' + response.title + ' deleted');
    } catch (error) {
        res.status(400).send(error.message);
    }
})

//edit category
router.patch('/update-category/:id',upload.single('image'),async(req,res)=>{
    if(req.file){
        
        let updateCategory = (req.body)
        if(req.file){
            updateCategory.image = req.file.path;
        }
        
        const response = await Categorie.findByIdAndUpdate(req.params.id,updateCategory);
        return res.send("category "+response.title+ " updated");
    }

    const response = await Categorie.findByIdAndUpdate(req.params.id,req.body);
    return res.send("category "+response.title+ " updated");

    

})




module.exports = router;
