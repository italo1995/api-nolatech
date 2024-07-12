import { IUserResponse } from "./models/user/userModel";
export declare function expressAuthentication(request: Request, securityName: string, _scopes?: string[]): Promise<{
    token?: string;
    user?: IUserResponse;
    character?: any;
}>;
export declare function getTokenAndUser(_req: Request): Promise<{
    token?: string;
    user?: IUserResponse;
}>;
export declare function getHeaderAndCharacter(_req: Request): Promise<{
    token?: string;
    character?: any;
}>;
