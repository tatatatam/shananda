import { Request, Response } from "express";
import * as request from 'request-promise';
import * as spauth from 'node-sp-auth';
import * as dotenv from "dotenv";
import * as constants from 'constants';
import { _ } from 'underscore';
dotenv.config()

export const filterData = (req: Request, res: Response) => {
    const response_company = req.query.response;
    const category = req.query.category;
    const subcategory = req.query.subcategory;
    const status = req.query.status;
    const project = req.query.project;
    const username = req.query.username;
    const password = req.query.password;
    const pageId = req.query.page;
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
                // console.log(response);
                res.status(200).send({
                    data: response.d
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
    const url_subcate = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_SUBCATEGORY')/items?$select=ID,Title,Project/ID&$expand=Project&$filter=Project/ID eq '" + project_id + "' and Category/ID eq '" + category_id + "'";
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

export const getSumary = (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const project = req.body.project;
    const isHas = req.body.isHas;
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

            const url_cat = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_CATEGORY')/items?$top=2000&$select=ID,Category_Code,Title,Is_Approved,Item_Type/Title,Project/ID&$expand=Item_Type,Project&$filter=Project/ID eq  " + project;
            const url_subcat = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_SUBCATEGORY')/items?$top=2000&$select=ID,Subcategory_Code,Title,Category/ID,Category/Category_Code,Category/Title,Project/ID,Project/Title&$expand=Category,Project&$filter=Project/ID eq " + project;
            const url_defect = "https://ananda365.sharepoint.com/sites/SmartHandover/_api/lists/getbytitle('SHO_DEFECT_INFO')/items?$top=2000&$select=ID,Title,Category/Category_Code,Category/ID,Category/Title,Sub_x002d_category/Subcategory_Code,Sub_x002d_category/Title,Project/ID,Project/Title,Defect_Status/Title&$expand=Project,Category,Sub_x002d_category,Defect_Status&$filter=Project/ID eq " + project;

            request.get({
                url: url_cat,
                headers: headers,
                json: true,
            }).then(response_cat => {
                request.get({
                    url: url_subcat,
                    headers: headers,
                    json: true,
                }).then(response_subcat => {
                    request.get({
                        url: url_defect,
                        headers: headers,
                        json: true,
                    }).then(response_defect => {
                        // var group2 = _.groupBy(data, function (data) {
                            //     return data.Assmnt_Subcategory.Title
                           
                        // })
                        console.log(response_defect)
                        var catData = response_cat.d.results
                        var groupCatById = _.groupBy(response_cat.d.results, function (data) {
                            return data.ID
                        })
                        var groupSubcatById = _.groupBy(response_subcat.d.results, function (data) {
                            return data.Category.ID
                        })
                        var groupDefectById = _.groupBy(response_defect.d.results, function (data) {
                            return data.Category.ID
                        })
                       
                        var groupSubcatByIdSubCat = _.groupBy(response_subcat.d.results, function (data) {
                            return data.Subcategory_Code
                        })
                        var groupDefectByIdSubCat =  _.groupBy(response_defect.d.results, function (data) {
                            return data.Sub_x002d_category.Subcategory_Code
                        })
                        var groupPass = {}
                        for(var cat_id in groupDefectById){
                            var pass = 0;
                            var notPass = 0;
                            for (var i = 0; i < groupDefectById[cat_id].length;i++){
                                if (groupDefectById[cat_id][i].Defect_Status.Title == "PASS") pass++
                                else notPass ++ 
                            }
                            // console.log(groupDefectById[cat_id])
                            groupPass[cat_id] = {PASS:0, NOT_PASS:0}
                            groupPass[cat_id]["PASS"] = pass
                            groupPass[cat_id]["NOT_PASS"] = notPass

                        }
                        var groupPass_sub = {}
                        for (var sub_cat_id in groupDefectByIdSubCat) {
                            pass = 0;
                            notPass = 0;
                            for (var i = 0; i < groupDefectByIdSubCat[sub_cat_id].length; i++) {
                                if (groupDefectByIdSubCat[sub_cat_id][i].Defect_Status.Title == "PASS") pass++
                                else notPass++
                            }
                            // console.log(groupDefectById[cat_id])
                            groupPass_sub[sub_cat_id] = { PASS: 0, NOT_PASS: 0 }
                            groupPass_sub[sub_cat_id]["PASS"] = pass
                            groupPass_sub[sub_cat_id]["NOT_PASS"] = notPass

                        }
                        

                        var outputData = []
                        console.log(isHas)
                        for (var sub_cat in groupSubcatByIdSubCat){
                            for (var j = 0; j < groupSubcatByIdSubCat[sub_cat].length;j++){
                                var cat_id = groupSubcatByIdSubCat[sub_cat][j].Category.ID
                                groupSubcatByIdSubCat[sub_cat][j]["Cat_Data"] = groupCatById[cat_id][0]
                                if (groupPass_sub[sub_cat]) {
                                    groupSubcatByIdSubCat[sub_cat][j]["PASS"] = groupPass_sub[sub_cat].PASS
                                    groupSubcatByIdSubCat[sub_cat][j]["NOT_PASS"] = groupPass_sub[sub_cat].NOT_PASS
                                }
                                if (groupPass_sub[sub_cat]) {
                                    outputData.push(groupSubcatByIdSubCat[sub_cat][j])
                                } else {
                                    if (isHas == "true") {

                                    }
                                    else outputData.push(groupSubcatByIdSubCat[sub_cat][j])
                                }
                            }
                        }
                        console.log(outputData)
                        //cat data
                        /*
                        for (var cat_id in groupSubcatById){
                            for( var j=0;j<groupSubcatById[cat_id].length;j++){
                                groupSubcatById[cat_id][j]["Cat_Data"] = groupCatById[cat_id][0]
                                if (groupPass[cat_id]){
                                    groupSubcatById[cat_id][j]["PASS"] = groupPass[cat_id].PASS
                                    groupSubcatById[cat_id][j]["NOT_PASS"] = groupPass[cat_id].NOT_PASS
                                }
                                if (groupPass[cat_id]) {
                                    outputData.push(groupSubcatById[cat_id][j])
                                }else {
                                    if (isHas == "true") {

                                    }
                                    else outputData.push(groupSubcatById[cat_id][j])
                                }
                            }
                        }
                        */
                        res.json(outputData)
                    });
                });
            });
        }).catch(err => {
            console.log(err)
        })
}
