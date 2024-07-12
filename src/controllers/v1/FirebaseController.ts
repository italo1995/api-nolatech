import * as admin from 'firebase-admin'
import path from 'path'
import AppConfig from '../../config/AppConfig'

export interface CustomReference extends admin.database.Reference {}
export interface Query extends admin.database.Query {}
class FirebaseController {
  public messaging: admin.messaging.Messaging
  public db: admin.database.Database

  constructor() {
    const vRutaJSON = path.resolve(__dirname, AppConfig.FB_CREDENTIAL)
    admin.initializeApp({
      credential: admin.credential.cert(vRutaJSON),
      databaseURL: AppConfig.DB_HOST,
      storageBucket: AppConfig.STORAGE_HOST
    })

    this.messaging = admin.messaging()
    this.db = admin.database()
  }
}

export default new FirebaseController()
