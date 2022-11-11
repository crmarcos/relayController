// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { SerialPort } = require('serialport')
const tableify = require('tableify')

// Port variable to store the SerialPort interface
let port;

// Callback to read the port path where to write
// The user must select the correct one
function updatePort() {
  portId = document.getElementById("port-id");
  console.log(portId.value);
  port = new SerialPort({ path: portId.value, baudRate: 9600 });
}

// Function to send data to the port
function sendData(p) {
  console.log("Enviando Toggle port "+ p + " ...");
    
  port.write('4,'+ p +',0,0,0\n', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written')
  })
}

// Function to send personalised command
function enviarComandoPersonalizado() {
  let command = document.getElementById("personalised-command").value;
  console.log(command);

  console.log("Enviando comando personalizado: " + command );
    
  port.write(command + '\n', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written')
  })
}

// Function to get all the ports available in the PC
async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if(err) {
      document.getElementById('error').textContent = err.message
      return
    } else {
      document.getElementById('error').textContent = ''
    }
    console.log('ports', ports);

    if (ports.length === 0) {
      document.getElementById('error').textContent = 'No ports discovered'
    }

    tableHTML = tableify(ports)
    document.getElementById('ports').innerHTML = tableHTML
  })
}

function listPorts() {
  //listSerialPorts();
  //setTimeout(listPorts, 2000);
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
//setTimeout(listPorts, 2000);

listSerialPorts()