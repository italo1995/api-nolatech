export interface IUser {
  key: string;
  email: string;  user: string;
  name: string;
  lastName?: string | null;
  password: string;
}

export type IUserCreationParams = Pick<IUser, "email" | "user" | "name" | "lastName" | "password">;
export type IUserUpdateParams = Pick<IUser, "email" | "user" | "name" | "lastName">;
export type IUserLogin = Pick<IUser, "email" | "password">;

export interface IUserResponse extends Omit<IUser, 'password'> {
}

export enum EOrder {
  NAME = 'name',
  CREATED = 'created',
  TYPE = 'type'
}
/**
 * @isInt
 */
export type Integer = number;
export interface IUserFilters {
  order?: EOrder;
  name?: string;
  rolId?: string;
  count?: Integer;
  page?: Integer;
}