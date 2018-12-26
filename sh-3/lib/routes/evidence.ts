import { Request, Response } from "express";
import * as request from 'request-promise';
import * as spauth from 'node-sp-auth';
import * as dotenv from "dotenv";
import * as constants from 'constants';
dotenv.config()

export const dropdownList = (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  let url = "";
  const req_list = req.body.dropdownlist;
  const project_id = req.body.project;
  const assessment_id = req.body.assessment;
  const url_project = "https://ananda365.sharepoint.com/sites/SmartQualityAssurance/_api/lists/getbytitle('SQA_PROJECT')/items?$select=ID,Title"
  const url_audit = "https://ananda365.sharepoint.com/sites/SmartQualityAssurance/_api/lists/getbytitle('SQA_AUDIT')/items?$select=ID,Title,Project/ID,Assmnt_Set/ID&$expand=Project,Assmnt_Set&$filter=Project/ID eq'" + project_id + "'";
  const url_ass = "https://ananda365.sharepoint.com/sites/SmartQualityAssurance/_api/lists/getbytitle('SQA_ASSMNT_TYPE')/items?$select=ID,Title,Assmnt_Set/ID&$expand=Assmnt_Set&$filter=Assmnt_Set/ID eq'" + assessment_id + "'";
   
  if (req_list == "project") {
    url = url_project;
  }
  else if ( req_list =="audit"){
    url = url_audit
  }else if(req_list =="assessment"){
    url = url_ass
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
        res.status(200).send({
          data: response.d.results
        })
      });
    }).catch(err => {
      console.log(err)
    })
}

export const evidencelsit = (req: Request, res: Response) => {
  const username = req.query.username;
  const password = req.query.password;
  let url = "";
  const project_id = req.query.project;
  const audit_id = req.query.audit;
  const assessment_id = req.query.assessment;
  url = "https://ananda365.sharepoint.com/sites/SmartQualityAssurance/_api/lists/getbytitle('SQA_AUDIT_EVIDENCE')/items?$select=Title,Project/Title,Audit/Title,Assmnt_Type/Title,Assmnt_Category/Title,Assmnt_Subcategory/Title,Assmnt_Topic/Title,Created,Author/Title,Evidence_Image&$expand=Project,Audit,Assmnt_Type,Assmnt_Category,Assmnt_Subcategory,Assmnt_Topic,Author&$filter="
  let sumString = "";
  if (project_id != 0) sumString += " Project/ID eq "+project_id;
  if (audit_id != 0) sumString += " and Audit/ID eq "+audit_id;
  if (assessment_id != 0) sumString += " and Assmnt_Type/ID eq "+assessment_id
  // if(url)
  url+= sumString
  console.log(url)
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
      request.get({
        url: url,
        headers: headers,
        json: true,
      }).then(response => {
        res.status(200).send({
          data: response.d.results
        })
      });
    }).catch(err => {
      console.log(err)
    })
}