import { emailEnum } from "../../enums/email.enum.js";
import { EventEmitter } from "events";

export const eventEmitter=new EventEmitter();

eventEmitter.emit(emailEnum.confirmEmail,async(fn)=>{
    await fn();
})