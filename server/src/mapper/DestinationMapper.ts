export class DestinationMapper{
    async ModeltoDTO(models:any): Promise<any>
    {
        let dtos: any = models.map(m=>{
            let dto:any = {
                DestinationId: m.guid,
                DestinationName:m.destinationname,
                AirportCode:m.airportcode,
                City: m.city,
                Country: m.country,
                DateCreated: m.datecreated ? m.datecreated:null,
                DateModified: m.datemodified ? m.datemodified: null
            };
            return dto;
        });
        return dtos;
    }
}