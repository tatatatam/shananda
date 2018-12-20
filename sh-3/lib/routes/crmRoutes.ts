// /lib/routes/crmRoutes.ts
import { Request, Response } from "express";
import * as spauth from 'node-sp-auth';
import * as request from 'request-promise';
import * as dotenv from "dotenv";
import * as constants from 'constants';
dotenv.config()

export class Routes {

  public routes(app): void {

    app.route('/')
      .get((req: Request, res: Response) => {
        res.status(200).send({
          message: 'GET request successfulll!!!!'
        })
      })
    app.route('/auth')
      .post((req: Request, res: Response) => {
        let username = req.body.username;
        let password = req.body.password;
        console.log(username, password)
        spauth
          .getAuth('https://ananda365.sharepoint.com/sites/dev/', {
            username: username,
            password: password
          })
          .then(data => {
            var headers = data.headers;
            headers['Accept'] = 'application/json;odata=verbose';
            headers['secureOptions'] = constants.SSL_OP_NO_TLSv1_2;
            headers['ciphers'] = 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM';
            headers['honorCipherOrder'] = true;
           res.status(200).json({data: "Authorized"})
          
          }).catch(err => {
            console.log(err);
            res.status(401).json({data: "Cant login"});
          })
      })
    
  
    app.route('/next')
      .get((req: Request, res: Response) => {
        res.end()
      })
    app.route('/filter')
      .get((req: Request, res: Response) => {
        const response_company = req.query.response;
        const category = req.query.category;
        const status = req.query.status;
        const project = req.query.project;
        const username = req.query.username;
        const password = req.query.password;
        const pageId = req.query.page;
        let sum_string = " Project/ID eq '" + project + "'";
        if (status!="0") {
          sum_string += " and Defect_Status eq '" + status + "'";
        }
        if(response_company!="0") {
          sum_string += " and Response_Company/ID eq '" + response_company+"'";
        }

        if(category!="0"){
          sum_string += " and Category/ID eq '" + category+"'";
        }

        // var skiptoken = "&$skiptoken=Paged=TRUE&p_ID="+pageId+"&$top=20"
        // var skiptoken = "&$skiptoken=" + pageId 

        let url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT')/items?$top=2000&$select=ID,Defect_Code,Defect_Area_Image,Title,Description,Project/Title,Inspection/Title,Category/Title,Sub_x002d_category/Title,Defect_Status/Title,Target_Date,Created,Author/Title,Response_Company/Title,Defect_Image,Defect_Correction_IMG,Defect_Info/ID&$expand=Project,Inspection,Category,Sub_x002d_category,Defect_Status,Author,Response_Company,Defect_Info"
        url += "&$filter=" + sum_string +"&$orderby=ID";
        console.log(url)
        spauth
          .getAuth('https://ananda365.sharepoint.com/sites/dev/', {
            username: username,
            password: password
          })
          .then(data => {
            var headers = data.headers;
            headers['Accept'] = 'application/json;odata=verbose';
            headers['secureOptions'] = constants.SSL_OP_NO_TLSv1_2;
            headers['ciphers'] = 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM';
            headers['honorCipherOrder'] = true;

            // const url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT')/items"

            request.get({
              url: url,
              headers: headers,
              json: true,
            }).then(response => {
              // console.log(response);
              res.status(200).send({
                data: response.d
              })
            });
          }).catch(err => {
            console.log(err)
          })
      })

    app.route('/dropdownlist')
      .post((req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;
        console.log(req.query);
        let url = "";
         const req_list = req.body.dropdownlist;
         const project_id = req.body.project;
         const url_response_com = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_RESPONSE_COMPANY')/items?$select=ID,Title,Project/ID&$expand=Project&$filter=Project/ID eq '"+project_id+"'";
         const url_project = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_PROJECT')/items?$select=ID,Title&$filter=ID eq 12 "
         const url_defect_st = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT_STATUS')/items?$select=ID,Title"
         const url_cate = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_CATEGORY')/items?$select=ID,Title,Project/ID&$expand=Project&$filter=Project/ID eq '" + project_id + "'";
         if(req_list=="response_company"){
            url = url_response_com;
          }
          else if(req_list=="project"){
            url = url_project;
          }
          else if(req_list=="category"){
            url = url_cate;
          }
          else {
            url = url_defect_st;
          }
        // res.json(url);
        spauth
          .getAuth('https://ananda365.sharepoint.com/sites/dev/', {
            username: username,
            password: password
          })
          .then(data => {
            var headers = data.headers;
            headers['Accept'] = 'application/json;odata=verbose';
            headers['secureOptions'] = constants.SSL_OP_NO_TLSv1_2;
            headers['ciphers'] = 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM';
            headers['honorCipherOrder'] = true;

            // const url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT')/items"
            console.log(url);
            request.get({
              url: url,
              headers: headers,
              json: true,
            }).then(response => {
              console.log(response);
              res.status(200).send({
                data: response.d.results
              })
            });
          }).catch(err => {
            console.log(err)
          })
      })

      app.route("/grantlist")
      .post((req:Request, res:Response) => {
        const username = req.body.username;
        const password = req.body.password;
        console.log(username, password)
        spauth
          .getAuth('https://ananda365.sharepoint.com/sites/dev/', {
            username: username,
            password: password
          }).then( data => {
            var headers = data.headers;
            headers['Accept'] = 'application/json;odata=verbose';
            headers['secureOptions'] = constants.SSL_OP_NO_TLSv1_2;
            headers['ciphers'] = 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM';
            headers['honorCipherOrder'] = true;
            console.log(data)
            const url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_USER_ROLE')/items?$top=2000&$select=Project/ID,Project/Title,User/Name&$expand=Project,User&$filter=substringof('"+username+"',User/Name)";
            request.get({
              url: url,
              headers: headers,
              json: true,
            }).then(response => {
              res.json(response);
            }).catch(err=>{
              res.json(err);
            })
          })
          .catch(err=>{
            res.json(err);
          })

      })
    
    app.route('/defect')
      // GET endpoint 
      .post((req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;
        const project = req.body.project;
        spauth
          .getAuth('https://ananda365.sharepoint.com/sites/dev/', {
            username: username,
            password: password})
          .then(data => {
            var headers = data.headers;
            headers['Accept'] = 'application/json;odata=verbose';
            headers['secureOptions'] =  constants.SSL_OP_NO_TLSv1_2;
            headers['ciphers'] = 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM';
            headers['honorCipherOrder'] = true;
             
            const url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT_INFO')/items?$top=2000&$select=Defect_Code,Description,Title,Project/Title,Inspection/Title,Category/Title,Sub_x002d_category/Title,Defect_Status/Title,Target_Date,Created,Author/Title,Response_Company/Title&$expand=Project,Inspection,Category,Sub_x002d_category,Defect_Status,Author,Response_Company&$filter=Project/ID eq "+project;
            request.get({
              url: url,
              headers: headers,
              json: true,
            }).then(response => {
              // console.log(response);
              
             let data = response.d.results;
             let counter_pass = 0;
             let counter_not_pass = 0;

            //  for( let i =0; i< data.length; i++ ){
            //     if(data.Dfecte_Status.Title == "PASS") {
            //       counter_pass++;
            //     }else {
            //       counter_not_pass++;
            //     }
            //  }
            let res_count_status = {"PASS":0,"REMAIN":0};
            let mapped_status = data.map(data => data.Defect_Status.Title);
            for(let i=0;i<mapped_status.length;i++){
              if(mapped_status[i]=="PASS") res_count_status["PASS"]++
              else {
                res_count_status["REMAIN"]++
              }
            }
            let res_count = {};
             let mapped = data.map(data => data.Response_Company.Title)
             for(let i=0;i<mapped.length;i++){
               res_count[mapped[i]] = 1+(res_count[mapped[i]]||0); 
             }
             var unique = mapped.filter((v, i, a) => a.indexOf(v) === i); 
             let res_count2 = {};
             let mapped_mx = data.map(data => {

               return {"rp":data.Response_Company.Title, "status": data.Defect_Status.Title}
               }
             )
             for(var i=0;i<unique.length;i++){
               res_count2[unique[i]] = {PASS:0, REMAIN:0};
              //  res_count2[unique[i]].REMAIN= 0;
               for(var j=0;j<mapped_mx.length;j++){
                  if(mapped_mx[j].rp == unique[i]){
                    if (mapped_mx[j].status=="PASS"){
                      res_count2[unique[i]].PASS++;
                    } else {
                      res_count2[unique[i]].REMAIN++;
                    }
                  }
                }
             }
             console.log(res_count2)
              // for (let i = 0; i < mapped_mx.length; i++) {
                
              //   res_count2[mapped_mx[i].rp] = 1 + (res_count2[mapped_mx[i]] || 0);
              // }
             
              console.log(res_count);
              console.log(res_count_status);
              res.status(200).send({
                data: {
                  passChart: res_count_status,
                  responseCompanyChart: res_count,
                  responseCompanyRemain: res_count2
                }
              })
            });
          }).catch(err=> {
            console.log(err)
          })
        // Get all contacts            
      })
     
    app.route('/category')
      // GET endpoint 
      .post((req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;
        const project = req.body.project;
        spauth
          .getAuth('https://ananda365.sharepoint.com/sites/dev/', {
            username: username,
            password: password
          })
          .then(data => {
            var headers = data.headers;
            headers['Accept'] = 'application/json;odata=verbose';
            headers['secureOptions'] = constants.SSL_OP_NO_TLSv1_2;
            headers['ciphers'] = 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM';
            headers['honorCipherOrder'] = true;

            const url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_CATEGORY')/items?$top=2000&$select=Title,Project/ID,Project/Title,Is_Approved&$expand=Project&$filter=Project/ID eq " + project;
            request.get({
              url: url,
              headers: headers,
              json: true,
            }).then(response => {
              // console.log(response);

              let data = response.d.results;
              let counter = {APPROVE:0, NON_APPROVE:0}
              for(let i=0;i<data.length;i++){
                if (data.Is_Approved){
                  counter.APPROVE++;
                } else {
                  counter.NON_APPROVE++;
                }
              }
              console.log(data);
              res.status(200).send({
                data: {
                 dt: data,
                 category_approve: counter
                }
              })
            });
          }).catch(err => {
            console.log(err)
          })
        // Get all contacts            
      })

    app.route('/document')
      // GET endpoint 
      .post((req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;
        const project = req.body.project;
        spauth
          .getAuth('https://ananda365.sharepoint.com/sites/dev/', {
            username: username,
            password: password
          })
          .then(data => {
            var headers = data.headers;
            headers['Accept'] = 'application/json;odata=verbose';
            headers['secureOptions'] = constants.SSL_OP_NO_TLSv1_2;
            headers['ciphers'] = 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM';
            headers['honorCipherOrder'] = true;

            const url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DOCUMENT')/items?$top=2000&$select=Title,Project/ID,Project/Title,Is_Approved&$expand=Project&$filter=Project/ID eq " + project;
            request.get({
              url: url,
              headers: headers,
              json: true,
            }).then(response => {
              // console.log(response);

              let data = response.d.results;
              let counter = { APPROVE: 0, NON_APPROVE: 0 }
              for (let i = 0; i < data.length; i++) {
                if (data.Is_Approved) {
                  counter.APPROVE++;
                } else {
                  counter.NON_APPROVE++;
                }
              }
              console.log(data);
              res.status(200).send({
                data: {
                  dt: data,
                  doc_approve: counter
                }
              })
            });
          }).catch(err => {
            console.log(err)
          })
        // Get all contacts            
      })
   
    }
}
