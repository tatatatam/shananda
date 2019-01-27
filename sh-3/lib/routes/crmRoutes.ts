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

const staticPath = (path) => {
  const out = (process.env.PATH_URL ? process.env.PATH_URL : "/node/sh-3") + path
  return out
}
export class Routes {
  public routes(app): void {
    
    app.route(staticPath('/')).get( defect.test )
    app.route(staticPath('/auth')).post(auth.login)
    app.route(staticPath('/filter')).post(defect.filterData)
    app.route(staticPath('/dropdownlist')).post(defect.dropdownList)
    app.route(staticPath("/grantlist")).post(defect.grantList)
    app.route(staticPath('/defect')).post(defect.defect)
    app.route(staticPath('/category')).post(defect.category)
    app.route(staticPath('/document')).post(defect.document)
    
    app.route(staticPath('/evidence/dropdownlist')).post(evidence.dropdownList)
    app.route(staticPath('/evidence/filter')).get(evidence.evidencelsit)
    
    app.route(staticPath('/summary')).post(summary.getSumary)
  }
}
