import { Request, Response } from "express";
import * as request from 'request-promise';
import * as spauth from 'node-sp-auth';
import * as dotenv from "dotenv";
import * as constants from 'constants';
dotenv.config()

export  const test = (req: Request, res: Response) => {
      res.status(200).send({
        message: 'GET request successfulll!!!!'
      })
    };

export const timeOut = async (req: Request, res: Response) => {
  await setTimeout(()=>{
    console.log(50)
    res.status(200).send('Timout')
  },15000)
}

export const filterData = (req: Request, res: Response) => {
  const response_company = req.body.response;
  const category = req.body.category;
  const subcategory = req.body.subcategory;
  const status = req.body.status;
  const project = req.body.project;
  const username = req.body.username;
  const password = req.body.password;
  // const pageId = req.query.page;
  let sum_string = " Project/ID eq '" + project + "'";
  if (status != "0") {
    sum_string += " and Defect_Status eq '" + status + "'";
  }
  if (response_company != "0") {
    sum_string += " and Response_Company/ID eq '" + response_company + "'";
  }

  if (category != "0") {
    sum_string += " and Category/ID eq '" + category + "'";
  }

  if (subcategory != "0") {
    sum_string += " and Sub_x002d_category/ID eq '" + subcategory + "'";
  }
  let url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT')/items?$top=2000&$select=ID,Defect_Code,Defect_Area_Image,Title,Description,Project/Title,Inspection/Title,Category/Title,Sub_x002d_category/Title,Defect_Status/Title,Target_Date,Created,Author/Title,Response_Company/Title,Defect_Image,Defect_Correction_IMG,Defect_Info/ID&$expand=Project,Inspection,Category,Sub_x002d_category,Defect_Status,Author,Response_Company,Defect_Info"
  url += "&$filter=" + sum_string + "&$orderby=ID";
  console.log(url, password)
  
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
      request.get({
        url: url,
        headers: headers,
        json: true,
        timeout: 1200000,
        resolveWithFullResponse: true,
        time: true
      }).then(response => {
        console.log(response.elapsedTime)
        res.status(200).send({
          data: response.body.d
        })
      });
    }).catch(err => {
      console.log(err)
    })
}

export const dropdownList = (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.query);
  let url = "";
  const req_list = req.body.dropdownlist;
  const project_id = req.body.project;
  const category_id = req.body.category_id
  const url_response_com = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_RESPONSE_COMPANY')/items?$select=ID,Title,Project/ID&$expand=Project&$filter=Project/ID eq '" + project_id + "'";
  const url_project = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_PROJECT')/items?$select=ID,Title&$filter=ID eq 12 "
  const url_defect_st = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT_STATUS')/items?$select=ID,Title"
  const url_cate = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_CATEGORY')/items?$select=ID,Title,Project/ID&$expand=Project&$filter=Project/ID eq '" + project_id + "'";
  const url_subcate = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_SUBCATEGORY')/items?$select=ID,Title,Project/ID&$expand=Project&$filter=Project/ID eq '" + project_id + "' and Category/ID eq '" + category_id +"'";
  if (req_list == "response_company") {
    url = url_response_com;
  }
  else if (req_list == "project") {
    url = url_project;
  }
  else if (req_list == "category") {
    url = url_cate;
  }
  else if (req_list == "subcategory") {
    url = url_subcate;
  }
  else {
    url = url_defect_st;
  }
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
}

export const grantList = (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password)
  spauth
    .getAuth('https://ananda365.sharepoint.com/sites/dev/', {
      username: username,
      password: password
    }).then(data => {
      var headers = data.headers;
      headers['Accept'] = 'application/json;odata=verbose';
      headers['secureOptions'] = constants.SSL_OP_NO_TLSv1_2;
      headers['ciphers'] = 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM';
      headers['honorCipherOrder'] = true;
      console.log(data)
      const url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_USER_ROLE')/items?$top=2000&$select=Project/ID,Project/Title,User/Name&$expand=Project,User&$filter=substringof('" + username + "',User/Name)";
      request.get({
        url: url,
        headers: headers,
        json: true,
      }).then(response => {
        res.json(response);
      }).catch(err => {
        res.json(err);
      })
    })
    .catch(err => {
      res.json(err);
    })
}

export const defect = (req: Request, res: Response) => {
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

      const url = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT_INFO')/items?$top=2000&$select=Defect_Code,Description,Title,Project/Title,Inspection/Title,Category/Title,Sub_x002d_category/Title,Defect_Status/Title,Target_Date,Created,Author/Title,Response_Company/Title&$expand=Project,Inspection,Category,Sub_x002d_category,Defect_Status,Author,Response_Company&$filter=Project/ID eq " + project;
      request.get({
        url: url,
        headers: headers,
        json: true,
      }).then(response => {
        // console.log(response);

        let data = response.d.results;
        let counter_pass = 0;
        let counter_not_pass = 0;
        let res_count_status = { "PASS": 0, "REMAIN": 0 };
        let mapped_status = data.map(data => data.Defect_Status.Title);
        for (let i = 0; i < mapped_status.length; i++) {
          if (mapped_status[i] == "PASS") res_count_status["PASS"]++
          else {
            res_count_status["REMAIN"]++
          }
        }
        let res_count = {};
        let mapped = data.map(data => data.Response_Company.Title)
        for (let i = 0; i < mapped.length; i++) {
          res_count[mapped[i]] = 1 + (res_count[mapped[i]] || 0);
        }
        var unique = mapped.filter((v, i, a) => a.indexOf(v) === i);
        let res_count2 = {};
        let mapped_mx = data.map(data => {

          return { "rp": data.Response_Company.Title, "status": data.Defect_Status.Title }
        }
        )
        for (var i = 0; i < unique.length; i++) {
          res_count2[unique[i]] = { PASS: 0, REMAIN: 0 };
          //  res_count2[unique[i]].REMAIN= 0;
          for (var j = 0; j < mapped_mx.length; j++) {
            if (mapped_mx[j].rp == unique[i]) {
              if (mapped_mx[j].status == "PASS") {
                res_count2[unique[i]].PASS++;
              } else {
                res_count2[unique[i]].REMAIN++;
              }
            }
          }
        }
        res.status(200).send({
          data: {
            passChart: res_count_status,
            responseCompanyChart: res_count,
            responseCompanyRemain: res_count2
          }
        })
      });
    }).catch(err => {
      console.log(err)
    })
  // Get all contacts            
}

export const category = (req: Request, res: Response) => {
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
            category_approve: counter
          }
        })
      });
    }).catch(err => {
      console.log(err)
    })
  // Get all contacts            
} 

export const document = (req: Request, res: Response) => {
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
}