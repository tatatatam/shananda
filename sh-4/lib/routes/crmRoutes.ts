// /lib/routes/crmRoutes.ts
import * as dotenv from "dotenv";
import * as defect from './defect'
import * as auth from './auth'
import * as evidence from './evidence'
dotenv.config()

export class Routes {

  public routes(app): void {
    app.route('/').get( defect.test )
    app.route('/auth').post(auth.login)
  
    app.route('/evidence/dropdownlist').post(evidence.dropdownList)
    app.route('/evidence/filter').get(evidence.evidencelsit)
    
  }
}
