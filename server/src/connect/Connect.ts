const Sequelize = require('sequelize');
import * as server from "../AppConfig";

var Op = Sequelize.Op;

const sequelize = new Sequelize(server.DataBaseName, server.UserName, server.Password, {
    host: server.Host,
    port: server.Port,
    dialect: 'postgres',
    omitNull: false,
    // ssl : true,
    // dialectOptions: {
    //    ssl: true
    // },
    // logging : debug, //server.ServerConfig.LogLevel,
    pool: {
        max: 25,
        min: 0,
        idle: 3000,
        acquire: 100000
    },
    operatorsAliases: {
        $and: Op.and,
        $or: Op.or,
        $eq: Op.eq,
        $gt: Op.gt,
        $lt: Op.lt,
        $lte: Op.lte,
        $like: Op.like,
        $between: Op.between,
        $iLike: Op.iLike,
        $ne: Op.ne,
        $in: Op.in
    }
});

export function Connect() {
    var context = sequelize;
    return context;
}

