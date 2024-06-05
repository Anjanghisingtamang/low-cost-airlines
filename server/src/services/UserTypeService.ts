import { UserTypes } from "../model/UserTypes";
import { Repository } from "../repository/Repository";
import { GenericService } from "./GenericService";

export class UserTypeService<T> extends GenericService<T>{
    protected dbContext: any;
    protected userType: any;

    constructor(context: any) {
        let userTypes = new UserTypes();
        let userType = userTypes.UserType(context);
        super(new Repository(userType));
        this.userType = userType;
        this.dbContext = context;
    }
    async getUserTypes()
    {
        let result: any = await this.dbContext.query('Select * from usertype');
        return result[0];
    }
}