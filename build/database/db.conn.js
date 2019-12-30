"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const lodash_1 = require("lodash");
const config_1 = __importDefault(require("config"));
class Database {
    constructor() {
        this.host = config_1.default.get('mongo.host');
        this.port = config_1.default.get('mongo.port');
        this.dbname = config_1.default.get('mongo.dbname');
    }
    getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (lodash_1.isEmpty(this.connection)) {
                    yield this.connect();
                }
                if (this.connection !== undefined) {
                    return this.connection.db(this.dbname);
                }
                throw Error;
            }
            catch (error) {
                throw error;
            }
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield mongodb_1.MongoClient.connect(`mongodb://${this.host}:${this.port}/${this.dbname}`, { useUnifiedTopology: true, useNewUrlParser: true });
            }
            catch (error) {
                throw error;
            }
        });
    }
    disconnect() {
        try {
            if (this.connection !== undefined) {
                this.connection.close();
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = new Database().getInstance();
