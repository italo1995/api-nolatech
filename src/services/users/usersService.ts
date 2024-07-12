import FirebaseController, { CustomReference, Query } from "../../controllers/v1/FirebaseController";
import { EOrder, IUser as IUserReponse, IUserFilters, IUserResponse, IUserCreationParams, IUserUpdateParams } from "../../models/user/userModel";

interface IUserService {
  all(pFilters: IUserFilters): Promise<{ users: IUserReponse[], totalUsers: number, totalPages: number}>
  create(pNewUser: IUserCreationParams): Promise<IUserResponse | null>
  get(pKey: string): Promise<IUserResponse | null>
  update(pKey: string, pUpdatedUser: IUserCreationParams): Promise<IUserResponse | null>
  delete(pKey: string): Promise<void>
}

class UserService implements IUserService {
  private usersRef: CustomReference

  constructor(firebaseController: typeof FirebaseController) {
    this.usersRef = firebaseController.db.ref('users')
  }

  async all(pFilters: IUserFilters): Promise<{ users: IUserReponse[], totalUsers: number, totalPages: number}> {
    try {
      let vQuery: Query = this.usersRef;
      if (pFilters.name) {
        vQuery = vQuery.orderByChild('name').equalTo(pFilters.name)
      }
      if (pFilters.rolId) {
        vQuery = vQuery.orderByChild('rolId').equalTo(pFilters.rolId)
      }
      if (pFilters?.order) {
        if (pFilters.order === EOrder.NAME) {
          vQuery = vQuery.orderByChild('user');
        } else if (pFilters.order === EOrder.CREATED) {
          vQuery = vQuery.orderByChild('created');
        }
      } else {
        vQuery = vQuery.orderByChild('email');
      }

      const vPageSize = pFilters.count || 12;
      let vSnapshot;
      let vTotalUsers = 0
      let vTotalPages = 0
      if (pFilters?.page && pFilters.page > 1) {
        const vPage = pFilters.page;
        const vPageSize = pFilters.count || 12;
        const vStartAt = (vPage - 1) * vPageSize;
        let vBeforeKey: string | null = null
        const vSnapshotBefore = await vQuery.limitToFirst(vStartAt).once('value');
        vSnapshotBefore.forEach((childSnapshot) => {
          const vUser = childSnapshot.val()
          vBeforeKey = vUser.email;
        });
        const vTotalSnapshot = await vQuery.once('value');
        vTotalUsers = vTotalSnapshot.numChildren();
        vTotalPages = Math.ceil(vTotalUsers / vPageSize);
        vSnapshot = await vQuery.limitToFirst(vPageSize).startAfter(vBeforeKey).once('value');
      } else {
        vSnapshot = await vQuery.limitToFirst(vPageSize).once('value');
      }

      const vUsers: IUserReponse[] = [];
      vSnapshot.forEach((childSnapshot) => {
        const vUser = childSnapshot.val() as IUserReponse;
        vUser.key = childSnapshot.key
        vUsers.push(vUser);
      });

      return {
        users: vUsers,
        totalUsers: vTotalUsers,
        totalPages: vTotalPages
      };
    } catch (error) {
      throw error
    }
  }

  public async get(pKey: string): Promise<IUserResponse | null> {
    try {
      const vSnapshot = await this.usersRef.child(pKey).once('value');
      if (vSnapshot.exists()) {
        const vUserData = vSnapshot.val();
        const vUser = {...vUserData, key: pKey};
        delete vUser.password
        return vUser;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public async create(pNewUser: IUserCreationParams): Promise<IUserResponse | null> {
    const vUserRef: CustomReference = await this.usersRef.push(pNewUser)
    if (vUserRef?.key) {
      const vCreatedUser: IUserResponse = {
        key: vUserRef?.key,
        name: pNewUser.name,
        email: pNewUser.email,
        user: pNewUser?.user,
        lastName: pNewUser?.lastName,
      }
      return vCreatedUser;
    }
    return null
  }

  public async update(pKey: string, pUpdatedUser: IUserUpdateParams): Promise<IUserResponse | null> {
    try {
      await this.usersRef.child(pKey).update(pUpdatedUser);
      const vUpdatedUser = await this.get(pKey);
      return vUpdatedUser;
    } catch (error) {
      throw error;
    }
  }

  public async delete(pKey: string): Promise<void> {
    try {
      await this.usersRef.child(pKey).remove();
    } catch (error) {
      throw error;
    }
  }

  public async verifyUser(email: string): Promise<IUserReponse | null> {
    try {
      const vSnapshotEmail = await this.usersRef.orderByChild('email').equalTo(email).once('value');
      const vSnapshotName = await this.usersRef.orderByChild('user').equalTo(email).once('value');
      let vUserData: any = null;
      if (vSnapshotEmail.exists()) {
        vUserData = vSnapshotEmail.val();
      }
      if (vSnapshotName.exists()) {
        vUserData = vSnapshotName.val();
      }
      if (vUserData) {
        const vUserKey = Object.keys(vUserData)[0];
        const vUser = {...vUserData[vUserKey], key: vUserKey};
        return vUser;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default new UserService(FirebaseController);
