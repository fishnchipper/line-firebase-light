![version](https://badgen.net/badge/version/v0.1.5/orange)  [![Build status](https://ci.appveyor.com/api/projects/status/81q9dibj57crjbq1?svg=true)](https://ci.appveyor.com/project/gam4it/line-firebase)


# line-firebase

line-firebase is a NodeJS + Express App shell which can be used as a start point for web applications or microservices with RESTful API interfaces. 


## Docker Image

The latest Docker image is downloaded from
- https://hub.docker.com/repository/docker/fishnchipper/line-firebase 

### How to run Docker image

- Pull a Docker image from Docker Hub
```
$ docker pull fishnchipper/line-firebase:version
```
- Run the image by mounting the two Firebase project configuration files below into the image:
  - a Firebase serverkey file for back-end: the filename must be `firebase-serverkey.js`
  ```
  Example>
  {
    "type": "service_account",
    "project_id": "{PROJECT_NAME}",
    "private_key_id": "f35d7e3d3fff3e4a278d031000069c3fedb1d19f",
    "private_key": "-----BEGIN PRIVATE KEY-----\n\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-o2cuu@{PROJECT_NAME}.iam.gserviceaccount.com",
    "client_id": "110090857290000011817",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-o2cuu%40{PROJECT_NAME}.iam.gserviceaccount.com"
  }
  ```
  - a Firebase configuration file for web: the filename must be `firebaseconfig.js`
  ```
  Example>
  const firebaseConfig = {
        apiKey: "AIzaSyAGnmtnEaxle1QPbcJsdfsdfksqDJ9tr93PmY",
        authDomain: "{PROJECT_NAME}.firebaseapp.com",
        databaseURL: "https://{PROJECT_NAME}.firebaseio.com",
        projectId: "{PROJECT_NAME}",
        storageBucket: "{PROJECT_NAME}.appspot.com",
        messagingSenderId: "5682222724683",
        appId: "1:568200004683:web:52f31000062c358a9f0d8e",
        measurementId: "G-T0000N5KBV"
    };
  ```
```
Example>

$ docker run -p 65000:65000 -v /Absolute Path To/firebase-serverkey.json:/src/environment/firebase-serverkey.json:ro -v /Absolute Path To/firebaseconfig.js:/src/views/resources/scripts/firebaseconfig.js:ro fishnchipper/line-firebase:v0.1.1
```

## Features

The features of line-firebase are :

- [`App shell`](https://developers.google.com/web/fundamentals/architecture/app-shell) design architecture 

   ![app shell](./docs/line-fb-app-shell.png)
   ![app shell content](./docs/line-fb-app-shell-content.png)


- `OAuth 2.0` and `OpenID Connect` enabled
- `Firebase database access` enabled
- Independent content pages
- Easy to add secure ([OAuth2.0](https://tools.ietf.org/html/draft-ietf-oauth-access-token-jwt-06)) access token based `RESTful API` with automatic Swagger API document generation
- Easy to add 3rd-party open-source JavaScript libraries



## OAuth 2.0 and OpenID Connect
[Google Firebase Admin SDK & Firebase JavaScript SDK](https://firebase.google.com/docs/auth) is used to acheive OAuth 2.0 and OpenID Connect.

- Firebase server private key is required to enable `OAuth 2.0` and `OpenID Connect`. Create your own Firebase project and then setup `databaseURL` of the Firebase project and `keyFilename` with the file containing the private key. Below is a part of `index.js` where the setup is required.

    ```
    const lineFirebaseOptions = {
    // firebase database url
    databaseURL: "https://line-****.firebaseio.com",
    // firebase Admin SDK private key 
    keyFilename: './environment/firebase-serverkey.json'
    };
    ```

## Firebase database access

If you are going to use the Firebase project you created for `OAuth 2.0` and `OpenID Connect` as your backend database, simply remove `//` from ` lineFirebase.initDBService()` in `index.js`.

```
// init for firebase Database access
//lineFirebase.initDBService();
```

And then create Firebase DBAdapter to add/update/delete documents in backend server-side.

```
let lineFirbase = require('../../line_modules/line-firebase');
let dbAdapter = lineFirbase.createDBAdapter();
```

For example, in `/routes/rt-app/get-app.js` below, `dbAdapter.getDocumentsWithUserUID("applications", user.user_id)` is called to get a list of application linked to `user_id`.

```
let lineFirbase = require('../../line_modules/line-firebase');
let dbAdapter = lineFirbase.createDBAdapter();


function on(req, res, next) {
    console.log("++++ api ++++ {get} /app called");

    let user = req.decodedSession;

    dbAdapter.getDocumentsWithUserUID("applications", user.user_id)
    .then((docs) => {
        res.json({code: 'api.app.get', message:"app list is successfully returned.", payload:docs});
    })
    .catch((e) => {
        res.status(400).json({code: 'api.app.error', message:'app get error'});
    })
}

module.exports.on= on;
```

### Firebase DBAdapter APIs

- `addDocument(__collection, __doc_id, __doc)`
- `getDocuments(__collection)`
- `getDocumentsWithUserUID(__collection, __user_uid)`
- `getDocumentsWithDocID(__collection, __doc_id)`
- `deleteDocument(__collection, __doc_id)`

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



# How to Edit Application Shell

The below open sources are the key toolkit & library used to build line-firebase.

- [Bootstrap 4.x toolkit](https://getbootstrap.com/) : can be easily replaced with your favorate toolkit.
- [JQuery 3.x](https://jquery.com/) : codes written using JQuery can be easily replaced with plain JavaScript for performance-critical applications.

You might want to give a different look & feels to Application Shell. Chage files below for this purpose.
- `/views/main.html` : main page. You might don't need this.
- `/views/no-page.html` : a page redirected when a wrong uri is given.
- `/views/invalid-session.html` : a page redirected when a session is expired.
- `/views/error.html` : a page redirected when an unknown error occurs.
- `/views/auth/sign-in.html` : Sign In page
- `/views/auth/sign-up.html` : Sign Up page
- `/views/service/index.html` : service main page. You might start your main page here.
- `/views/resources/css/main.css` : css file for `/views/main.html`
- `/views/resources/css/service.css` : css file for `/views/service/index.html`
- `/views/resources/scripts/line-firebase.js` : main model script where `window.Line_Firebase` is defined. `window.Line_Firebase` does not contain UI-related control but model-related logics to communicate with route paths in server.
- `/views/resources/scripts/line-service-ui.js` : control script for `/views/service/index.html`
- `/views/resources/scripts/line-signin-ui.js` : control script for `/views/auth/sign-in.html`
- `/views/resources/scripts/line-signup-ui.js` : control script for `/views/auth/sign-up.html`

# How to Add Content 

1. Add a new content page.
 - Copy `/views/template/view-template.html` to `/views/service` folder.
 - Rename the copied `view-template.html` with a meaningful name. For exmaple
    ```
    settings.html
    ```
2. Add a route path for the new content page created at step 1.
 - Add a new route function file for the new content at `/routes/rt-service`. For example,
   ```
   function on(req, res, next) {

        var renderData = {};

        // render & return to client
        res.render('./service/settings', renderData, function(err, html) {
            if(err) {
                res.status(err.status).end();
            }else {
                res.set('Content-Type', 'text/html');
                res.send(html);
            }
        });
    }

    module.exports.on= on;
   ```
 - Add a route path of the route function for the new content page at `/routes/rt-service/rt-service.js`. For example, 
    ```
    let getSettings = require('./get-settings');
    ...
    /**
     * /service/settings 
     */
    router.route('/settings')
          .get(getSettings.on);
    ```

3. Add a control and event handler for the content page.
 - For example, for `Settings` menu
    - `dropdown-item` DOM element is added in `/views/service/index.html`
    ```
    <a class="dropdown-item" id="line-settings-btn" href="#">Settings</a>
    ```
    - an event handler for `id="line-settings-btn"` is added to `/views/resources/scripts/line-service-ui.js`
    ```
    eHandler.clickSettingsBtn = function() {
        $('#line-settings-btn').click((e)=>{
            e.preventDefault();
            Line_Firebase.view().getBlock("/service/settings")
            .then((block)=> {
                $('#content-main').html(block);
            })
            .catch((error)=> {
                console.log("--- error: ", error);
            })
        });
    }
    ```
    The route path added for the new content is passed to the parameter of `Line_Firebase.view().getBlock()`. In this Settings example, `/service/settings` is the route path.



# User-defined RESTful APIs

## URI of RESTful API

The URI of user-defined RESTful APIs is : 
- `https://localhost:65000/api` + route path for an API

For example, the URI of an API with `path1/v1/abc` path will be
-  `https://localhost:65000/api/path1/v1/abc`


## Access Token for RESTful APIs

### Users

`https://localhost:65000/api` is accessible for a user who gets a session cookie after a successful authentication through `Sign In` on web interface. Users do not need a separate access token to access RESTful APIs.

### Applications

Applications registered are able to access `https://localhost:65000/api` using an (1-hour lifetime) access token issued when the application is successfuly authenticated by an `application profile` issued during the registration.

Follow the steps below to register an application and download an application profile which plays the credential of the application during the authentication process.

- Register an application at `Settings > Applications`
- Downlaod and keep an `application profile` issued after a successful application registration as line-firebase server does not keep the private key of the `application profile`. If the `application profile` is lost, delete the registered application and register the same application again to issue a new `application profile`.

  ![app shell content](./docs/line-fb-app-add.png) 

## How to add your RESTful APIs

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


## How to Authenticate an Application

An application calls `https://localhost:65000/auth/app` with its application profile issued at `Settings > Applications` when the application is registered.

```
$ curl -k -H "Content-Type: application/json" https://localhost:65000/auth/app -X PUT -d '{ "app_id": "helloooo-8df0ca92-dfb9-42f5-b525-5a9d8e2a0a42", "private_key": "-----BEGIN ENCRYPTED PRIVATE KEY-----\n ... \n-----END ENCRYPTED PRIVATE KEY-----\n"}'
```

Once the application gets successfully authenticated, an access token is returned in the below format.

```
{"code":"auth.app","message":"authentication successful.","payload":ACCESS_TOKEN}
```

The 1-hour lifetime access token (`ACCESS_TOKEN`) need to be added to HTTP header `Authorization:Bearer ACCESS_TOKEN` whenever RESTful API is called. For example, 

```
curl -k -H 'Content-Type: application/json' -H 'Authorization:Bearer ACCESS_TOKEN'  -X 'GET' https://localhost:65000/api/xxx/v1
```