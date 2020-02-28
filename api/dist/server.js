"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_controller_1 = require("./controllers/login.controller");
const image_controller_1 = require("./controllers/image.controller");
const user_controller_1 = require("./controllers/user.controller");
const item_controller_1 = require("./controllers/item.controller");
const server_config_1 = require("./server.config");
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const port = process.env.NODE_ENV === 'production' ? 80 : 3000;
const app = express_1.default();
/*********** LOAD MONGOOSE **********/
mongoose_1.default.connect(server_config_1.mongDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("Error connecting to MongoDB collection StorageBox");
        console.log(err);
    }
    else {
        console.log("Connected to MongoDB at StorageBox");
    }
});
//Stop deprecation warnings from MongoDB native drivers
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.set('useFindAndModify', false);
/********** MIDDLEWARE *************/
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// Set static folder
app.use(express_1.default.static("./uploads"));
// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://10.0.0.191:4200");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
/********* END OF MIDDLEWARE *********/
/************* ROUTE HANDLERS *******************/
app.use('/', login_controller_1.router);
app.use('/item', item_controller_1.router);
app.use('/users', user_controller_1.router);
app.use('/api', image_controller_1.router);
/******** ERROR HANDLER ***********/
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid Token Bitch');
    }
    else {
        throw err;
    }
});
/**
 * LISTEN
 * PORT: 3000
 *
 * Port the server listens for requests on
 */
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running and listening on port ${port}`);
});
