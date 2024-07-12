import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Queries,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { IUserResponse, IUserCreationParams, IUserFilters, IUser, IUserUpdateParams } from "../../../models/user/userModel";
import UserService from "../../../services/users/usersService";

/**
 * Controlador de usuarios.
 * @route /user
 * @tags user
 */
@Route("v1/users")
@Tags("User")
export class UsersController extends Controller {

  /**
   * @summary Obtener todos los usuarios con paginación.
   * @param {number} page - Número de página.
   * @param {number} count - Cantidad de usuarios por página.
   * @returns {Promise<{ data: { users: IUser[], message?: string }, status: boolean }>}
   */
  @Get('/')
  public async getUsers(
    @Queries() pQueryParams: IUserFilters
  ): Promise<{ data: { users: IUser[], message?: string | unknown }, status: boolean }> {
    try {
      const vReponse = await UserService.all(pQueryParams);
      return { data: vReponse, status: true };
    } catch (error) {
      return { data: { users: [], message: 'Ocurrió un error' }, status: false };
    }
  }

  /**
   * @summary Obtener un usuario por ID.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<IUserResponse | null>}
   */
  @Get("{userId}")
  public async getUser(
    @Path() userId: string,
  ): Promise<{ data: IUserResponse | null }> {
    try {
      const userResponse = await UserService.get(userId);
      this.setStatus(200); // HTTP 200 OK
      return { data: userResponse };
    } catch (error) {
      this.setStatus(401); // HTTP 401 Unauthorized
      return Promise.reject(error);
    }
  }

  /**
   * @summary Crear un nuevo usuario.
   * @param {IUserCreationParams} requestBody - Datos del nuevo usuario.
   * @returns {Promise<void>}
   */
  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: IUserCreationParams
  ): Promise<void> {
    this.setStatus(201); // set return status 201
    await UserService.create(requestBody);
    return;
  }

  /**
   * @summary Actualizar un usuario por ID.
   * @param {string} userId - ID del usuario.
   * @param {IUserCreationParams} requestBody - Datos actualizados del usuario.
   * @returns {Promise<void>}
   */
  @Patch("{userId}")
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: IUserUpdateParams
  ): Promise<{ data: IUserResponse | null, status: boolean }> {
    try {
      const userResponse: IUserResponse | null = await UserService.update(userId, requestBody);
      if (userResponse) {
        this.setStatus(200); // HTTP 200 OK
        return { data: userResponse, status: true };
      }
      this.setStatus(400); // HTTP 400 Bad Request
      return { data: null, status: false };
    } catch (error) {
      this.setStatus(400); // HTTP 400 Bad Request
      return { data: null, status: false };
    }
  }

  /**
   * @summary Eliminar un usuario por ID.
   * @param {string} key - ID del usuario.
   * @returns {Promise<void>}
   */
  @Delete("{key}")
  public async deleteUser(
    @Path() key: string
  ): Promise<{ status: boolean }> {
    try {
      await UserService.delete(key);
      this.setStatus(200);
      return  { status: true };
    } catch (error) {
      this.setStatus(400); // HTTP 400 Bad Request
      return { status: false };
    }
  }
}
