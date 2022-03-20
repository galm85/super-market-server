const router = require('express').Router();
const multer = require('multer');
const Categorie = require('../models/Category.Model');

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
    const categories = await Categorie.aggregate([
        {
            $lookup:{
                from:'departments',
                localField:'department_id',
                foreignField:'_id',
                as:'department'
            }
        }
    ]);
    res.send(categories);
})

//GET USING POPULATE
// ====================================================
// router.get('/',async(req,res)=>{
//     let categories = await Categorie.find({}).populate('department_id','title');
    
//     categories = categories.map(cat=> {
//         return {
//             _id:cat._id,
//             title:cat.title,
//             image:cat.image,
//             location:cat.location,
//             department_id:cat.department_id._id,
//             department: cat.department_id.title
//         }
//     });
    
//     res.send(categories);
  
// })

//add new Category
router.post('/',upload.single('image'),async(req,res)=>{
    
   

    try{

        let categorie = new Categorie(req.body);
        if(req.file){
            categorie.image = req.file.path;
        }else{
            categorie.image = './uploads/defultImages/noImage.png';
        }
        await categorie.save();
        res.status(200).send({status:true,message:'categorie saved'});
    }catch(err){
        res.status(500).send({status:false,message:'categorie saved '+err});

    }
})

//delete category
router.delete('/remove-category/:id',async(req,res)=>{
    try {
        const response = await Categorie.findByIdAndRemove(req.params.id);
        res.status(200).json({status:true,message:'Category ' + response.title + ' deleted'});
    } catch (error) {
        res.status(500).json({status:false,message:error.message});
    }
})

//edit category
router.patch('/update-category/:id',upload.single('image'),async(req,res)=>{
    try{

        if(req.file){
            
            let updateCategory = (req.body)
            if(req.file){
                updateCategory.image = req.file.path;
            }
            
            const response = await Categorie.findByIdAndUpdate(req.params.id,updateCategory);
            return res.json({status:true,message:"category "+response.title+ " updated"});
        }
        
        const response = await Categorie.findByIdAndUpdate(req.params.id,req.body);
        return res.json({status:true,message:"category "+response.title+ " updated"});
    }catch(err){
        return res.json({status:false,message:err});

    }

    

})



//get all categories by department ID
router.get('/category-by-department/:departmentId',async(req,res)=>{

    try{
        const categories = await Categorie.find({department_id:  req.params.departmentId});
        res.status(200).json({status:true,categories:categories});
    }catch(err){
        res.status(500).json({status:false,message:err});
    }

})





module.exports = router;
