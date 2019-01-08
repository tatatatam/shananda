import { Request, Response } from "express";
import * as spauth from 'node-sp-auth';
import * as request from 'request-promise';
import * as dotenv from "dotenv";
import * as constants from 'constants';
dotenv.config()

export const login = (req: Request, res: Response) => {
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
      console.log( data );
      res.status(200).json({ data: "Authorized" })

    }).catch(err => {
      console.log(err);
      res.status(401).json({ data: "Cant login" });
    })
};
