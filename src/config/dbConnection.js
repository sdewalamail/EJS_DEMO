const mongoose = require('mongoose');
require('dotenv').config();


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  };

module.exports =  async () =>  {
    try {
        mongoose.connect(process.env.DataBaseConnection, options)
        
    } catch (error) {
         console.log("Data base not connected" ,   error);
        process.exit(1)
    }
}





