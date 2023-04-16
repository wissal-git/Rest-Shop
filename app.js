const express = require('express');
const app =express();
const productRoutes =require ('./api/routes/products');
const orderRoutes =require ('./api/routes/orders');
const uploadRoutes =require ('./api/routes/upload');
const userRoutes =require ('./api/routes/user');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose =require ('mongoose');
const cors = require('cors');
/**
 * Morgan is an HTTP request level Middleware. 
 * It is a great tool that logs the requests along with 
 * some other information depending upon its configuration and the 
 * preset used. It proves to be very helpful
 *  while debugging and also if you want to create Log files.
 */

/*app.use((req,res,next) =>{
    res.send('it works');
});*/
//to avoid deprication warning 
mongoose.Promise =global.Promise;
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}));
//extract json data and make it readable 
app.use(bodyParser.json());
app.use(cors({}));

//add headers to response 
/*
app.use((req,res,next) => {
    //res.header('Access-Control-Allow-Origin','*');
    // give access to any origin /clint 
    //,'Origin,X-Requested-With,Content-Type,Accept,Authorization'
    res.header('Access-Control-Allow-Headers');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next(error);
});*/
mongoose.set('strictQuery', true);

mongoose.connect('mongodb+srv://wissal:wissal@cluster0.py3jusi.mongodb.net/crud-project?retryWrites=true&w=majority');
//routes wich should handle requests 
app.use('/products', productRoutes)
app.use('/Addproducts', productRoutes)
app.use('/orders', orderRoutes)
app.use('/upload', uploadRoutes) // testing with image 
app.use('/user', userRoutes)

app.use('/uploads',express.static('uploads'));


//handle errors with catching 
app.use((req,res,next) => {
    const error =new Error('not found');
    error.status = 404 ;//not finding route 
    //next(error);
})
//handle any error  exmpl database fail
app.use((error,req,res,next) => {
   res.status(error.status || 500 );
   res.json({
    error:{
        message:error.message
    }
   });
});
/**
 * automatic reloading
 * default logging 
 * error handeling
 */

module.exports =app;