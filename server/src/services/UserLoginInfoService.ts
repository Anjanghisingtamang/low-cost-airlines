import { QueryTypes, where } from "sequelize";
import { UserLoginInfos } from "../model/UserLoginInfos";
import { Repository } from "../repository/Repository";
import { GenericService } from "./GenericService";
import {AuthenticationKeyTimeOutInSeconds} from "../AppConfig";
import * as moment from "moment";

export class UserLoginInfoService<T> extends GenericService<T>{
    protected dbContext:any;
    protected userLoginInfo:any;

    constructor(context:any)
    {
        let userLoginInfos = new UserLoginInfos();
        let userLoginInfo = userLoginInfos.UserLoginInfos(context);
        super(new Repository(userLoginInfo));
        this.dbContext = context;
        this.userLoginInfo = userLoginInfo;
    }

    async insert(userId: number, loginSource: string, idToken)
    {
        let insertClause = {
            userid : userId,
            loginSource : loginSource,
            idtoken : idToken
        }

        return await this.add(insertClause, null).then(function(result){
            if(result)
            {
                return result;
            }
        });
    }

    async checkAuthKeyValidity(authKey: string): Promise<T[]>
    {
        let authKeyExpirySeconds = AuthenticationKeyTimeOutInSeconds ? AuthenticationKeyTimeOutInSeconds : 3600;
        let dateTime = moment().subtract(authKeyExpirySeconds, 'seconds').format();

        let whereClause: any ={
            guid: authKey,
            loggedoutdatetime: null,
            datedeleted: null
        }

        let userLoginInfo: any = await this.load(whereClause);
        if(userLoginInfo && userLoginInfo.length !=0)
        {
            let loggedindatetime = moment(userLoginInfo[0].loggedindatetime).format();

            if(loggedindatetime > dateTime)
            {
                //await this.update({loggedindatetime: moment().format()}, {guid: authKey}, null, null);
                return userLoginInfo;
            }

            userLoginInfo.error = "session-timeout";
            return userLoginInfo;
        }
        return null;
    }

    // async checkAccessLabels(userId: number, operation:string, uri: string)
    // {
    //     let result: any = await this.dbContext.query('Select * from public.checkaccessrights(:actualuserid, :operation, :uri)',{
    //         replacements: { actualuserid: userId, operation: operation, uri: uri }, type: QueryTypes.SELECT
    //     });
    //     return result;
    // }

    async logout(guid: string){
        let dateTime = moment().format();
        let updateClause = { loggedoutdatetime : dateTime, datemodified: dateTime };
        let whereClause = {
            guid: guid,
            loggedoutdatetime: null,
            datedeleted: null
        }
        return await this.Update(updateClause, whereClause, null).then(function(result){
            if(result)
            {
                return result;
            }
        });
    }
}