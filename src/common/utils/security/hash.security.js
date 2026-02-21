import { compareSync, hashSync } from "bcrypt";

export const Hash=({cipherText,saltRounds=process.env.SALT_ROUNDS}={})=>{
 return hashSync(cipherText,Number(saltRounds));
}

export const Compare=({plainText,cipherText}={})=>{
    return compareSync(plainText,cipherText);
}