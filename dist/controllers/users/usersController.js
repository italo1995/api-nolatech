"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UsersController = void 0;
const tsoa_1 = require("tsoa");
const usersService_1 = __importDefault(require("../../services/users/usersService"));
let UsersController = class UsersController extends tsoa_1.Controller {
    async getUsers(queryParams) {
        const user = await usersService_1.default.all(queryParams);
        return user;
    }
    async getUser(key) {
        try {
            const userResponse = await usersService_1.default.get(key);
            this.setStatus(200); // HTTP 200 OK
            return userResponse;
        }
        catch (error) {
            this.setStatus(401); // HTTP 401 Unauthorized
            return Promise.reject(error);
        }
    }
    async createUser(requestBody) {
        this.setStatus(201); // set return status 201
        usersService_1.default.create(requestBody);
        return;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, tsoa_1.Get)('/all'),
    __param(0, (0, tsoa_1.Queries)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, tsoa_1.Get)("{userId}"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Created") // Custom success response
    ,
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
exports.UsersController = UsersController = __decorate([
    (0, tsoa_1.Route)("users"),
    (0, tsoa_1.Tags)("User")
], UsersController);
//# sourceMappingURL=usersController.js.map