const Sequelize = require('sequelize');
const moment = require('moment');
export class Aircrafts{
    Aircrafts(context:any)
    {
        let aircraft = this.AircraftModel(context);
        return aircraft;
    }

    private AircraftModel(context:any){
        return context.define('Aircraft',
        {
            aircraftid:{
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            guid:{
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            aircraftname:{
                type: Sequelize.STRING
            },
        
            totalseats:{
                type: Sequelize.INT
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
            tableName:'aircraft',
            timestamps: false
        });
    }
}