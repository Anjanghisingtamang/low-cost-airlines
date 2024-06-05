import { Connect } from "../connect/Connect";
import { FlightMapper } from "../mapper/FllightMapper";
import { FlightService } from "../services/FlightService";

const common = require("../common/CommonHelper");

export class FlightController{
    async GetAvailableFlight(req, res)
    {
        let userId = req.UserId;
        const context = await Connect();
        let searchDate = req.query.searchDate?req.query.searchDate:'';
        let departureAirportcode = req.query.departureAirportcode ? req.query.departureAirportcode : "";
        let arrivalAirportcode = req.query.arrivalAirportcode ? req.query.arrivalAirportcode : "";
        let numPassenger: number = req.query.numPassenger?req.query.numPassenger: "";
        let seatClass = req.query.seatClass?req.query.seatClass:"";
        try{
            let flightService = new FlightService(context);
            let flightMapper = new FlightMapper();
            let results = await flightService.getAvailableFlights(searchDate, departureAirportcode, arrivalAirportcode, numPassenger, seatClass); 
            let model = await flightMapper.ModeltoDTO(results);
            res.status(200).send(model);
        }
        catch(error)
        {
            console.log(`url : ${req.url}, error : ${error.message} :: stacktrace : ${error.stack}`, "Error GetAvailableFlight", userId)
            let errorMessage = await common.GetErrorMessage(500, 'Internal Server Error');
            return res.status(500).send({ message: errorMessage });
        }
    }

}