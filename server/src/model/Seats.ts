const moment = require("moment");
const Sequelize = require('sequelize');


export class Seats {
    Seats(context: any) {
        let seats = this.SeatModle(context);

        return seats;
    }

    private SeatModle(context: any) {
        return context.define('Seats', {
            seatid: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            guid: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            seatnumber: {
                type: Sequelize.STRING
            },
            seatclass: {
                type: Sequelize.STRING
            },
            fireexit: {
                type: Sequelize.BOOLEAN
            },
            aircraftid: {
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
                tableName: 'seat',
                timestamps: false
            });
    }
}