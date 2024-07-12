import {
  Body,
  Controller,
  Get,
  Post,
  Queries,
  Query,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { IUserResponse, IUserCreationParams, IUserFilters, IUser } from "../../../models/user/userModel";
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
   * @summary Registrar un nuevo usuario.
   * @param {IUserFilters} queryParams - Parámetros el filtrado de usuarios.
   * @returns {Promise<{ data: { users: IUser[], message?: string }, status: boolean }>}
   */
  @Get('/')
  public async getUsers(
    @Queries() pQueryParams: IUserFilters
  ): Promise<{ data: { users: IUser[], message?: string | unknown }, status: boolean }> {
    try {
      const vUser = await UserService.all(pQueryParams)
      return { data: { users: vUser }, status: true };
    } catch (error) {
      return { data: { users: [], message: 'Ocurrio un error' }, status: false };
    }

  }

  @Get("{userId}")
  public async getUser(
    @Query() key: string,
  ): Promise<IUserResponse | null> {
    try {
      const userResponse = await UserService.get(key);
      this.setStatus(200); // HTTP 200 OK
      return userResponse
    } catch (error) {
      this.setStatus(401); // HTTP 401 Unauthorized
      return Promise.reject(error);
    }
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: IUserCreationParams
  ): Promise<void> {
    this.setStatus(201); // set return status 201
    UserService.create(requestBody);
    return;
  }
}