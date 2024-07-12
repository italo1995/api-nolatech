import { Controller, Route, SuccessResponse, Post, Get, Tags, Body, Security, Request } from 'tsoa';
import * as argon2 from 'argon2';
import jwt, { Secret } from 'jsonwebtoken';
import { IUserResponse, IUserCreationParams, IUserLogin } from '../../../models/user/userModel';
import UserService from '../../../services/users/usersService';
import AppConfig from '../../../config/AppConfig';

/**
 * Controlador de autenticación.
 * @route /auth
 * @tags auth
 */
@Route('v1/auth')
@Tags('Auth')
export class AuthController extends Controller {
  private userService: typeof UserService;
  constructor() {
    super();
    this.userService = UserService;
  }


  /**
   * @summary Registrar un nuevo usuario.
   * @param {IUser} pRequestBody - Parámetros de creación del usuario.
   * @returns {Promise<{ user: IUserResponse | null; token: string } | { user: IUserResponse | null; message: string }>}
   */
  @Post('register')
  public async register(
    @Body() pRequestBody: IUserCreationParams,
  ): Promise<{ data: { user: IUserResponse | null; token?: string, message?: string | string[] }, status: boolean }> {
    try {
      this.setStatus(201)
      const vEmailVerify = await this.userService.verifyUser(pRequestBody.email);
      const vUserVerify = await this.userService.verifyUser(pRequestBody.user);
      if (vEmailVerify || vUserVerify) {
        return { data: { user: null, message: vEmailVerify ? 'El correo ya existe' : 'El nombre de usuario ya existe' }, status: false };
      }
      const validatePassword = this.validatePassword(pRequestBody.password)
      if (validatePassword) {
        return { data: { user: null, message: validatePassword }, status: false };
      }
      const vHashedPassword = await argon2.hash(pRequestBody.password);
      pRequestBody.password = vHashedPassword;

      const vUser = await this.userService.create(pRequestBody);
      if (vUser) {
        const vToken = jwt.sign(
          vUser,
          AppConfig.JWT_SECRET_KEY,
          { }
        );
        return { data: { user: vUser, token: vToken }, status: true };
      } else {
        return { data: { user: vUser, message: 'Ocurrio un error' }, status: false };
      }
    } catch (error) {
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
  @Post('login')
  public async login(
    @Body() pRequestBody: IUserLogin
  ): Promise<{ data: { user: IUserResponse | null; token?: string, message?: string }, status: boolean}> {
    try {
      const vUser = await this.userService.verifyUser(pRequestBody.email);
      if (vUser) {
        const vPasswordIsValid = await argon2.verify(vUser.password, pRequestBody.password);
        if (vPasswordIsValid) {
          const vUserResponse: IUserResponse = vUser
          const vToken = jwt.sign(
            { key: vUserResponse.key, name: vUserResponse.name },
            AppConfig.JWT_SECRET_KEY as Secret
          );
          this.setStatus(200); // HTTP 200 OK
          return { data: { user: vUserResponse, token: vToken }, status: true};
        }
      }
      return { data: { user: null, message: 'Usuario incorrecto' }, status: false };
    } catch (error) {
      this.setStatus(401); // HTTP 401 Unauthorized
      return Promise.reject(error);
    }
  }

  /**
   * Obtiene los detalles del usuario autenticado.
   * @param pRequestBody - Solicitud HTTP con información de autenticación.
   * @returns Detalles del usuario autenticado.
   */
  @Get('me')
  @Security('bearerAuth')
  @SuccessResponse('201', 'User Found')
  public async me(@Request() pRequestBody: { auth: IUserResponse }): Promise<{ data: { user: IUserResponse | null }, status: boolean}>  {
    try {
      console.log('pRequestBody :>> ', pRequestBody.auth);
      console.log('pRequestBody.auth.key :>> ', pRequestBody.auth.key);
      const vUser: IUserResponse | null = await this.userService.get(pRequestBody.auth.key);
      console.log('vUser :>> ', vUser);
      if (vUser) {
        this.setStatus(201); // HTTP 201 Created
        return  { data: { user: vUser }, status: true };
      }
      this.setStatus(401); // HTTP 401 Unauthorized
      return  { data: { user: null }, status: false };
    } catch (error) {
      this.setStatus(401); // HTTP 401 Unauthorized
      return  { data: { user: null }, status: false };
    }
  }

  /**
   * Valida una contraseña según los siguientes criterios:
   * - Al menos una letra minúscula
   * - Al menos una letra mayúscula
   * - Al menos un número
   * - Al menos un símbolo especial
   * - Longitud mínima de 3 caracteres
   *
   * @param {string} password - La contraseña a validar.
   * @returns {string | false} - Una cadena que describe los requisitos faltantes si la contraseña no es válida, o `false` si la contraseña es válida.
   */
  private validatePassword(password: string): string | false {
    const errors: string[] = [];
    if (!/(?=.*[a-z])/.test(password)) {
        errors.push("una letra minúscula");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        errors.push("una letra mayúscula");
    }
    if (!/(?=.*\d)/.test(password)) {
        errors.push("un número");
    }
    if (!/(?=.*[@$!%*?&.])/.test(password)) {
        errors.push("un símbolo especial");
    }
    if (password.length < 3) {
        errors.push("al menos 3 caracteres");
    }
    if (errors.length) {
      return `Se requiere al menos: ${errors.join(", ")}`;
    }
    return false;
  }
}
