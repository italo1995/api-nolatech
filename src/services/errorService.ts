/* eslint-disable no-useless-catch */
import { IError } from '../models/Error/errorModel'
import FirebaseController, { CustomReference } from '../controllers/v1/FirebaseController'

interface IErrorService {
  create(pItemCreate: IError): Promise<boolean>
}
export type IErrorCreationParams = Pick<IError, "message" | "stack" | "path" | "method" | "request" | "time">

class ErrorService implements IErrorService {
  private refColletion: CustomReference

  constructor(firebaseController: typeof FirebaseController) {
    this.refColletion = firebaseController.db.ref('error_reportings')
  }

  async create(pItemCreate: IErrorCreationParams): Promise<boolean> {
    try {
      await this.refColletion.push(pItemCreate)
      return true
    } catch (error) {
      throw error
    }
  }
}

export default new ErrorService(FirebaseController)
