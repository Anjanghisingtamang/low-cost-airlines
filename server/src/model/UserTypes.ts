const Sequelize = require('sequelize');
const moment = require('moment');
export class UserTypes{
    UserType(context:any)
    {
        let userType = this.UserTypeModel(context);
        return userType;
    }

    private UserTypeModel(context:any){
        return context.define('UserType',
        {
            usertypeid:{
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            guid:{
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            usertypename:{
                type: Sequelize.STRING
            },
            datecreated:{
                type:'TIMESTAMP',
                defaultValue: moment().format()
            }, 
            datemodified:{
                type:'TIMESTAMP'
            },
            datedeleted:{
                type:'TIMESTAMP'
            }
        },
        {
            tableName:'usertype',
            timestamps: false
        });
    }
}