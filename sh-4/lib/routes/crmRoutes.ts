// /lib/routes/crmRoutes.ts
import * as dotenv from "dotenv";
import * as defect from './defect'
import * as auth from './auth'
import * as evidence from './evidence'
import * as result from './result'
dotenv.config()


const staticPath = (path) => {
  const out = (process.env.PATH_URL ? process.env.PATH_URL : "/node/sh-4") + path
  return out
}
export class Routes {

  public routes(app): void {
    app.route(staticPath('/')).get( defect.test )
    app.route(staticPath('/auth')).post(auth.login)
  
    app.route(staticPath('/evidence/dropdownlist')).post(evidence.dropdownList)
    app.route(staticPath('/evidence/filter')).post(evidence.evidencelsit)
    
    app.route(staticPath('/result/dropdownlist')).post(result.dropdownList)
    app.route(staticPath('/result/filter')).post(result.resultList)
    app.route(staticPath('/result/filtersum')).post(result.resultListSummary)
  }
}
