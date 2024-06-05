import { Connect } from "../connect/Connect";
import { UserService } from "../services/UserService";
import * as moment from "moment";
import { UserLoginInfoService } from "../services/UserLoginInfoService";
import { AuthenticationMapper } from "../mapper/AuthenticationMapper";
import { AuthenticationHeader, LoginSourceHeader, SecurityKeyHeader } from "../AppConfig";
import { UserTypeService } from "../services/UserTypeService";

const common = require("../common/CommonHelper");
export class AuthenticationsController {
    async Login(req, res) {
        //{"UserName":"labina","Password":"Labina1234","UserType":"716f09dc-dc66-43ea-aa5c-86c90266d411"}
        let userName = req.body.UserName;
        let password = req.body.Password;
        let loginSource: string = req.get(LoginSourceHeader) ? req.get(LoginSourceHeader) : '';
        const context = await Connect();
        var isAdmin = req.originalUrl.indexOf('admin') > -1 ? 'true' : 'false';
        let errorMessage: string;
        console.log(`Login info username : ${userName}`, "Login Check", 0);

        if (userName == '') {
            console.log('Username should not be empty');
            errorMessage = await common.GetErrorMessage(400, `Username should not be empty!!`);
            return res.status(400).send({ message: errorMessage });
        }
        if (password == '') {
            console.log('Password should not be empty');
            errorMessage = await common.GetErrorMessage(400, `Password should not be empty!!`);
            return res.status(400).send({ message: errorMessage });
        }

        try {
            let userTypeService = new UserTypeService(context);
            let allUsertypes = await userTypeService.getUserTypes();
            let addedUsertype = null;
            if (isAdmin === 'true') {
                addedUsertype = allUsertypes.find(userType => userType.usertypename.toLowerCase() === 'admin');
            }else{
                addedUsertype = allUsertypes.find(userType => userType.usertypename.toLowerCase() === 'customer');
            }

            let userService = new UserService(context);
            let users = await userService.getUserDetail(userName);

            // if (addedUsertype.usertypeid != users[0].usertypeid) {
            //     console.log('UserType doesnot matched');
            //     errorMessage = await common.GetErrorMessage(400, `Please Use correct User Type!!`);
            //     return res.status(400).send({ message: errorMessage });
            // }

            if (users && users.length > 1) {
                let retryData: any = await userService.CheckSuspended(users[0].userid);

                if (retryData.is_user_suspended == true) {
                    console.log(`Username: ${userName}`, "Login attempts exceeded", 0);
                    errorMessage = await common.GetErrorMessage(429, 'Login attempts exceeded; Try again later');
                    return res.status(429).send({ message: errorMessage });
                }

                if ((users[0].password == common.HashPassword(users[0].salt, password)) && retryData.is_user_suspended == false) {
                    await userService.update({ retrycount: 0, datemodified: moment().format() }, { userid: users[0].userid, datedeleted: null }, users[0].userid);
                    res.header(AuthenticationHeader, password);

                    let obj: any = await this.UserLogin(context, users, addedUsertype);
                    console.log(`Username: ${obj.UserName} with AuthKey : ${obj.AuthenticationKey}`, "Login Successful", users[0].userid);

                    return res.status(200).send(obj);
                }

                if (retryData.is_user_suspended == false) {
                    await userService.UpdateFailedLogin(users[0]);
                }
            }

            console.log(`Username : ${userName}`, "Unauthorized", 0);
            errorMessage = await common.GetErrorMessage(401, `Username or Password incorrect`);
            return res.status(401).send({ message: errorMessage });
        } catch (error) {
            console.log(`Username : ${userName}, Error : ${error.message}`, "Unauthorized", 0);
            errorMessage = await common.GetErrorMessage(500, 'Internal server error');
            return res.status(500).send({ message: errorMessage });
        }
    }

    async UserLogin(context: any, users: any, userType: any) {
        let userLoginInfoService = new UserLoginInfoService(context);
        let authenticationMapper = new AuthenticationMapper(context);

        let userLoginInfo: any = await userLoginInfoService.insert(users[0].userid, "", "");


        let obj: any = await authenticationMapper.Map(users, userLoginInfo.guid, userType);
        return obj;
    }

    async Authorize(req, res, next) {
        const context = await Connect();
        let authKey = req.get(SecurityKeyHeader);
        let errorMessage: string;
        try {
            if (common.isGuid(authKey)) {
                console.log(`AuthKey : ${authKey}`, "Checking authkey", 0);

                let userLoginInfoService = new UserLoginInfoService(context);
                let userService = new UserService(context);

                let loggedInUser: any = await userLoginInfoService.checkAuthKeyValidity(authKey);
                if (!loggedInUser || loggedInUser.length == 0) {
                    console.log(`AuthKey : ${authKey}`, "Unauthorized", 0);
                    errorMessage = await common.GetErrorMessage(401, 'Unauthorized User');
                    return res.status(401).send({ message: errorMessage });
                }

                if (loggedInUser.error) {
                    console.log(`AuthKey Session Timeout : ${authKey}`, "Unauthorized", 0);
                    errorMessage = await common.GetErrorMessage(440, 'Session Timeout');
                    return res.status(440).send({ message: errorMessage });
                }

                let user: any = await userService.loadById(loggedInUser[0].userid, "userid");

                if (!user) {
                    console.log(`User not exists with authKey: ${authKey}`, "Unauthorized", 0);
                    errorMessage = await common.GetErrorMessage(401, 'User doesnot exist');
                    return res.status(401).send({ message: errorMessage });
                }

                let userDetail: any = await userService.getUserDetail(user.username);

                if (userDetail) {
                    req.UserId = loggedInUser[0].userid;
                    req.UserGuid = user.guid;
                    req.AuthKey = authKey;

                    console.log(`method: ${req.method}, url : ${req.url}`, "Authorization Successful", loggedInUser[0].userid);
                    return next();
                }
                console.log(`Unauthorized to perform operation ${authKey}`, "Unauthorized", 0);
            }
            else {
                console.log(`Invalid authkey passed ${authKey}`, "Unauthorized", 0);
            }
            errorMessage = await common.GetErrorMessage(401, 'Unauthorized User');
            return res.status(401).send({ message: errorMessage });
        } catch (error) {
            console.log(`url : ${req.url}, error : ${error.message} :: stacktrace : ${error.stack}`, "Error in Authorize", 0);
            errorMessage = await common.GetErrorMessage(500, 'Internal server error');
            return res.status(500).send({ message: errorMessage });
        }
    }

    // async CheckAccessLabels(req, res, next)
    // {

    //     const context = await Connect();
    //     let localeCode = req.query.localeCode ? req.query.localeCode : 1043;
    //     let errorMessage:string;
    //     try
    //     {
    //         let userLoginInfoService = new UserLoginInfoService(context);
    //         let uriArray = req.originalUrl.split('/');
    //         let uriArrayFiltered = [];

    //         for(let i = 0; i< uriArray.length; i++)
    //         {
    //             if(uriArray[i] == 'SystemTranslations')
    //             {
    //                 uriArrayFiltered.push(uriArray[i]);
    //                 break;
    //             }

    //             let isValid : boolean = false;

    //             if(uriArray[i].indexOf('?')>-1)
    //             {
    //                 uriArray[i] = uriArray[i].split('?')[0];
    //             }

    //             if(uriArray[i].indexOf(',')>-1)
    //             {
    //                 uriArray[i] = uriArray[i].split(',')[0];
    //             }

    //             if(!common.isGuid(uriArray[i]))
    //             {
    //                 isValid = true;
    //             }

    //             if(isValid)
    //             {
    //                 uriArrayFiltered.push(uriArray[i]);
    //             }
    //         }

    //         let uri = uriArrayFiltered.join('/');
    //         let isAuthorized = await userLoginInfoService.checkAccessLabels(req.UserId, req.method, uri);
    //         let isAllowed: number = isAuthorized[0].checkaccessrights;

    //         if(isAllowed == 1)
    //         {
    //             return next();
    //         }
    //         else if(isAllowed == 0)
    //         {
    //             log.info(`Unauthorized to perform operation ${req.AuthKey}`, "Unauthorized", req.UserId);
    //             errorMessage = await common.GetErrorMessage(405, localeCode, context);
    //             return res.status(405).send({ message: errorMessage });
    //         }
    //         else if (isAllowed == 2)
    //         {
    //             log.info(`Invalid request. URL: ${req.url}, authkey : ${req.AuthKey}`, "Unauthorized", req.UserId);
    //         }

    //         errorMessage = await common.GetErrorMessage(400, localeCode, context);
    //         return res.status(400).send({ message: errorMessage });
    //     }catch(error)
    //     {
    //         log.error(`url : ${req.url}, error : ${error.message} :: stacktrace : ${error.stack}`,"Error in Authorize",0);
    //         errorMessage = await common.GetErrorMessage(500, localeCode, context);
    //         return res.status(500).send({ message: errorMessage});
    //     }
    // }

    async Logout(req, res) {
        const context = await Connect();
        try {
            let userLoginInfoService = new UserLoginInfoService(context);

            let authKey = req.get(SecurityKeyHeader);
            await userLoginInfoService.logout(authKey);

            console.log(`AuthKey: ${authKey}`, "Logout SeccessFull", req.UserId);
            let result = {
                "message": {
                    "status": 200,
                    "details": "Logout Successful"
                }
            }
            return res.status(200).send(result);
        }
        catch (error) {
            console.log(`url : ${req.url}, error : ${error.message} :: stacktrace : ${error.stack}`, "Error while Authorize", req.UserId)
            let errorMessage = await common.GetErrorMessage(500, 'Internal server error');
            return res.status(500).send({ message: errorMessage });
        }
    }
}