import FirebaseController from "../../controllers/FirebaseController";
import { IUser, IUserFilters, IUserResponse, IUserCreationParams } from "../../models/user/userModel";
interface IUserService {
    all(pFilters: IUserFilters): Promise<IUser[]>;
    create(pNewUser: IUserCreationParams): Promise<IUserResponse | null>;
}
declare class UserService implements IUserService {
    private usersRef;
    constructor(firebaseController: typeof FirebaseController);
    all(pFilters: IUserFilters): Promise<IUser[]>;
    get(pKey: string): Promise<IUserResponse | null>;
    create(pNewUser: IUserCreationParams): Promise<IUserResponse | null>;
    verifyUser(email: string): Promise<IUser | null>;
}
declare const _default: UserService;
export default _default;
