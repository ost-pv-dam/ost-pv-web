# ost-pv-web

## NOTE: This project is WIP

## Quick Start

1. Clone the repo
2. Ensure that you have npm and Node.js installed

```
node -v
npm -v
```

3. `cd backend`
4. Copy `.env.example` into a new file `.env` and add in `OST_PV_DB_URI`. This URI can be found on MongoDB if you go to the cluster and click "Connect". The URI defines what database the web application will connect to. Ensure that you have filled in the username and password correctly along with adding the name of the database after ".net". Ex. `...mongodb.net/dev...`
5. `npm i` to install all of the node modules needed
6. `npm run dev` to start a local web server on port 5050. This port is defined in `.env`
7. You should see `connected to db` and `listening on port 5050` if everything went well. Ensure that your IP address is added to the MongoDB cluster if not, it should have a pop up at the top of the webpage when you open it.
8. To ensure that the API is receiving calls, go to postman.com and send a request:
   1. The endpoint is `http://localhost:5050/api/v1/temp/add` and it is a POST request
   2. Before sending, click on `Body`, then `raw`, then the dropdown to select `JSON`
   3. Enter in a JSON document like so
   ```
   {"temp": SOME_DECIMAL_NUMBER}
   ```
   4. Click send and you should see a positive response.
9. Go to MongoDB, the `dev` database, then the `temps` collection and you should see your new temperature that you send over.
