export interface IRepository<T> {

    loadByGUID(guid: string): Promise<T>;
    
    loadWithAttribute(attribute : any, whereClause : any): Promise<T>;

    loadById(id: number, fieldName: string): Promise<T>;

    loadAll(): Promise<T[]>;

    loadAllOffset(offset: number, limit: number, orderBy: string, orderDir: string, whereClause: any,  includeClause : any): Promise<T[]>;

    load(whereClause : any) : Promise<T[]>;

    loadInclude(queryPart : any) : Promise<T[]>;

    loadOne(whereClause : any, orderBy : string) : Promise<T>;

    insert(item: any, userId: number): Promise<T>;

    // upsert(guid: string, item: any): Promise<string>;

    update(updateClause: any, whereClause: any, userId: number): Promise<T>;

    exists(guid: string): Promise<boolean>;

    executeQuery(queryString: string) : Promise<any>; 

    delete(whereClause: any): Promise<string>;

    count(whereClause: any) : Promise<number>;

    // delete(item: T);

}