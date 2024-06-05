import { Connect } from "../connect/Connect";
import { UserTypeMapper } from "../mapper/UserTypeMapper";
import { UserTypeService } from "../services/UserTypeService";

const common = require("../common/CommonHelper");

export class UserTypeController{
    async GetUserTypes(req, res)
    {
        let userId = req.UserId;
        const context = await Connect();
        try{
            let userTypeService = new UserTypeService(context);
            let userTypeMapper = new UserTypeMapper();
            let results = await userTypeService.getUserTypes(); 
            let model = await userTypeMapper.ModeltoDTO(results);
            res.status(200).send(model);
        }
        catch(error)
        {
            console.log(`url : ${req.url}, error : ${error.message} :: stacktrace : ${error.stack}`, "Error GetUserTypes", userId)
            let errorMessage = await common.GetErrorMessage(500, 'Internal Server Error');
            return res.status(500).send({ message: errorMessage });
        }
    }

}