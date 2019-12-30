"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = __importDefault(require("../controllers/index.controller"));
class IndexRoutes {
    constructor() {
        this.router = express_1.Router();
        this.IndexController = new index_controller_1.default();
        this.config();
    }
    config() {
        this.router.get('/getTasks/:userId', this.IndexController.getTasks);
        this.router.post('/registerTask', this.IndexController.registerTask);
        this.router.post('/updateTask', this.IndexController.updateTask);
        this.router.delete('/removeTask', this.IndexController.removeTask);
        this.router.post('/updateStatusTask', this.IndexController.updateStatusTask);
    }
}
exports.default = new IndexRoutes().router;
