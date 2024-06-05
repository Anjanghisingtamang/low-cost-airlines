import { ServerPort } from "./AppConfig";
import { AuthenticationsController } from "./controller/AuthenticateController";
import { UserControllers } from "./controller/UserControllers";
import { UserTypeController } from "./controller/UserTypeController";
import { DestinationController } from "./controller/DestinationController";
import { FlightController } from "./controller/FlightController";
import { SeatController } from "./controller/SeatController";

let express = require('express');
let app = express();
let http = require('http');
let bodyParser = require('body-parser');
let router = express.Router();
let cors = require("cors");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(cors({
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-LoginSource', 'X-Security-AuthKey', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Link', 'x-page-index', 'x-page-totalcount', 'x-page-pagesize', 'EntityLink', 'UserLink', 'GroupLink', 'ProjectLink']
}));

app.use('/', router);

let httpServer = http.createServer(app).listen(ServerPort, function () {
    console.log(`Server is Running at Port ${ServerPort}`);
});


function authorize(req, res, next) { new AuthenticationsController().Authorize(req, res, next); }

router.get('/bookseat', (req, res) => { new DestinationController().GetDestinations(req, res) });

router.get('/Destinations', (req, res) => { new DestinationController().GetDestinations(req, res) });
router.get('/Flights', (req, res) => { new FlightController().GetAvailableFlight(req, res) });


router.post('/admin/Login', (req, res) => { new AuthenticationsController().Login(req, res) });
router.post('/Login', (req, res) => { new AuthenticationsController().Login(req, res) });
router.put('/Logout', authorize, (req, res) => { new AuthenticationsController().Logout(req, res) });


router.get('/Seats', (req, res) => { new SeatController().GetAvailableFlightSeat(req, res) });

router.get('/Users', (req, res) => { new UserControllers().GetUsers(req, res) });
router.get("/Users/:userId", (req, res) => { new UserControllers().GetUser(req, res) });
router.post('/Users', (req, res) => { new UserControllers().UpsertUser(req, res) });
router.put('/Users', (req, res) => { new UserControllers().UpsertUser(req, res) });
router.post('/admin/Users', (req, res) => { new UserControllers().UpsertUser(req, res) });
router.put('/admin/Users', (req, res) => { new UserControllers().UpsertUser(req, res) });

router.get('/UserTypes', (req, res) => { new UserTypeController().GetUserTypes(req, res) });




