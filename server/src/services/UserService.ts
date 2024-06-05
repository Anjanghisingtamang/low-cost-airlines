import { QueryTypes } from "sequelize";
import { RetryCount, SuspendedTime } from "../AppConfig";
import { Users } from "../model/Users";
import { Repository } from "../repository/Repository";
import { GenericService } from "./GenericService";
import * as moment from "moment";
var Sequelize = require('sequelize');

export class UserService<T> extends GenericService<T> {
    protected dbContext: any;
    protected user: any;

    constructor(context: any) {
        let users = new Users();
        let user = users.Users(context);
        super(new Repository(user));
        this.user = user;
        this.dbContext = context;
    }

    async Load(search: string, orderBy: string, orderDir: string, offset: number, pageSize: number, modified: string) {

        var result = await this.dbContext.query('SELECT * FROM public.get_all_users(:searchtext, :pagesize, :pageoffset, :orderby, :orderdir)', {
            replacements: { searchtext: search, pagesize: pageSize, pageoffset: offset, orderby: orderBy, orderdir: orderDir }, type: Sequelize.QueryTypes.SELECT
        });
        return result;

    }

    async LoadUser(userId: string) {
        var result = await this.dbContext.query('SELECT * FROM public.get_user(:userid)', {
            replacements: { userid: userId }, type: Sequelize.QueryTypes.SELECT
        });
        return result[0];

    }


    async getUserDetail(userName: string) {
        let whereClause = {
            where: {
                username: { $iLike: userName },
                datedeleted: null
            },
        };
        return await this.loadInclude(whereClause);
    }

    async update(updateClause: any, whereClause: any, userId: number) {
        let result: any = {};

        result = await this.repository.update(updateClause, whereClause, userId);
        return result[0];
    }

    async UpsertUser(model: any, operation :string ) {
        var result = await this.dbContext.query('SELECT * FROM public.upsert_user(:modelJSON, :opt)', {
            replacements: { modelJSON:  JSON.stringify(model), opt: operation}, type: Sequelize.QueryTypes.SELECT
        });
        return result;
    }


    async CheckSuspended(userId: number) {
        let result = await this.dbContext.query("select * From public.is_user_suspended(:userid)", {
            replacements: { userid: userId }, type: QueryTypes.SELECT
        });

        return result[0];
    }

    // // async UpsertUsersCheck(userId:number, password:string)
    // // {
    // //     let result = await this.dbContext.query('SELECT * FROM public.user_checkadmin(:userid, :password);',{
    // //         replacements:{ userid: userId, password:password}, type:QueryTypes.SELECT
    // //     });
    // //     return result[0].user_checkadmin;
    // // }

    async UpdateFailedLogin(user: any) {
        let udpateClause: any = { retrycount: (user.retrycount + 1) };

        if ((user.retrycount + 1) >= 5) {
            udpateClause.loginsuspendedtime = moment().format();
        }

        await this.update(udpateClause, { userid: user.userid, datedeleted: null }, user.userid);
    }

    // // async RetryCountReset(guid:stsring, userId:number)
    // // {
    // //     let result = await this.dbContext.query('SELECT * FROM public.users_reset_loginretrycount(:guid, :currentuserid)',{
    // //         replacements: { guid: guid, currentuserid: userId}, types: QueryTypes.SELECT
    // //     });

    // //     return result[0][0].users_reset_loginretrycount;
    // // }
}