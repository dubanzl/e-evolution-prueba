"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const consolidate_1 = __importDefault(require("consolidate"));
const index_route_1 = __importDefault(require("./routes/index.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const uni = __importStar(require("./app"));
class Server {
    constructor() {
        this.port = config_1.default.get('express.port');
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', this.port || 3001);
        this.app.use(express_1.default.static(config_1.default.get('public')));
        this.app.set('views', config_1.default.get('public'));
        this.app.engine('html', consolidate_1.default.swig);
        this.app.set('view engine', 'html');
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/api/index', index_route_1.default);
        this.app.use('/api/auth', auth_route_1.default);
        this.app.get('*', (uni.handleRender));
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`🚀 Server ready at http://localhost:${this.app.get('port')}`);
        });
    }
}
new Server().start();
