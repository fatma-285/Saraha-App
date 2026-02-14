import { compareSync, hashSync } from "bcrypt";

export const Hash=({cipherText,saltRounds=12}={})=>{
 return hashSync(cipherText,saltRounds);
}

export const Compare=({plainText,cipherText}={})=>{
    return compareSync(plainText,cipherText);
}