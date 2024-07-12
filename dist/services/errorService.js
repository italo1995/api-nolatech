"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseController_1 = __importDefault(require("../controllers/FirebaseController"));
class ErrorService {
    constructor(firebaseController) {
        this.refColletion = firebaseController.db.ref('error_reportings');
    }
    async create(pItemCreate) {
        try {
            await this.refColletion.push(pItemCreate);
            return true;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = new ErrorService(FirebaseController_1.default);
//# sourceMappingURL=errorService.js.map