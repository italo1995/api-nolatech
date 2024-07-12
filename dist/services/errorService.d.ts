import { IError } from '../models/Error/errorModel';
import FirebaseController from '../controllers/FirebaseController';
interface IErrorService {
    create(pItemCreate: IError): Promise<boolean>;
}
export type IErrorCreationParams = Pick<IError, "message" | "stack" | "path" | "method" | "request" | "time">;
declare class ErrorService implements IErrorService {
    private refColletion;
    constructor(firebaseController: typeof FirebaseController);
    create(pItemCreate: IErrorCreationParams): Promise<boolean>;
}
declare const _default: ErrorService;
export default _default;
