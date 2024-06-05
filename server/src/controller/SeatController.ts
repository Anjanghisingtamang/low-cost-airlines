import { Connect } from "../connect/Connect";
import { SeatMapper } from "../mapper/SeatMapper";
import { SeatService } from "../services/SeatService";

const common = require("../common/CommonHelper");

export class SeatController{
    async GetAvailableFlightSeat(req, res)
    {
        let flightId = req.query.flightId?req.query.flightId:'';
        const context = await Connect();
        try{
            let seatService = new SeatService(context);
            let seatMapper = new SeatMapper()
            let results = await seatService.getAvailableSeats(flightId); 
            let model = await seatMapper.ModeltoDTO(results);

            res.status(200).send(model);
        }
        catch(error)
        {
            console.log(`url : ${req.url}, error : ${error.message} :: stacktrace : ${error.stack}`, "Error GetAvailableFlightSeat")
            let errorMessage = await common.GetErrorMessage(500, 'Internal Server Error');
            return res.status(500).send({ message: errorMessage });
        }
    }

}