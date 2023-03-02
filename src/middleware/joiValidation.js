function bodyValidator(schema) {
  return async (req, res, next) => {
    try {
      const result = await schema.validateAsync(req.body);
      //  console.log("validate user sucessfully")

      next();

    } catch (er) {
      let error = {}

        //  console.log(er);
      er.details.forEach((err) => {
        console.log(err.type);
        switch (err.type) {
          case "string.empty":
            error.message = `${err.context.key} should not be empty!`;
            break;
          case "string.pattern.base":
            error.message = `${err.context.key} is bad formated`;
            break;
          case "string.max":
            error.message = `${err.context.key}  should have at most ${err.local?.limit} characters!`;
            break;
          case "string.empty":
            error.message = `${err.context.key} can not be empty`;
            break;
          case "string.base":
            error.message = `Provided proper Email `;
            break;
          case "any.required":
            error.message = `Required ${err.context.key} `;
            break;
          default:
            error.message = `Something went wrong please try agian`;
        }
      });

       req.validationError=error;
       return next();
    }
  };
}


module.exports = bodyValidator;
