const express = require ('express');
const mongoose =require('mongoose');
const router = express.Router();
const Product = require ('../models/product');
 const multer =require('multer');
 const path =require ('path');
 const checkAuth = require ('../middleware/check-auth');
 //storage strategy

 const storage = multer.diskStorage({
    //destination:"uploads",
    destination: function(req, file, cb) {
      // cb(null, "../uploads");
       cb(null,path.join(__dirname,"../uploads"));
      },
    // to diferenciate files with dates 
    filename :(req,file,cb) =>{
        //how the file is named 
        //cb(null,new Date().toISOString() + file.originalname);
       cb(null,file.originalname);
    },
 });
 const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

router.get('/',checkAuth, async (req,res,next) => {
    //res.send('handeling get req to /products')
   /* try{

        await product.find({})
        .then (result => {
           res.send(result)
        })
   
        }
        catch (err) {
           console.log(err)
        }*/   
        Product.find()
        .select('name price _id productImage') //define fields we want to fetch
        .exec()
        .then(docs => {
            const response = {
                count:docs.length,
               // products : docs 
               products:docs.map(doc => {
                return {
                    name:doc.name,
                    price:doc.price,
                    productImage:doc.productImage,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/' + doc._id
                    }
                }
               })
                //add url to lead us to more info about product
            };
           // console.log(docs);
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});


//--------------------------------------------
/*
router.post('/',upload.single('productImage'), (req,res,next) => {
    
    console.log(req.file);
    try{
    let product = new Product({
        //_id:new mongoose.Types.ObjectId(),
        name: req.body.name,
        price:req.body.price,
       // productimage:req.file.path

    });
    product.save();
    res.send('save done !!');
}
    catch(err){
        console.log(err);
    }
});
*/
router.post("/",checkAuth, upload.single('productimage'), (req, res, next) => {
    const product = new Product({
      //_id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path 
    });
    product
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created product successfully",
          createdProduct: {
              name: result.name,
              price: result.price,
              _id: result._id,
              request: {
                  type: 'GET',
                  url: "http://localhost:3000/products/" + result._id
              }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

//----------------------------------------
router.get('/:productId' ,(req,res,next) =>{
    const id = req.params.productId;
    /*if (id === 'special') 
    {
        res.json({message:'u have the special id',id:id});
    }
    else {
        res.send('just an id !')
    }*/
    Product.findById(id)
      .select('name price _id productImage')
      .exec()
      .then(doc => {

        console.log("from database",doc);
        if (doc){
            res.status(200).json({
                product:doc,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/"
                }
            });
        }else {
            res.status(404)
            .json({message: "no valid entry found for provided id " });
        /**
         * ! how to access uploads through request 
         *  ! there is no route 
         * todo   implement route in the products 
         * todo or make the uploads file available 
         */
        }
        
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
        
      });

});
router.put ('/:productId' ,async (req,res,next) =>{

   /*  try{
        //const {productId} =req.params;
        const {name,price} =req.body.params;

        const result = await product.validateAsync({ name, price });
        const product = await Product.findOne({
            _id: id
        });
        //product does not exist 
        if (!product){
            return next();
        }
        const updatedProduct = await Product.update({
            _id: id,
            }, {  
            $set: result},
            { upsert: true }
        );

        res.json(updatedProduct);
    } catch(error) {
        next(error);
    }*/
    const id =req.params.productId; 
    try {
        await Product.findOneAndUpdate({_id:id},{
            name:req.body.name,
            price:req.body.price,
        });
        res.send('update successful !!')
    }
    catch(err)
    {
        res.send(err)
    }
});
       
    /*const id =req.params.productId; 
    //check if we want to update both 
    const updateOps ={};
    for (const ops of req.body)
    {
        updateOps [ops.propName] =ops.value;
    }
    Product.findByIdAndUpdate({_id:id},{$set:{newName:req.body.name,newPrice:req.body.price}})
    .exec()
    .then (result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(
        err =>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });*/

router.delete ('/:productId' ,(req,res,next) =>{
    //res.send('deleted productt !!')
    //filter criteria get it from params set up
    
    const id =req.params.productId; 
    Product.remove({_id:id})
    .exec()
    .then(result  => {
        res.status(200).json(
            //result
            {
                message:'product deleted',
                request:{
                    type:'POST',
                    url :'http://localhost:3000/products',
                    body :{name:'String',price :'Number'}
                }
            }
            );
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });

});

module.exports = router ;
/**
 * ! something went wrong withposting products
 * ! related to upload img 
 *  ? it was working and suddenly no more 
 *  todo fix this !! 
 * * chekout works with the rest of my apis 
 */