
  function bodyValidator (schema) {

        return  async (req, res, next) => {
          
            try {
            
            const result = await schema.validateAsync(req.body);
        
          //  console.log("validate user sucessfully")
           next();
  
      } catch (error) {

          let errorMessage = " ";
         for (const err of error.details) {
          // errorMessage += " [ " + err.path.join(" > ") + err.message.slice(err.message.lastIndexOf("\"") + 1) + " ] ";
           errorMessage += "[" + err.message.split(":")[0].replaceAll('"', '') + "]"
      }
         res.status(400).send(errorMessage)
         console.log(error);

       }
    }
        
  }

   

      



   module.exports = bodyValidator ;

