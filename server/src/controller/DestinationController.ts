import { Connect } from "../connect/Connect";
import { DestinationMapper } from "../mapper/DestinationMapper";
import { DestinationService } from "../services/DestinationService";

const common = require("../common/CommonHelper");

export class DestinationController{
    async GetDestinations(req, res)
    {
        let userId = req.UserId;
        const context = await Connect();
        try{
            let destinationService = new DestinationService(context);
            let destinationMapper = new DestinationMapper();
            let results = await destinationService.getAllDestinations(); 
            let model = await destinationMapper.ModeltoDTO(results);
            res.status(200).send(model);
        }
        catch(error)
        {
            console.log(`url : ${req.url}, error : ${error.message} :: stacktrace : ${error.stack}`, "Error GetDestinations", userId)
            let errorMessage = await common.GetErrorMessage(500, 'Internal Server Error');
            return res.status(500).send({ message: errorMessage });
        }
    }

}