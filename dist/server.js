"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./swagger.json"));
const authentication_1 = require("./middlwares/authentication");
const errorHandler_1 = require("./middlwares/errorHandler");
const port = process.env.PORT || 3000;
app_1.app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app_1.app.use(authentication_1.expressAuthentication);
app_1.app.use(errorHandler_1.errorHandler);
app_1.app.listen(port, () => console.log(`http://localhost:${port}`));
//# sourceMappingURL=server.js.map