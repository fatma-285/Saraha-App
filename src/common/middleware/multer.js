import multer from "multer";
import fs from "node:fs";
export const multer_local=({custom_path="General",custom_types=[]}={})=>{
    const full_path=`uploads/${custom_path}`;
    if(!fs.existsSync(full_path)){
     fs.mkdirSync(full_path,{recursive:true});
    } 
    const storage=multer.diskStorage({
        
        destination:function(req,file,cb){
           cb(null,full_path);
        },

        filename:function(req,file,cb){
            const prefix=Date.now()+"-"+Math.round(Math.random()*1e9);
            // cb(null,"fatma.png");
            cb(null,prefix+"-"+ file.originalname);
        }
    })
    const fileFilter=(req,file,cb)=>{
        if(!custom_types.includes(file.mimetype)){
           cb(new Error("invalid file type"),false);
        }
        cb(null,true); 
    }
    const upload=multer({storage,fileFilter});
    // memory
    // const upload=multer({});
    return upload; 
}

//return buffer
export const multer_memory=()=>{
    const storage=multer.diskStorage();
    const upload=multer({storage});
    return upload;
}

//like memory but return path not buffer
export const multer_host=(custom_types=[])=>{
    
    const storage=multer.diskStorage({})
    const fileFilter=(req,file,cb)=>{
        if(!custom_types.includes(file.mimetype)){
           cb(new Error("invalid file type"),false);
        }
        cb(null,true); 
    }
    const upload=multer({storage,fileFilter});
    return upload; 
}
