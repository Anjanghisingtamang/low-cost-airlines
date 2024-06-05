const moment = require("moment");
const Sequelize = require('sequelize');
import { UserTypes } from "./UserTypes";


export class Users {
    Users(context: any) {
        let users = this.UserModel(context);
        // let userTypes = new UserTypes();

        // // Define the association between Users and UserTypes
        // users.belongsTo(userTypes, {
        //     foreignKey: 'usertypeid',
        //     targetKey: 'usertypeid'
        // });
        return users;
    }

    private UserModel(context: any) {
        return context.define('Users', {
            userid: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            guid: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            firstname: {
                type: Sequelize.STRING
            },
            middlename: {
                type: Sequelize.STRING
            },
            lastname: {
                type: Sequelize.STRING
            },
            username: {
                type: Sequelize.STRING
            },
            dateofbirth:{
                type: 'TIMESTAMP'
            },
            password: {
                type: Sequelize.STRING
            },
            salt: {
                type: Sequelize.STRING
            },
            emailaddress: {
                type: Sequelize.STRING
            },
            phonenumber: {
                type: Sequelize.STRING
            },
            mobilenumber: {
                type: Sequelize.STRING
            },
            passport_number:{
                type: Sequelize.STRING
            },
            passport_expiry:{
                type: 'TIMESTAMP'
            },
            country:{
                type: Sequelize.STRING
            },
            retrycount: {
                type: Sequelize.INTEGER
            },
            loginsuspendedtime: {
                type: 'TIMESTAMP'
            },
            usertypeid: {
                type: Sequelize.INTEGER
            },
            datecreated: {
                type: 'TIMESTAMP',
                defaultValue: moment().format()
            },
            datemodified: {
                type: 'TIMESTAMP'
            },
            datedeleted: {
                type: 'TIMESTAMP'
            }
        },
            {
                tableName: 'users',
                timestamps: false
            });
    }
}