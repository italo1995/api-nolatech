"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppConfig_1 = __importDefault(require("../config/AppConfig"));
const expressAuthentication = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.includes(' ') ? authHeader.split(' ')[1] : authHeader;
        jsonwebtoken_1.default.verify(token, AppConfig_1.default.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.auth = user;
            next();
            return;
        });
    }
    else {
        next();
        return;
    }
};
exports.expressAuthentication = expressAuthentication;
//# sourceMappingURL=authentication.js.map