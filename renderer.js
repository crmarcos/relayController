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

  port.on('open', function () {
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
function sendPersonalisedCommand() {
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

// Constants
const N_TRANSITIONS = 160;
const N_RELAYS = 8;

// Generate the Header Labels
const headerString = ['Relé', 'Estado Inicial'];
for (let i = 1; i <= N_TRANSITIONS; i++) {
  headerString.push('' + i);
}

function generateTable() {
  // creates a <table> element and a <tbody> element
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");

  // Populates the Header of the Table
  const headerRow = document.createElement("tr");
  headerString.forEach(string => {
    const tbHeader = document.createElement("th");
    const cellTextHeader = document.createTextNode(string);
    tbHeader.appendChild(cellTextHeader);
    headerRow.appendChild(tbHeader);
  });
  tbl.appendChild(headerRow);


  // creating all cells
  for (let i = 1; i <= N_RELAYS; i++) {
    // creates a table row
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    const cellText = document.createTextNode(i);
    cell.appendChild(cellText);
    row.appendChild(cell);

    for (let j = 0; j < N_TRANSITIONS + 1; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      const cell = document.createElement("td");
      const cellText = document.createElement("input");
      cellText.setAttribute("type", "text");
      cellText.setAttribute("value", "");
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  document.getElementById("table-container").appendChild(tbl);
  // sets the border attribute of tbl to '2'
  tbl.setAttribute("border", "2");
}


function generateMatrix() {
  let matrix = [];
  for (let i = 0; i < N_RELAYS; i++) {
    let row = [];
    for (let j = 0; j < N_TRANSITIONS + 1; j++) {
      row[j] = '( ' + i + ' , ' + j + ' )';
    }
    matrix.push(row);
  }

  return matrix;
}

// Initialize Matrix
let matrix = [];
for(let i=0;i<N_RELAYS;i++){
  let row = new Array(N_TRANSITIONS+1);
  matrix.push(row);
}

// Requires File system operations
const fs = require('fs');
let filePath = '';

// Open File Handler
const fileInput = document.getElementById('sequence-file');
fileInput.onchange = () => {
  filePath = fileInput.files[0].name;
  console.log("Abriendo archivo: " + filePath);

  // Use fs.readFile() method to read the file
  fs.readFile(filePath, 'utf8', function (err, data) {

    // Load the matrix according to the data stored in the file
    matrix = JSON.parse(data);

    console.log(matrix);

    fullFillTable(matrix);
  });

}


/**
 * Fills the table with a matrix passed as parameter.
 * The Table must exist beforehand
 * @param {*} matrix 
 */
function fullFillTable(matrix) {

  // Get the table body
  const tableBody = document.getElementsByTagName("tbody")[0];
  // Get the rows
  const rows = tableBody.getElementsByTagName("tr");
  // Get all cells with Inputs and Write something there
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const cells = rows[rowIndex].getElementsByTagName("td");
    for (let cellIndex = 1; cellIndex < cells.length; cellIndex++) {
      const cellText = cells[cellIndex].childNodes[0];
      cellText.value = matrix[rowIndex][cellIndex-1];
    }
  }
}

function saveTable() {

  // Get the table body
  const tableBody = document.getElementsByTagName("tbody")[0];
  // Get the rows
  const rows = tableBody.getElementsByTagName("tr");
  // Get all cells with Inputs and Write something there
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const cells = rows[rowIndex].getElementsByTagName("td");
    for (let cellIndex = 1; cellIndex < cells.length; cellIndex++) {
      const cellText = cells[cellIndex].childNodes[0];
      matrix[rowIndex][cellIndex-1] = cellText.value;
    }
  }

  saveMatrixToFile();
}


function saveMatrixToFile() {
  // Genrate JSON string from matrix
  const matrixJson = JSON.stringify(matrix);

  console.log(filePath)

  if(filePath != ''){
    // Write to file
    fs.writeFile(filePath, matrixJson, err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  } else {
    console.log("No se seleccionó ningún archivo");
  }


}


const { dialog } = require('electron');
function download() {

const savePath = dialog.showSaveDialog(null);
console.log(savePath)
}

generateTable();
