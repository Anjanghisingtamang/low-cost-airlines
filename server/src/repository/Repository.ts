import { NumberDataTypeConstructor } from 'sequelize';
import { IRepository } from './contracts/IRepository';
var moment = require( "moment");

export class Repository<T> implements IRepository<T> {

    // protected context: Sequelize;
    private dbContext : any;
    
    constructor(context: any) 
    {
       this.dbContext = context;
    }

    async loadByGUID(guid: string): Promise<T> 
    {
        var result = await this.dbContext.findOne({
                        where : {
                            guid : guid,
                            datedeleted : null
                        }
                    });

        // this.dbContext.close();
        return result;
    }

    async loadWithAttribute(attribute : any, whereClause : any) : Promise<T>
    {
        var result = await this.dbContext.findAll({
            attribute : attribute,
            where : whereClause,
            order : ["datecreated"]
        });

        return result;
    }

    async loadById(id: number, fieldName: string): Promise<T> 
    {
        var result = await this.dbContext.findOne({
                        where : {
                            [fieldName] : id,
                            datedeleted : null
                        }
                    });

        return result;
    }

    async loadAll(): Promise<T[]> 
    {
        var result = await this.dbContext.findAll({
                        where : {
                            datedeleted : null
                        }
                    });

        // this.dbContext.close();
        return result;
    }

    async loadAllOffset(start: number, pageSize: number, orderBy: string, orderDir: string, whereClause: any, includeClause: any): Promise<T[]>
    {
        // for removing pagination in get request.. paginatio is required then remove pageSize = 0 line....
        // pageSize = 0;
        
        if(pageSize == 0)
        {
            var result = await this.dbContext.findAll({
                where : whereClause,
                include : includeClause,
                order : [[orderBy, orderDir]]
            })

            return result;
        }
        else
        {
            var result = await this.dbContext.findAll({
                where : whereClause,
                offset : start,
                limit : pageSize,
                include : includeClause,
                order : [[orderBy, orderDir]]
            })

            return result;
        }
       
    }

    async load(whereClause : any) : Promise<T[]> 
    {
        var result = await this.dbContext.findAll({
                        where : whereClause
                    });

        return result;
    }

    async loadInclude(queryPart : any) : Promise<T[]>
    {
        var result = await this.dbContext.findAll(queryPart);

        return result;
    }

    async loadOne(whereClause : any, orderBy : string) : Promise<T> 
    {
        var result = await this.dbContext.findAll({
                        limit: 1,
                        where : whereClause,
                        order : [[orderBy, 'DESC']]
                    })

        return result;
    }

    async insert(item: any, userId: number) : Promise<T>
    {
        if(userId)
        {
            await this.dbContext.sequelize.query('set myvar.userid = ' + userId);
        }
    
        var result : any = await this.dbContext.create(item);

        return result;
    }

    // async insertWithoutContext(item: any) : Promise<T>
    // {
    //     var result = await this.dbContext.create(item);

    //     return result;
    // }

    //bulk insert with transaction

    // async upsert(guid: string, item: any): Promise<string> 
    // {
    //    var flag = guid ? await this.exists({ guid : [guid], datedeleted : null }) : false;

    //     if(flag != true) {
    //         var result : any = await this.insert(item, null);
    //         return result;
    //     }
    //     else {
    //         var whereClause : any  = {
    //                                     guid : guid
    //                                 };
    //         await this.dbContext.update(item, { where : whereClause }) ;
    //         var results : any = await this.load(whereClause);
    //         // this.dbContext.close();
    //         return results[0];
    //     }
    // }

    async update(updateClause: any, whereClause: any, userId: number): Promise<T> 
    {
        if(userId)
        {
            await this.dbContext.sequelize.query('set myvar.userid = ' + userId);
        }


        var updatedItem : any = await this.dbContext.update( updateClause, {
                        where : whereClause,
                        returning : true
                    });        
        return updatedItem[1];
    }

    async executeQuery(queryString : string) : Promise<any> 
    {
        var result = await this.dbContext.sequelize.query(queryString);
        return result[0];
    }

    async exists(whereClause : any): Promise<boolean> 
    {
        var flag = false;

        var count = await this.dbContext.count({
            where : whereClause
        });

        if(count >= 1) {
            flag = true;
        }

        // this.dbContext.close();
        return flag;
    }

    async delete(whereClause: any): Promise<string> {

        var updateClause = {
                                datedeleted : moment().format(),
                                datemodified : moment().format()
                            };
        
        var deletedItem = await this.dbContext.update( updateClause, {
                                where : whereClause,
                                returning : true
                            });
        return deletedItem[1];
    }

    async count(whereClause: any) : Promise<number>
    {
        var count : number = await this.dbContext.count({
            where : whereClause
        });

        return count;
    }    
} 