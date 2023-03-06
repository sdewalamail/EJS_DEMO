
const mongoose = require('mongoose');




  const productSchema = new mongoose.Schema({

    "productName": String,
      "OrderId": {
        type: String,
        default:generateOrderId()
      },
      "productDiscription": String,
     "orederDate" : {
         type: Date,
         default: Date.now()
     },
     "quantity":Number,
     "productImage": String
  
  },)


 
  // productSchema.pre('save', async function (next) {
     
  //  this.orderId = generateOrderId();

  //   next();
  // });

  function generateOrderId() {
    const date = new Date();
    const timestamp = date.getTime().toString(); 
    const randomNum = Math.floor(Math.random() * 10000).toString(); 
    const orderId = `${timestamp}-${randomNum}`;
    return orderId;
  }



  module.exports = mongoose.model("product", productSchema)