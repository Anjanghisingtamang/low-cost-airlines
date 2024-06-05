const Sequelize = require('sequelize');
const moment = require('moment');
export class Flights{
    Bookings(context:any)
    {
        let bookingDetails = this.BookingDetialModel(context);
        return bookingDetails;
    }

    private BookingDetialModel(context:any){
        return context.define('BookingDetails',
        {
            bookingid:{
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            guid:{
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            userid:{
                type: Sequelize.INTEGER
            },
            flightid:{
                type: Sequelize.INTEGER
            },
            totalprice:{
                type: Sequelize.DECIMAL(10, 2)
            },
            totalseats:{
                type: Sequelize.INTEGER
            },
            iscancelled:{
                type: Sequelize.BOOLEAN
            },
            cancellationdate:{
                type: 'TIMESTAMP'
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
            },
            bookedby:{
                type:'TIMESTAMP'
            }
        },
        {
            tableName:'bookingdetail',
            timestamps: false
        });
    }
}