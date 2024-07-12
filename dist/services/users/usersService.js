"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseController_1 = __importDefault(require("../../controllers/FirebaseController"));
const userModel_1 = require("../../models/user/userModel");
class UserService {
    constructor(firebaseController) {
        this.usersRef = firebaseController.db.ref('users');
    }
    async all(pFilters) {
        try {
            let query = this.usersRef;
            if (pFilters.name) {
                query = query.orderByChild('name').equalTo(pFilters.name);
            }
            if (pFilters.rolId) {
                query = query.orderByChild('rolId').equalTo(pFilters.rolId);
            }
            if (pFilters?.order) {
                if (pFilters.order === userModel_1.EOrder.NAME) {
                    query = query.orderByChild('name');
                }
                else if (pFilters.order === userModel_1.EOrder.CREATED) {
                    query = query.orderByChild('created');
                }
            }
            if (pFilters.page) {
                const page = pFilters.page;
                const pageSize = pFilters.limit || 12;
                const startAt = (page - 1) * pageSize;
                const snapshot = await query.limitToFirst(pageSize).startAt(startAt).once('value');
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    users.push(user);
                });
                return users;
            }
            else {
                const snapshot = await query.once('value');
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    users.push(user);
                });
                return users;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async get(pKey) {
        try {
            const snapshot = await this.usersRef.child(pKey).once('value');
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userKey = Object.keys(userData)[0];
                const user = { ...userData[userKey], key: userKey };
                delete user.password;
                return user;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async create(pNewUser) {
        const userRef = await this.usersRef.push(pNewUser);
        if (userRef?.key) {
            const createdUser = {
                key: userRef?.key,
                name: pNewUser.name,
                email: pNewUser.email,
                user: pNewUser?.user,
                lastName: pNewUser?.lastName,
            };
            return createdUser;
        }
        return null;
    }
    async verifyUser(email) {
        try {
            const snapshotEmail = await this.usersRef.orderByChild('email').equalTo(email).once('value');
            const snapshotName = await this.usersRef.orderByChild('user').equalTo(email).once('value');
            let userData = null;
            if (snapshotEmail.exists()) {
                userData = snapshotEmail.val();
            }
            if (snapshotName.exists()) {
                userData = snapshotName.val();
            }
            if (userData) {
                const userKey = Object.keys(userData)[0];
                const user = { ...userData[userKey], key: userKey };
                return user;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = new UserService(FirebaseController_1.default);
//# sourceMappingURL=usersService.js.map