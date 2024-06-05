import * as moment from "moment";
const Sequelize = require("sequelize");

export class UserLoginInfos{
    UserLoginInfos(context:any)
    {
        return context.define('UserLoginInfo',
        {
            userlogininfoid:{
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            guid: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            userid:{
                type: Sequelize.INTEGER
            },
            loggedindatetime: {
                type: 'TIMESTAMP',
                defaultValue: moment().format()
            },
            loggedoutdatetime:{
                type: 'TIMESTAMP'
            },
            datecreated:{
                type: 'TIMESTAMP',
                defaultValue: moment().format()
            },
            datemodified:{
                type: 'TIMESTAMP'
            },
            datedeleted:{
                type: 'TIMESTAMP'
            }
        },
        {
            tableName:'userlogininfo',
            timestamps: false
        });
    }
}