
export const validation= (schema)=>{
    return (req,res,next)=>{
        let errorResult=[];
    for (const key of Object.keys(schema)) {
        // js is first callback error => abortEarly:false
        const {error}=schema[key].validate(req[key],{abortEarly:false});
        if(error){
            errorResult.push(...error.details);
        }
    }
    if(errorResult.length>0){
       return res.status(400).json({message:"validation error",error:errorResult});
    }
    next();
}
}