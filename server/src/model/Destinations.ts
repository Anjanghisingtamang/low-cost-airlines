const moment = require("moment");
const Sequelize = require('sequelize');


export class Destinations {
    Destinations(context: any) {
        let destiantions = this.DestinationModle(context);

        return destiantions;
    }

    private DestinationModle(context: any) {
        return context.define('Destinations', {
            destinationid: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            guid: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            destinationname: {
                type: Sequelize.STRING
            },
            airportcode: {
                type: Sequelize.STRING
            },
            city: {
                type: Sequelize.STRING
            },
            country: {
                type: Sequelize.STRING
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
                tableName: 'destinations',
                timestamps: false
            });
    }
}