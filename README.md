# How to check it out

The app is running on an Amazon EC2 server, and the link is down below:
http://ec2-3-83-153-43.compute-1.amazonaws.com/

# How to build

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Install yarn, and run `yarn install` on the main folder to download all needed libraries

## Development mode

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Production mode

In the project directory, you can run:

### `yarn build:production`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

After build the packages, you can serve the files using Express

### `node server.js`

Runs the app in the production mode.\
The server will be running on port 8080

# Static files

You can find the static files ready to be served, on the build folder.

Run `npm i nws` to install the static file server.

Then go to the build folder and run `nws`

This will launch a server on port 3030 for you to visit in your web browser at [http://localhost:3030](http://localhost:3030).

