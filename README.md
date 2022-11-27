# relayController
An Electron app used to control the Relay Controller Box.
It use serialport to communicate with the box.

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/crmarcos/relayController.git
# Go into the repository
cd relayController
# Install dependencies
npm install
# Run the app (1st Option)
npm start 
# Run the app (2nd Option)
npm start --scripts-prepend-node-path
```
## To Generate EXE file (NOT VERIFIED)

To generate a ".exe" file run the following command:

``bash
# Run the make commands
npm make 

```