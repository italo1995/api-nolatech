"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes/routes");
exports.app = (0, express_1.default)();
// app.use(
//   urlencoded({
//     extended: true,
//   })
// );
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
exports.app.use(body_parser_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: '*',
    methods: 'GET,POST', // Puedes ajustar los métodos permitidos
    credentials: true, // Si estás manejando cookies o autenticación
}));
// app.use(json());
(0, routes_1.RegisterRoutes)(exports.app);
//# sourceMappingURL=app.js.map