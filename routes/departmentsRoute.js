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


//add new Department
router.post('/',upload.single('image'),async(req,res)=>{
    try{
        let department = new Department(req.body);
        if(req.file){
            department.image = req.file.path;
        }else{
            department.image = './uploads/defultImages/noImage.png';
        }
        await department.save();
        return res.status(200).json({status:true,message:'department saved'});
    }catch(error){
        return res.status(200).json({status:false,message:error.message});
        
    }
})

//delete Department
router.delete('/remove-department/:id',async(req,res)=>{
 
    try {
        const response = await Department.findByIdAndRemove(req.params.id);
        res.status(200).json({status:true,message:'Department ' + response.title + ' deleted'});
    } catch (error) {
        res.status(200).json({status:false,message:error.message});
    }
})

//edit Department
router.patch('/update-department/:id',upload.single('image'),async(req,res)=>{
    
    try{
        if(req.file){    
            let updateDepartment = (req.body)
            if(req.file){
                updateDepartment.image = req.file.path;
            }
            
            const response = await Department.findByIdAndUpdate(req.params.id,updateDepartment);
            return res.status(200).json({status:true,message:"Department "+response.title+ " updated"});
        }
        
        const response = await Department.findByIdAndUpdate(req.params.id,req.body);
        return res.status(200).json({status:true,message:"Department "+response.title+ " updated"});
    
    }catch(err){
        return res.status(200).json({status:false,message:err.message});

    }

    

})




module.exports = router;
