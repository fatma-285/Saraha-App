export  const successResponse=({res,status=200,message="Success",data=undefined,metaData=undefined}={})=>{
return res.status(status).json({message,metaData,data})
}