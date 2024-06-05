import { Flights } from "../model/Flights";
import { Repository } from "../repository/Repository";
import { GenericService } from "./GenericService";
var Sequelize = require('sequelize');

export class FlightService<T> extends GenericService<T>{
    protected dbContext: any;
    protected flight: any;

    constructor(context: any) {
        let flights = new Flights();
        let flight = flights.Flights(context);
        super(new Repository(flight));
        this.flight = flight;
        this.dbContext = context;
    }
    async getAvailableFlights(searchDate: any, departureAirportcode: string, arrivalAirportcode: string, numPassenger: number, seatClass: string)
    {
        var result = await this.dbContext.query('SELECT * FROM public.get_flight_details(:search_date, :departure_airportcode, :arrival_airportcode, :p_num_passenger, :p_seatclass)', {
            replacements: { search_date: searchDate, departure_airportcode: departureAirportcode, arrival_airportcode: arrivalAirportcode, p_num_passenger: numPassenger, p_seatclass: seatClass }, type: Sequelize.QueryTypes.SELECT
        });
        return result;
    }
}