import { Controller } from 'tsoa';
import { IUserResponse, IUserCreationParams, IUserLogin } from '../../models/user/userModel';
/**
 * Controlador de autenticación.
 * @route /auth
 * @tags auth
 */
export declare class AuthController extends Controller {
    private userService;
    constructor();
    /**
     * @summary Registrar un nuevo usuario.
     * @param {IUser} pRequestBody - Parámetros de creación del usuario.
     * @returns {Promise<{ user: IUserResponse | null; token: string } | { user: IUserResponse | null; message: string }>}
     */
    register(pRequestBody: IUserCreationParams): Promise<{
        data: {
            user: IUserResponse | null;
            token?: string;
            message?: string;
        };
        status: boolean;
    }>;
    /**
     * Inicia sesión con credenciales de usuario.
     * @param pRequestBody - Credenciales de inicio de sesión (email o user y contraseña).
     * @returns Usuario autenticado y token de autenticación o mensaje de error.
     * { data: { user: IUserResponse | null; token?: string, message?: string }, status: boolean }
     */
    login(pRequestBody: IUserLogin): Promise<{
        data: {
            user: IUserResponse | null;
            token?: string;
            message?: string;
        };
        status: boolean;
    }>;
    /**
     * Obtiene los detalles del usuario autenticado.
     * @param pRequestBody - Solicitud HTTP con información de autenticación.
     * @returns Detalles del usuario autenticado.
     */
    me(pRequestBody: {
        auth: IUserResponse;
    }): Promise<{
        data: {
            user: IUserResponse | null;
        };
        status: boolean;
    }>;
}
