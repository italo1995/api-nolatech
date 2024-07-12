"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const tsoa_1 = require("tsoa");
const errorService_1 = __importDefault(require("../services/errorService"));
function errorHandler(err, req, res, _next) {
    if (err instanceof tsoa_1.ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    // if (err instanceof Error) {
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        request: req.body,
        time: new Date().toISOString()
    };
    errorService_1.default.create(errorDetails);
    return res.status(500).json({
        message: errorDetails.message,
    });
    // }
}
//# sourceMappingURL=errorHandler.js.map