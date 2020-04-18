![version](https://badgen.net/badge/version/v0.1.1/orange)  [![Build status](https://ci.appveyor.com/api/projects/status/81q9dibj57crjbq1?svg=true)](https://ci.appveyor.com/project/gam4it/line-firebase)


# line-firebase

line-firebase is a NodeJS + Express App shell which can be used as a start point for web applications or microservices with RESTful API interfaces. 

- [`App shell`](https://developers.google.com/web/fundamentals/architecture/app-shell) design architecture 
- `OAuth 2.0 and OpenID Connect` enabled
- `Firebase database access` enabled
- Focus on your own content pages
- Easy to add secure ([OAuth2.0](https://tools.ietf.org/html/draft-ietf-oauth-access-token-jwt-06)) access token based `RESTFul API` with automatic Swagger API document generation
- Easy to add 3rd-party open-source javascript libraries 

![app shell](./docs/line-fb-app-shell.png | width=100)

## OAuth 2.0 and OpenID Connect
[Google Firebase Admin SDK & Firebase JavaScript SDK](https://firebase.google.com/docs/auth) is used to acheive OAuth 2.0 and OpenID Connect.

- Firebase server private key is required. Create your own Firebase project and then setup `databaseURL` of the Firebase project and `keyFilename` with the file containing the private key. Below is an part of `index.js` where the setup is required.

    ```
    const lineFirebaseOptions = {
    // firebase database url
    databaseURL: "https://line-****.firebaseio.com",
    // firebase Admin SDK private key 
    keyFilename: './environment/firebase-serverkey.json'
    };
    ```

## Firebase database access

If you are going to use the Firebase project you created for `OAuth 2.0 and OpenID Connect` as your backend database, remove `//` from ` lineFirebase.initDBService()` in `index.js`.

```
// init for firebase Database access
//lineFirebase.initDBService();
```

# Where to start


1. Install dependent packages
```
$ npm install
```

2. Run the app
```
$ npm start
==> line-firebase - (v0.1.1) https://localhost:65000
```



# How to add your RESTFul APIs

 1. create a route folder (ex `rt-api-xxx-v1`) under `/routes`
    - ex) `/routes/rt-api-xxx-v1`
 2. add a main route function file under the folder you created at step 1.
    - ex) `/routes/rt-api-xxx-v1/rt-api-xxx-v1.js`
 3. add the main route function to `app.use` with `checkSessionToken.on` middleware in `index.js`
    - ex) 
        ```
        // add your RESTFul APIs here
        //
        let routeApiXXXV1 = require('./routes/rt-api-xxx-v1/rt-api-xxx-v1');
        app.use('/api/xxx/v1', checkSessionToken.on, routeApiXXXV1.router);


        //
        // end of your RESTFul APIs
        ```
 4. define each REST API in the main route function file (ex. `rt-api-xxx-v1.js`) created above. 
    - Instead of implementing all API paths in the single main route function file,
    - create a separate file for each REST API path and import that file into the main route function file.
    - By doing this, each API is fully decoupled with each other.
    - For example, check `/routes/rt-api-xxx-v1/rt-api-xxx-v1.js` file.
        ```
        let getABC = require('./get-abc');
        let postABC = require('./post-abc');
        let putABC = require('./put-abc');
        let deleteABC = require('./delete-abc');
        router.route('/abc')
            .get(getABC.on)
            .post(postABC.on)
            .put(putABC.on)
            .delete(deleteABC.on);
        ```
 5. Add OpenAPI yaml definition to each REST API, then your API specification is automatically updated at `https://localhost:65001/api/docs`
    - For example, check `/routes/rt-api-session-v1/rt-api-session-v1.js`
    ```
    /**
    * @swagger
    * tags:
    *   name: Session
    *   description: Session init for a new client
    */

    router.route('/init/:uuid')
    /**
    * @swagger
    * path:
    *  /session/v1/init/{uuid}:
    *    get:
    *      summary: Init a new session token assigned to {uuid}
    *      tags: [Session]
    *      parameters:
    *      - name: uuid
    *        in: path
    *        description: uuid of client
    *        schema:
    *          type: string
    *      responses:
    *        "200":
    *          description: Session is successfully created
    *          content:
    *            application/json:
    *              schema:
    *                $ref: '#/components/schemas/Response'
    *              example:
    *                code: session.init
    *                message: session is successfully created
    *                payload: {"session_id":"7f3b171b-335c-4739-a123-4ca810db963c","session_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiN2YzYjE3MWItMzM1Yy00NzM5LWExMjMtNGNhODEwZGI5NjNjIiwiY2xpZW50X3V1aWQiOiJiOTZhYjVlNi1mMWU4LTQ2NTMtYWIwOC00ZGQ4MmVhNjU3NzEiLCJpYXQiOjE1ODQxNDg2MzR9.L0SbNuIRb75bnmoxj-eVXOfEjBncUvj2orAQSpq2gfWH6YxdDx_YAxgzPsz3h7vh6fYvx56ZYD7ABpFNIQqytNW_woR614fvgSEhRgBdVwsJYKD1JEeQg-xgfvn5mIuhHux7yVPZVi9XBXUheANlCrmUNE5dCf-UIFFCZK3v5j8PseGyDtBzYQur3PDYFa9mPTyCJFf3kFkL5wa9Mg_fJD1oQoza7Mgg688_q7k3JJWJ0U51NUn0WO9E0wzeJcne2wia2UZeza0D-JGDg_AngjcCL1kAUWZjKEnUDcpHC4rAeicf6kkelmXkRzIOn6ZFb3GWxUtey_uNCl_H7wt40g"}
    *        "400":
    *          description: Invalid request
    *          content:
    *            application/json:
    *              schema:
    *                $ref: '#/components/schemas/Response'
    *              example:
    *                code: session.error
    *                message: invalid uuid
    */
        .get(getInit.on);

    
    router.route('/end/:uuid') 
    /**
    * @swagger
    * path:
    *  /session/v1/end/{uuid}:
    *    get:
    *      summary: End session token assigned to {uuid}
    *      tags: [Session]
    *      parameters:
    *      - name: uuid
    *        in: path
    *        description: uuid of client
    *        schema:
    *          type: string
    *      responses:
    *        "200":
    *          description: Session cleared
    *          content:
    *            application/json:
    *              schema:
    *                $ref: '#/components/schemas/Response'
    *              example:
    *                code: session.end
    *                message: session cleared
    *        "400":
    *          description: Invalid request
    *          content:
    *            application/json:
    *              schema:
    *                $ref: '#/components/schemas/Response'
    *              examples:
    *                invalid uuid:
    *                   code: session.error
    *                   message: invalid uuid
    *                no session linked:
    *                   code: session.error
    *                   message: session does not exist
    */
      .get(getEnd.on);
    ```


6. Add your common components under /models if any. For example, see `/models/response.js`


# How to add your 


