// import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export interface IUser {
  key: string;
  email: string;  user: string;
  name: string;
  lastName?: string | null;
  password: string;
}

// export class UserValidation implements IUser {
//   @IsOptional()
//   key: string ='';

//   @IsEmail()
//   email: string ='';

//   @IsNotEmpty()
//   user: string ='';

//   @IsNotEmpty()
//   name: string ='';

//   @IsOptional()
//   lastName?: string | null;

//   @IsNotEmpty()
//   @MinLength(6)
//   password: string ='';
// }

export type IUserCreationParams = Pick<IUser, "email" | "user" | "name" | "lastName" | "password">;
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