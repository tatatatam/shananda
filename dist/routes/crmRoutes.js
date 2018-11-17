"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spauth = require("node-sp-auth");
const request = require("request-promise");
class Routes {
    routes(app) {
        app.route('/')
            .get((req, res) => {
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            });
        });
        // Contact 
        app.route('/contact')
            // GET endpoint 
            .get((req, res) => {
            spauth
                .getAuth('https://ananda365.sharepoint.com/sites/dev/', {
                username: 'SHO_developer@ananda.co.th',
                password: 'P@ss-$hodv'
            })
                .then(data => {
                var headers = data.headers;
                headers['Accept'] = 'application/json;odata=verbose';
                request.get({
                    url: 'https://ananda365.sharepoint.com/sites/SmartHandover/_api/web',
                    headers: headers,
                    json: true
                }).then(response => {
                    console.log(response.d.Title);
                    res.status(200).send({
                        message: response
                    });
                });
            });
            // Get all contacts            
        })
            // POST endpoint
            .post((req, res) => {
            // Create new contact         
            res.status(200).send({
                message: 'POST request successfulll!!!!'
            });
        });
        // Contact detail
        app.route('/contact/:contactId')
            // get specific contact
            .get((req, res) => {
            // Get a single contact detail            
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            });
        })
            .put((req, res) => {
            // Update a contact           
            res.status(200).send({
                message: 'PUT request successfulll!!!!'
            });
        })
            .delete((req, res) => {
            // Delete a contact     
            res.status(200).send({
                message: 'DELETE request successfulll!!!!'
            });
        });
    }
}
exports.Routes = Routes;
//# sourceMappingURL=crmRoutes.js.map