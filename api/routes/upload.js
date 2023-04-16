const express =require ("express");
const router =express.Router();
const multer =require ("multer");
const path = require ("path");

const storage = multer.diskStorage ({
     //determine path for images 
    destination : function (req,file,cb){
        cb(null,path.join(__dirname,"../uploads"));
    },
    filename :function(req,file,cb){
        cb(null,file.originalname);
    }
});
const upload = multer ({storage :storage})
//upload one image and give file name 
router.post('/',upload.single("image"),(req,res)=> {
    res.status(200).json({message :"image uploaded"});

})

module.exports = router;