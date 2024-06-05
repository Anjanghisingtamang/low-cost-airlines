export class SeatMapper{
    async ModeltoDTO(models:any): Promise<any>
    {
        let dtos: any = models.map(m=>{
            let dto:any = {
                SeatId: m.guid,
                SeatNumber:m.seat_number,
                FireExit: m.fireexit,
                Class: m.seat_class,
                DateCreated: m.datecreated ? m.datecreated:null,
                DateModified: m.datemodified ? m.datemodified: null
            };
            return dto;
        });
        return dtos;
    }
}