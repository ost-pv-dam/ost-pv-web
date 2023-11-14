# backend

Node server code for ost-pv-web, managing the API hosted at `https://api.umich-ost-pv-dam.org`

## Quick Start

Before doing anything, please ensure that you have copied `.env.example` into a new file `.env`. Then, fill out the environment variables to the values given to you (reach out to a repository owner or superior if you don't know these values).

1. `npm i` to install the node packages.
2. `npm run dev` to run the server locally. You should then see messages similar to this:

   ```bash
   > backend@1.0.0 dev
   > nodemon index.js

   [nodemon] 3.0.1
   [nodemon] to restart at any time, enter `rs`
   [nodemon] watching path(s): *.*
   [nodemon] watching extensions: js,mjs,cjs,json
   [nodemon] starting `node index.js`
   connected to db
   listening on port 5050
   ```

   If you see something drastically different that resembles an error, there was most likely an issue connecting to the database. Go to the [MongoDB Atlas cluster](https://cloud.mongodb.com/v2/6508932b44ea275439e78724#/security/network/accessList) set up for this project and ensure that your current IP address is added under `Network Access`.

3. Once you see `listening on port 5050`, you can now send API requests to `http://localhost:5050`! This is necessary for local testing. You can ensure that everything is working by sending this `GET` request through a tool such as Postman: `http://localhost:5050/api/v1/sensorCellData`. Also make sure that you have added the correct API key as a header value under the key `x-api-key`. This request should return all of the data correlated to the most recent transmission from the device.

## Structure

The backend is built using [Mongoose](https://mongoosejs.com/docs/) and [Express](https://expressjs.com/) for easy API endpoint setup and management. It is encouraged to both read through the documentation for these libraries as well as look at the comments added in the code for this repository.

- `index.js`
  - The server starts at this file, connects to MongoDB through Mongoose, and starts listening for API requests.
- `server.js`
  - This file is used by `index.js` to define what endpoints are valid and where the requests should be routed.
- `models/`

  - For each collection (table) in MongoDB, there is a respective model in this folder. This is the easiest way to work with Mongoose.
  - Let's look at `userModel.js`:

    ```js
    import mongoose from 'mongoose'

    // Holds information about allowed users of the web app
    const UserSchema = new mongoose.Schema({
      // Name of the field
      email: {
        // What type the field should be
        type: String,

        // Optional additional parameters, such as whether
        // it's required or if each entry should be unique.
        // Look through Mongoose documentation for more
        // information about options.
        required: true,
        unique: true
      }
    })

    // Create the model off of the schema, with the third
    // parameter being the name of the collection 'users'
    const User = mongoose.model('User', UserSchema, 'users')

    export default User
    ```

- `controllers/`

  - There are various controller files in this folder that define the various operations that the API should be able to perform on collections.
  - Let's look at `UserController.js`:

    ```js
    // Be sure to import the model/s you are working with
    import User from '../models/userModel.js'

    class UserController {
      // Only one operation we want the API to be able to do,
      // get all user emails

      // Req is what's sent in, res is what's returned
      getUsers = async (req, res) => {
        try {
          // User.find() is a Mongoose function that will return
          // all documents in a collection. Look through
          // Mongoose documentation for more information.
          const users = await User.find()

          const emails = users.map((user) => user.email)

          // Return from the function with a status and json
          // containing the information requested
          res.status(200).json(emails)
        } catch (err) {
          console.error(err)
          res.status(500).json({ message: 'Internal Server Error' })
        }
      }
    }

    export default UserController
    ```

  - All of the other controllers are more built-out as they have functionality more core to the goal of the project.

- `api/`

  - All of the work done in `controllers/` define what should happen when a user sends a particular API request, but we have yet to actually link what API URLs correspond to a function in a controller.
  - This folder contains the routes that do that work for us, leveraging Express.
  - Let's look at `userRoutes.js`

    ```js
    import express from 'express'
    // Import needed controller
    import UserController from '../controllers/UserController.js'
    import { authenticateAPIKey } from '../middleware/auth.js'

    // Create the router using express
    const router = express.Router()
    // Create the controller as we need to make function calls on it
    const controller = new UserController()

    // GET: /api/v1/users
    // Define what the endpoint URL should be, any middleware (see below),
    // and what function should be called at that endpoint
    router.get('/', authenticateAPIKey, controller.getUsers)

    export default router
    ```

  - `authenticateAPIKey` is an example of middleware, as it gets executed and verified before making any call to the actual DB (in this case, getting the users' emails). Check out `auth.js` in case you are interested in what this function is doing.
  - One potential confusiion is that this code is specifying the endpoint at `/`, but the comments say that it should be called at `/api/v1/users`. This is because this router gets exported to the `server.js` file to be fully set up. Looking at that file, we see:

    ```js
    // Import the routes needed
    import userRoutes from './api/userRoutes.js'
    .
    .
    .
    // Fully set up all of the routers, all with the prefix
    // `/api/v1/users`
    app.use('/api/v1/users', userRoutes)
    ```

While the other models, controllers, and routes are more complicated than `User`, this is the foundation of how all of them are built.

## Deploying

This server is hosted on an AWS EC2. If you have made changes to the functionality and would like to deploy it to production, follow these steps:

1. Push your new backend code to GitHub.
2. `ssh` into the EC2. You will need to get a key from an AWS admin for this project.
3. Once connected, run `tmux list-sessions` to see all of the terminal sessions running. Typically, this should just be one session `0`.
4. `tmux attach -t {session_name}` to start working in the session specified.
5. You should see a message in the terminal saying `listening on port 5050` if the server is still running.
6. `ctrl-c` to stop `index.js` from running.
7. `git fetch` and `git pull` to get the updated backend code you pushed.
8. `npm start` to run `index.js` and start listening for requests. You should see the `connected` and `listening` messages.
9. `ctrl-b + d` to keep the file running while exiting the session.

Your updated code should now be running at `https://api.umich-ost-pv-dam.org`!
