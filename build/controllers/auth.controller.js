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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const hash_util_1 = require("../utils/hash.util");
const user_model_1 = __importDefault(require("../models/user.model"));
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findUserByEmail(req.body.email);
                if (user[0].password === hash_util_1.md5(req.body.password)) {
                    const token = jsonwebtoken_1.default.sign({
                        id: user[0]._id,
                        name: user[0].name,
                    }, config_1.default.get('jwt'));
                    res.json({ token });
                }
                else {
                    res.status(403).json({ message: { type: 'credentials', payload: 'Crendeciales invalidas', descripcion: 'El usuario y la contraseña no coinciden', color: 'red' } });
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.body;
                const data = {
                    email: user.email,
                    password: hash_util_1.md5(user.password),
                };
                const result = yield user_model_1.default.register(data);
                res.json(result);
            }
            catch (error) {
                throw error;
            }
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bearerHeader = req.headers.authorization;
                if (typeof bearerHeader !== 'undefined') {
                    const bearer = bearerHeader.split(' ');
                    const bearerToken = bearer[1];
                    const token = bearerToken;
                    jsonwebtoken_1.default.verify(token, config_1.default.get('jwt'), (err, authData) => {
                        if (err) {
                            res.sendStatus(403);
                        }
                        else {
                            res.json({ access: true, authData });
                        }
                    });
                }
                else {
                    res.sendStatus(403);
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = AuthController;
