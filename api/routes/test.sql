(req,res,next) => {
    //res.send('orders were fetched')
    Order.find()
    .select('product quantity _id')
    // method to provide us of each product detail within the order
    .populate ('product')
    .exec()
    .then(docs => {
        res.status(200).json({
            count:docs.length,
            orders:docs.map(doc => {
                return {
                    _id: doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:'GET',
                        url :'http://localhost:3000/orders/'+ doc._id} }
                    })
                });
    })
    .catch(err => {
      res.status(500).json({
        error:err
      })
    })
});