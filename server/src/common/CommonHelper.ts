import * as crypto from "crypto";
import { EnumErrorCode } from "../enum/ErrorCode";

module.exports ={
    HashPassword: function(saltKey, password)
    {
        let encryptTimes = 1024;
        password = saltKey + password;
        for(var i=0; i<encryptTimes; i++)
        {
            password = this.Hash(password);
        }
        return password;
    },

    Hash: function(value)
    {
        let buffer = Buffer.from(value);
        let decrypt = crypto.createHash('sha1');
        decrypt.update(buffer);
        let hexString = decrypt.digest('hex');
        return hexString;
    },

    isGuid: function(guid:string)
    {
        let regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
        return regexGuid.test(guid);
    },

    GetErrorMessage: async function (errorCode: number, details: string) {
        let errorTitle = EnumErrorCode['errorCode_'+errorCode];
        let errorMsg = {
            status: errorCode,
            title: errorTitle,
            details: details || errorTitle
        };
        return errorMsg;
    },
}