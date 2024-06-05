
export class FlightMapper{
    async ModeltoDTO(models:any): Promise<any>
    {
        let dtos: any = models.map(m=>{
            let dto:any = {
                FlightId: m.guid,
                DepatureDateTime:m.departuredatetime,
                ArrivalDateTime:m.arrivaldatetime,
                TotalSeat:m.totalseats,
                AvailableSeats:m.availableseats,
                AircraftDetails:m.aircraft_details,
                DepatureDetails:m.departure_details,
                ArivalDetails:m.arrival_details,
                DateCreated: m.datecreated ? m.datecreated:null,
                DateModified: m.datemodified ? m.datemodified: null
            };
            return dto;
        });
        return dtos;
    }
}