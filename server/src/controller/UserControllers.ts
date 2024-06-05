import { Connect } from "../connect/Connect";
import { UserMapper } from "../mapper/UserMapper";
import { UserService } from "../services/UserService";
import { AuthenticationHeader, LoginSourceHeader, SecurityKeyHeader } from "../AppConfig";
import { UserTypeService } from "../services/UserTypeService";

const common = require("../common/CommonHelper");

export class UserControllers {

    async GetUsers(req, res) {
        const context = await Connect();
        let search = req.query.search?req.query.search:'';
        let orderBy = req.query.orderBy ? req.query.orderBy : "firstname";
        let orderDir = req.query.orderDir ? req.query.orderDir : "ASC";
        let page: number = req.query.page ? parseInt(req.query.page) : 1;
        let pageSize: number = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
        let modified = req.query.modified;
        let offset: number = pageSize * (page - 1);

        try {
            let userService = new UserService(context);
            let results: any = await userService.Load(search, orderBy, orderDir, offset, pageSize, modified);

            let mapper = new UserMapper();
            let dtos: any = await mapper.ModeltoDTO(results);

            return res.status(200).send(dtos);
        }
        catch (error) {
            console.log(`url : ${req.url}, error : ${error.message} :: stacktrace : ${error.stack}`, "Error GetSettings", req.UserId)
            let errorMessage = await common.GetErrorMessage(500, 'Internal server error');
            return res.status(500).send({ message: errorMessage });
        }

    }

    async GetUser(req, res) {
        const context = await Connect();
        var userId = req.params.userId;

        try {
            let userService = new UserService(context);

            if (!common.isGuid(userId)) {
                console.log("Invalid, UserId : " + userId, "GetUser" + req.UserId);
                var errorMessage = await common.GetErrorMessage(400, 'User Invalid');
                return res.status(400).send({ message: errorMessage });
            }

            var result: any = await userService.LoadUser(userId)

            if (!result) {
                var errorMessage = await common.GetErrorMessage(404, 'User Not found');
                return res.status(404).send({ message: errorMessage });
            }

            let mapper = new UserMapper();
            var dto = await mapper.ModeltoDTOSingle(result, context);

            return res.status(200).send(dto);

        }
        catch (error) {
            console.log("url : " + req.url + ", error : " + error.message + " :: stacktrace : " + error.stack, "Error GetUser")
            var errorMessage = await common.GetErrorMessage(500, 'Internal server error');
            return res.status(500).send({ message: errorMessage });
        }

    }

    async UpsertUser(req, res) {
        const context = await Connect();
        let user = req.body;
        let authKey = req.get(SecurityKeyHeader);
        let errorMessage: string;
        var isAdmin = req.originalUrl.indexOf('admin') > -1 ? 'true' : 'false';
        let operation = null;
        req.method;

        try {

            // if (!common.isGuid(authKey)) {
            //     console.log(`Invalid authkey passed ${authKey}`, "Unauthorized", 0);
            //     errorMessage = await common.GetErrorMessage(401, 'Invalid authkey passed');
            //     return res.status(401).send({ message: errorMessage });
            // }
           
            if(req.method=='POST'){
                operation = 'insert'
            }else{
                operation = 'update'
            }
            let usertypeService = new UserTypeService(context);
            let userService = new UserService(context);
            let mapper = new UserMapper();
            let addedUsertype = null;
            let allUsertypes = await usertypeService.getUserTypes()
           
            if (isAdmin === 'true') {
                addedUsertype = allUsertypes.find(userType => userType.usertypename.toLowerCase() === 'admin');
            }else{
                addedUsertype = allUsertypes.find(userType => userType.usertypename.toLowerCase() === 'customer');
            }

            if (user.UserName) {
                let whereClause = {
                    username: user.UserName,
                    datedeleted: null
                }

                if (operation == 'insert' && await userService.exists(whereClause)) {
                    console.info(`User already exists with same identifier : ${user.UserName}`, "AddUser");
                    errorMessage = await common.GetErrorMessage(409, 'User already exists with same identifier. Identifier');
                    return res.status(409).send({ message: errorMessage });
                }
            }

            let model = await mapper.DTOtoModel(user, addedUsertype, context);
            let result = await userService.UpsertUser(model, operation);

            if (!result) {
                errorMessage = await common.GetErrorMessage(403, 'error on adding user');
                return res.status(403).send({ message: errorMessage });
            }


        return res.status(200).send({ id: result[0].upsert_user })
        } catch (error) {
            console.log(`url : ${req.url}, error : ${error.message} :: stacktrace : ${error.stack}`, "Error AddUser");
            errorMessage = await common.GetErrorMessage(500, 'backend error cannot upsertuser user');
            return res.status(500).send({ message: errorMessage });
        }
    }

    // async UpdateUser(req, res) {
    //     const context = await Connect();
    //     var userId = req.params.userId;
    //     let userDetails = req.body;
    //     let errorMessage: string;

    //     let userService = new UserService(context);
    //     let mapper = new UserMapper();
    //     let roleService = new RoleService(context);
    //     let userRoleService = new UserRoleService(context)

    //     try {

    //         let user:any = await userService.loadByGuid(userId);

    //         if (!user) {
    //             errorMessage = await common.GetErrorMessage(404, 'error on not found');
    //             return res.status(404).send({ message: errorMessage });
    //         }
    //         let model = await mapper.DTOtoModels(userDetails, context);


    //         var whereClause: any = {
    //             guid : userId,
    //             datedeleted : null, 
    //         };
            
    //         await userService.update(model, whereClause, null)
    
    //         if(userDetails?.RoleId!=''){
    //             var role: any = roleService.loadByGuid(userDetails?.RoleId)

    //             var m :any={
    //                 roleid:role.roleid
    //             }
        
    //             var whereClauseTwo: any = {
    //                 userid : user.userid,
    //                 datedeleted : null, 
    //             };
               
    //             await userRoleService.update(m, whereClauseTwo, null)    
    //         }
           
    //         return res.status(200).send("updated successfully")
    //     } catch (error) {
    //         console.log(`url : ${req.url}, error : ${error.message} :: stacktrace : ${error.stack}`, "Error UpdateUser");
    //         errorMessage = await common.GetErrorMessage(500, 'backend error cannot add user');
    //         return res.status(500).send({ message: errorMessage });
    //     }
        

    // }



    // async DeleteUser(req, res) {
    //     const context = await Connect();
    //     var userId = req.params.userId;

    //     try {
    //         let userService = new UserService(context);
    //         let userRoleService = new UserRoleService(context);

    //         if (!common.isGuid(userId)) {
    //             console.log("Invalid, UserId : " + userId, "Delete User" + req.UserId);
    //             var errorMessage = await common.GetErrorMessage(400, 'User Invalid');
    //             return res.status(400).send({ message: errorMessage });
    //         }

    //         var result: any = await userService.loadByGuid(userId)

    //         if (!result) {
    //             var errorMessage = await common.GetErrorMessage(404, 'User Not found');
    //             return res.status(404).send({ message: errorMessage });
    //         }

    //         await userRoleService.Delete({ userid: result.userid })
    //         await userService.Delete({ userid: result.userid })

    //         return res.status(200).send('');

    //     }
    //     catch (error) {
    //         console.log("url : " + req.url + ", error : " + error.message + " :: stacktrace : " + error.stack, "Error GetUser")
    //         var errorMessage = await common.GetErrorMessage(500, 'Internal server error');
    //         return res.status(500).send({ message: errorMessage });
    //     }

    // }
}