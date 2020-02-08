# << this is uncompleted codes...

# Line


NodeJS + Express App shell


# How to duplicate this repository for your project
- see https://help.github.com/en/articles/duplicating-a-repository



# Where to start

1. Change app name and service port. 

- /index.js
  - change APPNAME & PORT constants
```
let app = express()
const APPNAME = "line"
const PORT = 30999
const VERSION = '0.1.0'
```

- /views/resources/scripts/environment.js
  - change the port with the same port in `const PORT = 30999` above.
```
const line = {
      url: 'https://localhost:30999'
};
```

- /views/main.html
  - change the value of `class="cover-heading"` div with your app name
```
          <main role="main" class="inner cover">
            <div class="cover-heading" style="font-size:10em">line</div>
```

- /views/sign-in.html
  - change the value of `class="card-container" h1` with your app name
```
  <body class="text-center">
        <div class="card-container">
            <h1>line</h1>
```

2. Install dependent packages
```
$ npm install
```

3. Run the app
```
$ node index.js
==> line - (v0.1.0) listening on port 30999!
```

4. Open a webbrowser and connect https://localhost:30999




# What line does for you


