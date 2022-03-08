const router = require('express').Router();
const multer = require('multer');
const Department = require('../models/Department.model');

//multer config
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file){
            cb(null,'./uploads/departmentsImages');
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
    try{
        const departments = await Department.find({});
        res.status(200).send(departments);
    }catch(err){
        res.status(400).send(error);
    }
})


//add new Category
router.post('/',upload.single('image'),async(req,res)=>{
    
    try{
        let department = new Department(req.body);
        if(req.file){
            department.image = req.file.path;
        }else{
            department.image = './uploads/defultImages/noImage.png';
        }
        await department.save();
        res.status(200).send('department saved');
    }catch(error){
        res.status(400).send(error)
    }
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
