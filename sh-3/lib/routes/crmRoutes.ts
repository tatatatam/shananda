// /lib/routes/crmRoutes.ts
import { Request, Response } from "express";
import * as spauth from 'node-sp-auth';
import * as request from 'request-promise';
import * as dotenv from "dotenv";
import * as constants from 'constants';
import * as defect from './defect'
import * as auth from './auth'
import * as evidence from './evidence'
import * as summary from './summary'
dotenv.config()

export class Routes {

  public routes(app): void {
    
    app.route('/').get( defect.test )
    app.route('/auth').post(auth.login)
    app.route('/filter').post(defect.filterData)
    app.route('/dropdownlist').post(defect.dropdownList)
    app.route("/grantlist").post(defect.grantList)
    app.route('/defect').post(defect.defect)
    app.route('/category').post(defect.category)
    app.route('/document').post(defect.document)
    
    app.route('/evidence/dropdownlist').post(evidence.dropdownList)
    app.route('/evidence/filter').get(evidence.evidencelsit)
    
    app.route('/summary').post(summary.getSumary)
  }
}
