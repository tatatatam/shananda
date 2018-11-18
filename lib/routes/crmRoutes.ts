// /lib/routes/crmRoutes.ts
import { Request, Response } from "express";
import * as spauth from 'node-sp-auth';
import * as request from 'request-promise';
import * as dotenv from "dotenv";
dotenv.config()

export class Routes {

  public routes(app): void {

    app.route('/')
      .get((req: Request, res: Response) => {
        res.status(200).send({
          message: 'GET request successfulll!!!!'
        })
      })

    // Contact 
    app.route('/defect')
      // GET endpoint 
      .get((req: Request, res: Response) => {
        spauth
          .getAuth('https://ananda365.sharepoint.com/sites/dev/', {
            username: process.env.SH_USER,
            password: process.env.SH_PASS
          })
          .then(data => {
            var headers = data.headers;
            headers['Accept'] = 'application/json;odata=verbose';
            const url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT')/items?$select=Defect_Code,Description,Title,Project/Title,Inspection/Title,Category/Title,Sub_x002d_category/Title,Defect_Status/Title,Target_Date,Created,Author/Title,Response_Company/Title,Defect_Image,Defect_Correction_IMG&$expand=Project,Inspection,Category,Sub_x002d_category,Defect_Status,Author,Response_Company";
            // const url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT')/items"
            request.get({
              url: url,
              headers: headers,
              json: true
            }).then(response => {
              console.log(response);
              res.status(200).send({
                data: response.d.results
              })
            });
          });
        // Get all contacts            
      })
      // POST endpoint
      .post((req: Request, res: Response) => {
        // Create new contact         
        res.status(200).send({
          message: 'POST request successfulll!!!!'
        })
      })

    // Contact detail
    app.route('/contact/:contactId')
      // get specific contact
      .get((req: Request, res: Response) => {
        // Get a single contact detail            
        res.status(200).send({
          message: 'GET request successfulll!!!!'
        })
      })
      .put((req: Request, res: Response) => {
        // Update a contact           
        res.status(200).send({
          message: 'PUT request successfulll!!!!'
        })
      })
      .delete((req: Request, res: Response) => {
        // Delete a contact     
        res.status(200).send({
          message: 'DELETE request successfulll!!!!'
        })
      })
  }
}