// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { SerialPort } = require('serialport')
const tableify = require('tableify')

// Port variable to store the SerialPort interface
let port;

// Callback to read the port path where to write
// The user must select the correct one
function connectToPort() {

  let x = document.getElementById("port-options");
  let portId = x.options[x.selectedIndex].text;
  console.log('PPP:' + portId)

  port = new SerialPort({ path: portId, baudRate: 9600 }, function (err) {
    if (err) {
      document.getElementById('port-status').textContent = portId + " / " + err.message;
      document.getElementById("port-container").classList.add("port-container-not-connected")
      document.getElementById("port-container").classList.remove("port-container-connected")
      return console.log('Error: ', err.message)
    }
  });

  port.on('open', function() {
    // open logic
    console.log("conectado")
    document.getElementById("port-container").classList.remove("port-container-not-connected")
    document.getElementById("port-container").classList.add("port-container-connected")
    document.getElementById('port-status').textContent = "Conectado a " + portId;
  });

}

// Function to send data to the port
function sendData(p) {
  console.log("Enviando Toggle port " + p + " ...");

  port.write('4,' + p + ',0,0,0\n', function (err) {
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

  console.log("Enviando comando personalizado: " + command);

  port.write(command + '\n', function (err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written')
  })
}

// Function to get all the ports available in the PC
async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if (err) {
      document.getElementById('port-status').textContent = err.message
      return
    } else {
      document.getElementById('port-status').textContent = ''
    }

    // Clear the Select options            
    var x = document.getElementById("port-options");
    if (x.length > 0) {
      x.remove(x.length - 1);
    }

    // Load the options in Select 
    for (i = ports.length - 1; i >= 0; i--) {
      var x = document.getElementById("port-options");
      var option = document.createElement("option");
      option.text = ports[i].path;
      x.add(option, x[0]);
    }

    // Update the Connection message
    if (ports.length === 0) {
      document.getElementById('port-status').textContent = 'No se descubrieron puertos';
    } else {
      document.getElementById('port-status').textContent = ports.length + ' Puertos detectados (Seleccionar uno)';
    }

  })
}

function listPorts() {
  //listSerialPorts();
  //setTimeout(listPorts, 2000);
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
//setTimeout(listPorts, 2000);

//listSerialPorts()