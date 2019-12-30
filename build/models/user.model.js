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
const db_conn_1 = __importDefault(require("../database/db.conn"));
class UserModel {
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_conn_1.default.then((conn) => conn.collection('users').find({ email }).toArray());
            }
            catch (err) {
                throw err;
            }
        });
    }
    static register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new Promise((resolve) => {
                    db_conn_1.default.then((conn) => conn.collection('users').insertOne(user, (err, doc) => {
                        if (err) {
                            throw err;
                        }
                        resolve(doc.ops[0]);
                    }));
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = UserModel;
