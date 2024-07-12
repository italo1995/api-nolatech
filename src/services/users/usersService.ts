import FirebaseController, { CustomReference, Query } from "../../controllers/v1/FirebaseController";
import { EOrder, IUser, IUserFilters, IUserResponse, IUserCreationParams } from "../../models/user/userModel";


interface IUserService {
  all(pFilters: IUserFilters): Promise<IUser[]>
  create(pNewUser: IUserCreationParams): Promise<IUserResponse | null>
}

class UserService implements IUserService {
  private usersRef: CustomReference

  constructor(firebaseController: typeof FirebaseController) {
    this.usersRef = firebaseController.db.ref('users')
  }

  async all(pFilters: IUserFilters): Promise<IUser[]> {
    try {
      let query: Query = this.usersRef;
      if (pFilters.name) {
        query = query.orderByChild('name').equalTo(pFilters.name)
      }
      if (pFilters.rolId) {
        query = query.orderByChild('rolId').equalTo(pFilters.rolId)
      }
      if (pFilters?.order) {
        if (pFilters.order === EOrder.NAME) {
          query = query.orderByChild('name');
        } else if (pFilters.order === EOrder.CREATED) {
          query = query.orderByChild('created');
        }
      }

      if (pFilters.page) {
        const page = pFilters.page
        const pageSize = pFilters.count || 12
        const startAt = (page - 1) * pageSize
        const snapshot = await query.limitToFirst(pageSize).startAt(startAt).once('value')
        const users: IUser[] = [];
        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val() as IUser
          users.push(user)
        });
        return users

      } else {
        const snapshot = await query.once('value')
        const users: IUser[] = []
        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val() as IUser
          users.push(user)
        });
        return users
      }
    } catch (error) {
      throw error
    }
  }

  public async get(pKey: string): Promise<IUserResponse | null> {
    try {
      const snapshot = await this.usersRef.child(pKey).once('value');
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const user = {...userData, key: pKey};
        console.log('user :>> ', user);
        delete user.password
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public async create(pNewUser: IUserCreationParams): Promise<IUserResponse | null> {
    const userRef: CustomReference = await this.usersRef.push(pNewUser)
    if (userRef?.key) {
      const createdUser: IUserResponse = {
        key: userRef?.key,
        name: pNewUser.name,
        email: pNewUser.email,
        user: pNewUser?.user,
        lastName: pNewUser?.lastName,
      }
      return createdUser;
    }
    return null
  }

  public async verifyUser(email: string): Promise<IUser | null> {
    try {
      const snapshotEmail = await this.usersRef.orderByChild('email').equalTo(email).once('value');
      const snapshotName = await this.usersRef.orderByChild('user').equalTo(email).once('value');
      let userData: any = null;
      if (snapshotEmail.exists()) {
        userData = snapshotEmail.val();
      }
      if (snapshotName.exists()) {
        userData = snapshotName.val();
      }
      if (userData) {
        const userKey = Object.keys(userData)[0];
        const user = {...userData[userKey], key: userKey};
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
export default new UserService(FirebaseController)