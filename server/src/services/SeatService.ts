import { Seats } from "../model/Seats";
import { Repository } from "../repository/Repository";
import { GenericService } from "./GenericService";
var Sequelize = require('sequelize');

export class SeatService<T> extends GenericService<T>{
    protected dbContext: any;
    protected seat: any;

    constructor(context: any) {
        let seats = new Seats();
        let seat = seats.Seats(context);
        super(new Repository(seat));
        this.seat = seat;
        this.dbContext = context;
    }
    async getAvailableSeats(flightId:String)
    {
        var result = await this.dbContext.query('SELECT * FROM public.get_available_seats(:flightid)', {
            replacements: { flightid: flightId }, type: Sequelize.QueryTypes.SELECT
        });
        return result;
    }
}