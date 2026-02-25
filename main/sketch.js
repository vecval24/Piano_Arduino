console.log("sketch");

let serial; // variable to hold an instance of the serialport library
let portName = "/dev/tty.usbmodem11201"; // fill in your serial port name here

let width = window.innerWidth;
let height = window.innerHeight;

let notes = ["E4","D4","F4","G4","A4","B4","C4","D4","E5","D5","F5","G5"]; // notes de musique
let notePositions = [100, 150, 120, 180, 130, 170, 180, 200, 220, 240, 260, 280]; // Y de chaque note sur l’interface
let touchIndex;
let touchStates = new Array(notePositions.length).fill(false);
let circles = []; // tableau pour stocker toutes les touches pressées
let nextX = 50; // position horizontale du premier cercle
let xStep = 50; // distance entre chaque cercle

function setup() {
  console.log("Setup sketch");
  createCanvas(width, height);

  // serial
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on("list", printList); // set a callback function for the serialport list event
  serial.on("connected", serverConnected); // callback for connecting to the server
  serial.on("open", portOpen); // callback for the port opening
  serial.on("data", serialEvent); // callback for when new data arrives
  serial.on("error", serialError); // callback for errors
  serial.on("close", portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (let i = 0; i < portList.length; i++) {
    console.log(i + ": " + portList[i]);
  }
}

function serverConnected() {
  console.log("connected to server.");
}

function portOpen() {
  console.log("the serial port is opened.");
}

function serialEvent() {
// let data = serial.readLine(); //lire la ligne de données envoyée par l'Arduino
// if (data) { let parts = data.split(","); // séparer les données en fonction de la virgule 
//   let touchIndex = int(parts[0]); // index de la touche (0-11)
//   let state = int(parts[1]);  // état de la touche (1 ou 0)
//   console.log("Touche", touchIndex, "Etat:", state);
// }
// let data = serial.readLine();
// console.log("Touch index received:", touchIndex);
//     if (data && data.length > 0) {
//         let parts = data.trim().split(",");
//         if (parts.length === 2) {
//             touchIndex = parseInt(parts[0]);
//             let state = parseInt(parts[1]);
//             if(state === 1){ // touche pressée
//                 drawCircle(touchIndex);
//                 // jouer le son ici plus tard
//             }
//         }
//     }

    let data = serial.readLine();
    if (data && data.length > 0) {
        let parts = data.trim().split(",");
        if (parts.length === 2) {
            let touchIndex = parseInt(parts[0]);
            let state = parseInt(parts[1]);

            if(touchIndex >= 0 && touchIndex < notePositions.length){
                if(state === 1){ // touche pressée
                    circles.push({
                        x: nextX,                      // utilise la position courante
                        y: notePositions[touchIndex],
                        color: [50,205,200],              // couleur
                        index: touchIndex
                    });
                    console.log("Added circle for touch index:", touchIndex, "at position Y:", notePositions[touchIndex]);
                    nextX += xStep; // préparer la prochaine note à droite
                }
            }
        }
    }
}


function serialError(err) {
  console.log("Something went wrong with the serial port. " + err);
}

function portClose() {
  console.log("The serial port is closed.");
}

function drawCircle(index){
    if(index < 0 || index >= notePositions.length){
        console.warn("Index hors limites :", index);
        return; // ne fait rien
    }
    let y = notePositions[index];
    let x = 200;
    fill(0,255,0);
    noStroke();
    ellipse(x, y, 30);
    console.log("Drew circle at index:", index, "Position Y:", y);
}

function draw() {
  background(255);

  // Padding au-dessus du titre
  let topPadding = 30;
  
  // Titre centré en haut
  textAlign(CENTER);
  textSize(48);
  fill(0);
  text("Piano", width / 2, topPadding + 50);

  // Padding sous le titre
  let titlePadding = 100;
  
  // Bloc de 80% de la largeur
  let blockWidth = width * 0.8;
  let blockX = (width - blockWidth) / 2;
  let blockStartY = 50 + titlePadding;
  let blockHeight = height * 0.4;
  
  // Dessiner le bloc (optionnel, juste les bordures)
  noStroke();
  noFill();
  rect(blockX, 0, blockWidth, blockHeight);
  
  // Créer 5 lignes noires horizontales
  stroke(0);
  strokeWeight(2);
  let lineSpacing = blockHeight / 6; // diviser l'espace en 6 parties pour 5 lignes
  
  for (let i = 1; i < 6; i++) {
    let y = blockStartY + lineSpacing * i;
    line(blockX, y, blockX + blockWidth, y);
  }
  
  // Boutons sous le bloc
  let buttonSize = 60;
  let buttonSpacing = 40;
  let buttonsStartY = blockStartY + blockHeight + 40;
  let totalButtonsWidth = (buttonSize * 2) + buttonSpacing;
  let buttonsStartX = (width - totalButtonsWidth) / 2;
  
  // Bouton Play (rond avec triangle)
  fill(0);
  stroke(0);
  strokeWeight(2);
  circle(buttonsStartX + buttonSize / 2, buttonsStartY + buttonSize / 2, buttonSize);
  
  // Triangle pour Play (pointe à droite)
  fill(255);
  triangle(
    buttonsStartX + buttonSize / 2 - 9, buttonsStartY + buttonSize / 2 - 12,
    buttonsStartX + buttonSize / 2 - 9, buttonsStartY + buttonSize / 2 + 12,
    buttonsStartX + buttonSize / 2 + 12, buttonsStartY + buttonSize / 2
  );
  
  // Bouton Terminer (rond avec carré)
  fill(0);
  stroke(0);
  strokeWeight(2);
  circle(buttonsStartX + buttonSize + buttonSpacing + buttonSize / 2, buttonsStartY + buttonSize / 2, buttonSize);
  
  // Carré pour Terminer
  fill(255);
  let squareSize = 18;
  rect(
    buttonsStartX + buttonSize + buttonSpacing + buttonSize / 2 - squareSize / 2,
    buttonsStartY + buttonSize / 2 - squareSize / 2,
    squareSize,
    squareSize
  );

    for(let i = 0; i < circles.length; i++){
        fill(circles[i].color);
        noStroke();
        ellipse(circles[i].x, circles[i].y, 25);
    }
}


