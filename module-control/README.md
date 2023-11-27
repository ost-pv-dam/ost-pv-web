# module-control

This folder contains the simple TCP server that is used for manuel user polling through the "Poll Now" button on the website.

## General process

The following steps demonstrate what the process is for communicating to the microcontroller that the user has requested a poll:

1. User clicks "Poll Now" button
2. Backend checks if the system is currently creating a transmission
3. If not, the backend will connect to the TCP server running and send a message requesting a poll
4. TCP server will receive messgae and communicate to the microcontroller (also acting as a TCP client) to poll immediately
5. Microcontroller creates a transmission
6. Website will automatically update for the user

## `server.py`

This file is running alongside the backend Express API (see `/backend`) on the AWS EC2. It is listening for any connections and/or messages, whether that be from the microcontroller or the web server.

## `tcp-client.py`

This file is an example of what a client would look like. The code is emulated in the `pollNow` function in `backend/controllers/SensorCellDataController.js`.
