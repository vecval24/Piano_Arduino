console.log("sketch");

let serial; // variable to hold an instance of the serialport library
let portName = "/dev/tty.usbmodem11201"; // fill in your serial port name here

let width = window.innerWidth;
let height = window.innerHeight;

let notes = ["G5","F5","E5","D5","C5","B4","A4","G4","F4","E4","D4","C4"]; // notes de musique
let notePositions = [165, 180, 193, 205, 220, 235, 248, 265, 277, 290, 305, 320]; // Y de chaque note sur l’interface
let touchIndex;
let touchStates = new Array(notePositions.length).fill(false);
let circles = []; // tableau pour stocker toutes les touches pressées

//sons
let oscillators = [];
let frequencies = [783.99, 698.46, 659.25, 587.33, 523.25, 493.88, 440.00, 392.00, 349.23, 329.63, 293.66, 261.63];
let playButtonX;
let playButtonY;
let buttonSize = 60;
let audioStarted = false;
let isPlaying = false;

// Variables globales pour le bloc de musique
let blockX;
let blockWidth;
let nextX;
let xStep = 50;

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

  for(let i = 0; i < frequencies.length; i++){
    let osc = new p5.Oscillator();
    osc.setType('triangle'); // son plus "instrumental"
    osc.freq(frequencies[i]);
    osc.amp(0);
    osc.start();
    oscillators.push(osc);
  }
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
  let data = serial.readLine();
    if (data && data.length > 0) {
        let parts = data.trim().split(",");
        if (parts.length === 2) {
            let touchIndex = parseInt(parts[0]);
            let state = parseInt(parts[1]);

            if(touchIndex >= 0 && touchIndex < oscillators.length){

                // 🎵 GESTION DU SON
                if(state === 1){
                    oscillators[touchIndex].amp(0.5, 0.05); // fade in
                } else {
                    oscillators[touchIndex].amp(0, 0.1); // fade out
                }

                // 🎨 GESTION DES RONDS
                if(state === 1){
                    if(nextX + 12.5 <= blockX + blockWidth){
                        circles.push({
                            x: nextX,
                            y: notePositions[touchIndex],
                            color: [0,0,0],
                            index: touchIndex
                        });

                        nextX += xStep;
                    }
                }
            }
        }
    }
    // let data = serial.readLine();
    // if (data && data.length > 0) {
    //     let parts = data.trim().split(",");
    //     if (parts.length === 2) {
    //         let touchIndex = parseInt(parts[0]);
    //         let state = parseInt(parts[1]);

    //         if(touchIndex >= 0 && touchIndex < notePositions.length){
    //             if(state === 1){ // touche pressée
    //                 // Vérifier que nextX ne dépasse pas la limite du bloc
    //                 if(nextX + 12.5 <= blockX + blockWidth){ // 12.5 est le rayon du cercle (25/2)
    //                     circles.push({
    //                         x: nextX,
    //                         y: notePositions[touchIndex],
    //                         color: [0,0,0],
    //                         index: touchIndex
    //                     });
    //                     console.log("Added circle for touch index:", touchIndex, "at position Y:", notePositions[touchIndex]);
    //                     nextX += xStep;
    //                 }
    //             }
    //         }
    //     }
    // }
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

function mousePressed() {
let d = dist(mouseX, mouseY, playButtonX, playButtonY);

  if (d < buttonSize / 2) {

    // Démarrer AudioContext si nécessaire
    userStartAudio();

    // Inverser l’état
    isPlaying = !isPlaying;

    console.log("isPlaying:", isPlaying);

    // Si on met en pause → couper tous les sons
    if (!isPlaying) {
      for (let i = 0; i < oscillators.length; i++) {
        oscillators[i].amp(0, 0.1);
      }
    }
  }
}

function draw() {
  background(255);

  let topPadding = 30;
  
  textAlign(CENTER);
  textSize(48);
  fill(0);
  text("Piano", width / 2, topPadding + 50);

  let titlePadding = 100;
  
  blockWidth = width * 0.8;
  blockX = (width - blockWidth) / 2;
  let blockStartY = 50 + titlePadding;
  let blockHeight = height * 0.4;
  
  // Initialiser nextX au début du bloc au premier appel
  if(nextX === undefined) {
    nextX = blockX;
  }
  
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

  // 6e ligne grise
  stroke(200);
  strokeWeight(1.5);
  let y6 = blockStartY + lineSpacing * 6;
  line(blockX, y6, blockX + blockWidth, y6);

  
  
  // Boutons sous le bloc
  let buttonSize = 60;
  let buttonSpacing = 40;
  let buttonsStartY = blockStartY + blockHeight + 40;
  let totalButtonsWidth = (buttonSize * 2) + buttonSpacing;
  let buttonsStartX = (width - totalButtonsWidth) / 2;
  
  // Bouton Play (rond avec triangle)
  // fill(0);
  // stroke(0);
  // strokeWeight(2);
  // circle(buttonsStartX + buttonSize / 2, buttonsStartY + buttonSize / 2, buttonSize);
  
  // Triangle pour Play (pointe à droite)
  // fill(255);
  // triangle(
  //   buttonsStartX + buttonSize / 2 - 9, buttonsStartY + buttonSize / 2 - 12,
  //   buttonsStartX + buttonSize / 2 - 9, buttonsStartY + buttonSize / 2 + 12,
  //   buttonsStartX + buttonSize / 2 + 12, buttonsStartY + buttonSize / 2
  // );

  playButtonX = buttonsStartX + buttonSize / 2;
playButtonY = buttonsStartY + buttonSize / 2;

fill(0);
stroke(0);
strokeWeight(2);
circle(playButtonX, playButtonY, buttonSize);

// Couleur bouton
fill(0);
stroke(0);
strokeWeight(2);
circle(playButtonX, playButtonY, buttonSize);

// Symbole dynamique
fill(255);
noStroke();

if (!isPlaying) {
  // ▶ TRIANGLE (Play)
  triangle(
    playButtonX - 9, playButtonY - 12,
    playButtonX - 9, playButtonY + 12,
    playButtonX + 12, playButtonY
  );
} else {
  // ❚❚ PAUSE (2 barres)
  rect(playButtonX - 8, playButtonY - 12, 6, 24);
  rect(playButtonX + 2, playButtonY - 12, 6, 24);
}
  
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


