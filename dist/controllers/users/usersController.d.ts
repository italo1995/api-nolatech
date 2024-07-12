import { Controller } from "tsoa";
import { IUserResponse, IUserCreationParams, IUserFilters, IUser } from "../../models/user/userModel";
export declare class UsersController extends Controller {
    getUsers(queryParams: IUserFilters): Promise<IUser[]>;
    getUser(key: string): Promise<IUserResponse | null>;
    createUser(requestBody: IUserCreationParams): Promise<void>;
}
