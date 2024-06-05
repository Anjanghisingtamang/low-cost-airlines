
export class AuthenticationMapper {

    protected context: any;

    constructor(context: any) {
        this.context = context;
    }

    public async Map(users: any, authKey: string, userType: any) {
        let dto = {
            UsertypeId: userType.guid ? userType.guid : null,
            UsertypeName: userType.usertypename ? userType.usertypename : null,
            DateCreated: userType.datecreated ? userType.datecreated : null,
            DateModified: userType.datemodified ? userType.datemodified : null
        }
        let obj = {
            AuthenticationKey: authKey,
            UserId: users[0].guid,
            UserName: users[0].username,
            UserType: dto,
        }

        return obj;
    }
}