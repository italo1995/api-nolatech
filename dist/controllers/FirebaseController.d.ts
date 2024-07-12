import * as admin from 'firebase-admin';
export interface CustomReference extends admin.database.Reference {
}
export interface Query extends admin.database.Query {
}
declare class FirebaseController {
    messaging: admin.messaging.Messaging;
    db: admin.database.Database;
    constructor();
}
declare const _default: FirebaseController;
export default _default;
