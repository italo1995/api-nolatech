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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tsoa_1 = require("tsoa");
const argon2 = __importStar(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersService_1 = __importDefault(require("../../services/users/usersService"));
const AppConfig_1 = __importDefault(require("../../config/AppConfig"));
/**
 * Controlador de autenticación.
 * @route /auth
 * @tags auth
 */
let AuthController = class AuthController extends tsoa_1.Controller {
    constructor() {
        super();
        this.userService = usersService_1.default;
    }
    /**
     * @summary Registrar un nuevo usuario.
     * @param {IUser} pRequestBody - Parámetros de creación del usuario.
     * @returns {Promise<{ user: IUserResponse | null; token: string } | { user: IUserResponse | null; message: string }>}
     */
    async register(pRequestBody) {
        try {
            this.setStatus(201);
            const vEmailVerify = await this.userService.verifyUser(pRequestBody.email);
            const vUserVerify = await this.userService.verifyUser(pRequestBody.user);
            if (vEmailVerify || vUserVerify) {
                return { data: { user: null, message: vEmailVerify ? 'El correo ya existe' : 'El nombre de usuario ya existe' }, status: false };
            }
            const vHashedPassword = await argon2.hash(pRequestBody.password);
            pRequestBody.password = vHashedPassword;
            const vUser = await this.userService.create(pRequestBody);
            if (vUser) {
                const vToken = jsonwebtoken_1.default.sign(vUser, AppConfig_1.default.JWT_SECRET_KEY, {});
                return { data: { user: vUser, token: vToken }, status: true };
            }
            else {
                return { data: { user: vUser, message: 'Ocurrio un error' }, status: false };
            }
        }
        catch (error) {
            this.setStatus(401); // HTTP 401 Unauthorized
            return { data: { user: null, message: 'Ocurrio un error' }, status: false };
        }
    }
    /**
     * Inicia sesión con credenciales de usuario.
     * @param pRequestBody - Credenciales de inicio de sesión (email o user y contraseña).
     * @returns Usuario autenticado y token de autenticación o mensaje de error.
     * { data: { user: IUserResponse | null; token?: string, message?: string }, status: boolean }
     */
    async login(pRequestBody) {
        try {
            const vUser = await this.userService.verifyUser(pRequestBody.email);
            if (vUser) {
                const vPasswordIsValid = await argon2.verify(vUser.password, pRequestBody.password);
                if (vPasswordIsValid) {
                    const vUserResponse = vUser;
                    const vToken = jsonwebtoken_1.default.sign({ key: vUserResponse.key, name: vUserResponse.name }, AppConfig_1.default.JWT_SECRET_KEY);
                    this.setStatus(200); // HTTP 200 OK
                    return { data: { user: vUserResponse, token: vToken }, status: true };
                }
            }
            return { data: { user: null, message: 'Usuario incorrecto' }, status: false };
        }
        catch (error) {
            this.setStatus(401); // HTTP 401 Unauthorized
            return Promise.reject(error);
        }
    }
    /**
     * Obtiene los detalles del usuario autenticado.
     * @param pRequestBody - Solicitud HTTP con información de autenticación.
     * @returns Detalles del usuario autenticado.
     */
    async me(pRequestBody) {
        try {
            const vUser = await this.userService.get(pRequestBody.auth.key);
            if (vUser) {
                this.setStatus(201); // HTTP 201 Created
                return { data: { user: vUser }, status: true };
            }
            this.setStatus(401); // HTTP 401 Unauthorized
            return { data: { user: null }, status: false };
        }
        catch (error) {
            this.setStatus(401); // HTTP 401 Unauthorized
            return { data: { user: null }, status: false };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, tsoa_1.Post)('/register'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, tsoa_1.Post)('/login'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Get)('/me'),
    (0, tsoa_1.Security)('bearerAuth'),
    (0, tsoa_1.SuccessResponse)('201', 'User Found'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)('auth'),
    (0, tsoa_1.Tags)('auth'),
    __metadata("design:paramtypes", [])
], AuthController);
//# sourceMappingURL=authController.js.map