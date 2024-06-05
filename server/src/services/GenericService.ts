import { IRepository } from "../repository/contracts/IRepository";

export class GenericService<T>{
    protected repository: IRepository<T>;

    constructor(repository: IRepository<T>){
        this.repository = repository;
    }

    async loadAll()
    {
        var results = await this.repository.loadAll();
        return results;
    }

    async add(item: any, userId: number): Promise<T>
    {
        console.log(item);
        var result: any={};
        result = await this.repository.insert(item, userId);
        return result;
    }

    async exists(whereClause: any)
    {
        let result = await this.repository.exists(whereClause);
        return result;
    }

    async load(whereClause: any)
    {
        let result = await this.repository.load(whereClause);
        return result;
    }

    async loadOne(whereClause:any)
    {
        let result = await this.repository.loadOne(whereClause, 'guid');
        return result;
    }

    async Update(updateClause:any, whereClause:any,userId: number)
    {
        let result = await this.repository.update(updateClause, whereClause,userId);
        return result;
    }

    async Delete(whereClause:any)
    {
        let result = await this.repository.delete(whereClause);
        return result;
    }

    async loadByGuid(guid:string)
    {
        let result = await this.repository.loadByGUID(guid);
        return result;
    }
    async loadById(id: number, fieldName: string) 
    {
        var result = await this.repository.loadById(id, fieldName);
        return result;
    }
    async loadInclude(queryPart:any)
    {
        var results = await this.repository.loadInclude(queryPart);
        var count = await this.repository.count(queryPart.where);

        var obj = [];
            
        obj = obj.concat(results);
        // results.forEach(function (result) {
        //     obj.push(result);
        // }); 

        obj.push(count);

        return obj;
    }

    async loadAllOffset(offset: number, limit: number, orderBy: string, orderDir: string, modified: string, whereClause: any, includeClause: any): Promise<T[]>
    {
        if(modified)
        {
            whereClause.$or = [{
                             datemodified : null,
                             datecreated : {
                                             $gt : modified
                                             }
                         }, {
                             datemodified : {
                                                $ne : null,
                                                $gt : modified
                                            },
                         }, {
                             datedeleted : {
                                                $ne : null,
                                                $gt : modified
                                            }
                         }]
        }

        var results = await this.repository.loadAllOffset(offset, limit, orderBy, orderDir, whereClause, includeClause);
        var count = await this.repository.count(whereClause);

        var obj = [];
            
        obj = obj.concat(results);

        obj.push(count);

        return obj;
    }
}

