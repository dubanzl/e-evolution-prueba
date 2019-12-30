"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
class AuthRoutes {
    constructor() {
        this.router = express_1.Router();
        this.AuthController = new auth_controller_1.default();
        this.config();
    }
    config() {
        this.router.post('/login', this.AuthController.login);
        this.router.post('/register', this.AuthController.register);
        this.router.post('/verify', this.AuthController.verify);
    }
}
exports.default = new AuthRoutes().router;
