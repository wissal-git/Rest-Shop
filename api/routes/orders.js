const { request } = require('express');
const express = require ('express');
const mongoose =require('mongoose');
const { count } = require('../models/order');
const Order = require ('../models/order');
const Product =require('../models/product');
const checkAuth = require ('../middleware/check-auth');

//register differnt routes
const router = express.Router();
const OrdersController = require("../controllers/orders");
router.get('/',checkAuth,OrdersController.orders_get_all);

router.post('/',checkAuth, (req,res,next) => {

         
  try{
    const id = req.params.productId;
    Product.findById ({id})
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }}
    )
  let order = new Order({
      product: req.body.productId,
      quantity:req.body.quantity
  });
  order.save();
  res.send('save done !!');
}
  catch(err){
      console.log(err);
  }
});
/*router.post("/", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
      .then(product => {
        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
        });
        return order.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id
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
  */
router.get ('/:orderId',checkAuth ,(req,res,next) =>{
    //sOrder.findById(req.params.orderId)
    /*res.json({
        message:'order details',
        orderId:req.params.orderId
    });*/
    Order.findById(req.params.orderId)
    .exec()
    .then(order => {
      res.status(200).json({
        order:order
      });
    })
    .catch(err => {
      res.status(500).json({
        error:err
      });
    });
  });
router.delete ('/:orderId',checkAuth ,(req,res,next) =>{
    /*res.json({
        message:'order deleted',
        orderId:req.params.orderId
    });*/
    Order.remove({
      _id:req.params.orderId
    })
    .exec()
    .then( result =>{
         res.status(200).json({
          message:'order deleted'
         });
    })
    .catch(
      err => {
        res.status(500).json({
          error:err
        });
      });
  });
  /**
 * ! if id of product don't exist it is saved any way need to fix this 
 * ! use findById 
 * * everything is working 
 *  todo  need to fix post api 
 */



module.exports = router;