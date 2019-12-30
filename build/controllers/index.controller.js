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
const task_model_1 = __importDefault(require("../models/task.model"));
class IndexController {
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield task_model_1.default.getTasks(req.params.userId);
            res.json(task);
        });
    }
    registerTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { task } = req.body;
            const data = {
                name: task.name,
                priority: task.priority,
                description: task.description,
                expirationDate: new Date(task.expirationDate),
                status: 'Pendiente',
                userId: new mongodb_1.ObjectId(task.userId),
            };
            const result = yield task_model_1.default.registerTask(data);
            res.json(result);
        });
    }
    updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, name, priority, expirationDate, description } = req.body;
            const result = yield task_model_1.default.updateTask(_id, name, priority, new Date(expirationDate), description);
            res.json(result);
        });
    }
    updateStatusTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, status } = req.body;
            const result = yield task_model_1.default.updateStatusTask(_id, status);
            res.json(result);
        });
    }
    removeTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.body;
            const result = yield task_model_1.default.removeTask(_id);
            res.json(result);
        });
    }
}
exports.default = IndexController;
