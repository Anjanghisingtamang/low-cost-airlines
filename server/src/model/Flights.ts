const Sequelize = require('sequelize');
const moment = require('moment');
export class Flights{
    Flights(context:any)
    {
        let flights = this.FlightModel(context);
        return flights;
    }

    private FlightModel(context:any){
        return context.define('Flight',
        {
            flightid:{
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            guid:{
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            departuredatetime:{
                type: 'TIMESTAMP'
            },
        
            arrivaldatetime:{
                type: 'TIMESTAMP'
            },
            totalseats:{
                type: Sequelize.INTEGER
            },
            availableseats:{
                type: Sequelize.INTEGER
            },
            aircraftid:{
                type: Sequelize.INTEGER
            },
            departureairportid:{
                type: Sequelize.INTEGER
            },
            arrivalairportid:{
                type: Sequelize.INTEGER
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
            tableName:'flight',
            timestamps: false
        });
    }
}