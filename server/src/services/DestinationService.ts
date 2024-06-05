import { Destinations } from "../model/Destinations";
import { Repository } from "../repository/Repository";
import { GenericService } from "./GenericService";

export class DestinationService<T> extends GenericService<T>{
    protected dbContext: any;
    protected destinations: any;

    constructor(context: any) {
        let destinations = new Destinations();
        let destiantion = destinations.Destinations(context);
        super(new Repository(destiantion));
        this.destinations = destiantion;
        this.dbContext = context;
    }
    async getAllDestinations()
    {
        let result: any = await this.dbContext.query('Select * from destinations');
        return result[0];
    }
}