# frontend

React web app for `ost-pv-web`, designed with modularity in mind

## About

This frontend is built using the popular [React](https://legacy.reactjs.org/), [Ant Design](https://ant.design/), and [Recharts](https://recharts.org/en-US/) libraries. It is highly recommended to become familiar with these libraries if you plan to make changes to the frontend.

## Quick Start

Before doing anything, please ensure that you have copied `.env.example` into a new file `.env`. Then, fill out the environment variables to the values given to you (reach out to a repository owner or superior if you don't know these values).

1. `npm i` to install the necessary packages.
2. `npm start` to start the web app at `localhost:3000`. This command should automatically open your browser.

(**Note**: if you have your `.env` set up to get frontend data from a locally hosted backend, make sure that you also start your backend node server in a different terminal window. See `backend` folder for details.)

## Structure

This web app follows the popular React design of abstracting away components as much as possible while running everything through `api.js`. Please go to `components/` and in particular `dashboard.js` (which is the home page) to see this in action.

## Making Modifications

Much of the frontend code relies on `useState` in React, Ant Design components (in particular, `<Row>` and `<Col>`), and Recharts. Please be sure to read through those pieces of documentation and the comments made in this repository's code if you want to modify or add onto the existing interface.

## Deploying

This repository is deployed and hosted using AWS Amplify. This tool will automatically deploy any frontend code that is pushed to the GitHub. While this is an extremely nice feature, please be careful as to test every change made locally before pushing to GitHub. Once deployed, navigate to https://umich-ost-pv-dam.org to view your changes.
