const errorHandler=(err,req,res,next)=> {
    if(err instanceof CustomError) return res.status(err.statusCode).json({error:err.message});

    else res.status(500).json({error: "Internal Server Error"})

}
class CustomError extends Error{
    constructor(message, status=500){
        super(message);
        this.name=this.constructor.name;
    }
}

module.exports={errorHandler,CustomError}