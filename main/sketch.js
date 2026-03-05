console.log("sketch");

let serial; // objet JavaScript communication sketch p5.js avec un port USB série
let portName = "/dev/tty.usbmodem11201"; // fill in your serial port name here

let width = window.innerWidth;
let height = window.innerHeight;

// notes de musique 
let notes = ["G5","F5","E5","D5","C5","B4","A4","G4","F4","E4","D4","C4"]; 
let notePositions = [169, 192, 217, 238, 261, 283, 307, 329, 352, 374, 397, 420]; // Y de chaque note sur l’interface
let touchIndex;
let touchStates = new Array(notePositions.length).fill(false);
let circles = []; // tableau pour stocker toutes les touches pressées
let circleDiameter = 40; // diamètre des cercles affichés 

// gestion bouton listen 
let showListenButton = false;
let listenButtonX;
let listenButtonY;
let listenButtonSize = 60;
let playingSequence = false; // interdit multiple déclenchements de la séquence

// bouton start
let startButtonX;
let startButtonY;
let startButtonW;
let startButtonH;
let startLabel = "start";

// bouton terminer et positions 
let terminatorX;
let terminatorY;

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

  //création des 12 oscillateurs pour chaque note
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
  // Si on n'est pas en mode lecture
  if (!isPlaying) {
    for (let i = 0; i < oscillators.length; i++) {
      oscillators[i].amp(0); // arrêt immédiat
    }
    return;
  }

  let data = serial.readLine();
    if (data && data.length > 0) {
        let parts = data.trim().split(",");
        if (parts.length === 2) {
            let touchIndex = parseInt(parts[0]);
            let state = parseInt(parts[1]);

            //Vérifie sur l'index existe
            if(touchIndex >= 0 && touchIndex < oscillators.length){

                // Si état 1 et pas première note silencieuse
                if(state === 1){
                    if(touchIndex !== 0) { // première note est un silence
                        oscillators[touchIndex].amp(0.5, 0.05); // fade in
                    }
                } else {
                    if(touchIndex !== 0) {
                        oscillators[touchIndex].amp(0, 0.1); // fade out
                    }
                }

                // ajouter une note sur la partition
                if(state === 1){
                    let radius = circleDiameter / 2;
                    if(nextX + radius <= blockX + blockWidth){
                        circles.push({
                            x: nextX,
                            y: notePositions[touchIndex],
                            color: [0,0,0],
                            index: touchIndex,
                            isRest: touchIndex === 0
                        });

                        nextX += xStep; //décale la position X pour la prochaine note

                        // si on vient de dépasser la fin du bloc => arrêt 
                        if(nextX + radius > blockX + blockWidth){
                            isPlaying = false;
                            showListenButton = true;
                            for (let i = 0; i < oscillators.length; i++) {
                                oscillators[i].amp(0); // arrêt immédiat
                            }
                        }
                    }
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

function mousePressed() {

  // si on affiche le bouton unique "listen", gérer indépendemment
  if (showListenButton) {
    // bouton listen (désactivé pendant lecture)
    let rectW = listenButtonSize;
    let rectH = buttonSize;
    // listenButtonX représente déjà le centre du bouton
    if (!playingSequence && mouseX >= listenButtonX - rectW/2 && mouseX <= listenButtonX + rectW/2 &&
        mouseY >= listenButtonY - rectH/2 && mouseY <= listenButtonY + rectH/2) {
      playSequence();
      console.log("Listen button pressed, playing sequence");
      return;
    }
    // bouton start
    if (mouseX >= startButtonX - startButtonW/2 && mouseX <= startButtonX + startButtonW/2 &&
        mouseY >= startButtonY - startButtonH/2 && mouseY <= startButtonY + startButtonH/2) {
      console.log("Start button pressed");
      window.location.reload();
      return;
    }
    return; // ne pas traiter les autres boutons
  }

  // premier vérifier le bouton Play/Pause
  let d = dist(mouseX, mouseY, playButtonX, playButtonY);

  if (d < buttonSize / 2) {

    // Démarrer AudioContext si nécessaire
    userStartAudio();

    // Inverser l’état
    isPlaying = !isPlaying;
    showListenButton = false; // on quitte le mode "fin" si on relance manuellement

    // Si on met en pause → couper tous les sons immédiatement
    if (!isPlaying) {
      for (let i = 0; i < oscillators.length; i++) {
        oscillators[i].amp(0); // arrêt immédiat pour éviter tout son résiduel
      }
    }

    console.log("isPlaying:", isPlaying);
    return; // éviter de déclencher terminator dans le même clic
  }

  // ensuite vérifier Terminer
  let d2 = dist(mouseX, mouseY, terminatorX, terminatorY);
  if (d2 < buttonSize / 2) {
    // simuler fin de ligne
    isPlaying = false;
    showListenButton = true;
    for (let i = 0; i < oscillators.length; i++) {
      oscillators[i].amp(0);
    }
    console.log("Terminer button pressed, switching to listen/start mode");
  }
}

function draw() {
  background(255);

  // sécurité : si nextX est déjà au-delà de la limite, couper immédiatement les sons
  if (isPlaying && nextX !== undefined && nextX + circleDiameter/2 > blockX + blockWidth) {
    isPlaying = false;
    showListenButton = true;
    for (let i = 0; i < oscillators.length; i++) {
      oscillators[i].amp(0);
    }
  }

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

  // position du bouton principal (play/pause) - calculée même si on n'affiche pas forcément ce bouton
  playButtonX = buttonsStartX + buttonSize / 2;
  playButtonY = buttonsStartY + buttonSize / 2;

  if (showListenButton) {
    // bouton Listen + star côte à côte
    textSize(16);
    let w = textWidth("listen");
    listenButtonSize = max(buttonSize, w + 20 + 20); // largeur minimum

    // préparer start dimensions
    let wStart = textWidth(startLabel);
    startButtonW = max(buttonSize, wStart + 20 + 20);
    startButtonH = buttonSize;

    // calculer largeur totale du groupe et positionner au centre
    let totalWidth = listenButtonSize + 20 + startButtonW;
    let groupX = (width - totalWidth) / 2;

    listenButtonX = groupX + listenButtonSize/2;
    listenButtonY = buttonsStartY + buttonSize / 2;
    startButtonX = groupX + listenButtonSize + 20 + startButtonW/2;
    startButtonY = listenButtonY;

    let rectW = listenButtonSize;
    let rectH = buttonSize;
    let radius = 40;

    // dessiner listen
    fill(0);
    stroke(0);
    strokeWeight(2);
    rectMode(CENTER);
    rect(listenButtonX, listenButtonY, rectW, rectH, radius);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("listen", listenButtonX, listenButtonY);

    // dessiner start à droite
    fill(0);
    stroke(0);
    strokeWeight(2);
    rect(startButtonX, startButtonY, startButtonW, startButtonH, radius);
    fill(255);
    noStroke();
    text(startLabel, startButtonX, startButtonY);

    fill(0);
    stroke(0);
    strokeWeight(2);
    rect(startButtonX, startButtonY, startButtonW, startButtonH, radius);
    fill(255);
    noStroke();
    text(startLabel, startButtonX, startButtonY);
  } else {
    // Bouton Play/Pause comme avant
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
    terminatorX = buttonsStartX + buttonSize + buttonSpacing + buttonSize / 2;
    terminatorY = buttonsStartY + buttonSize / 2;
    fill(0);
    stroke(0);
    strokeWeight(2);
    circle(terminatorX, terminatorY, buttonSize);
    
    // Carré pour Terminer
    fill(255);
    let squareSize = 18;
    rect(
      terminatorX - squareSize / 2,
      terminatorY - squareSize / 2,
      squareSize,
      squareSize
    );
  }

    for(let i = 0; i < circles.length; i++){
        if(circles[i].isRest) {
            // la blanche : si on est en train de jouer on affiche un contour gris,
            // sinon on ne dessine rien
            if(isPlaying) {
                noFill();
                stroke(150); // gris
                strokeWeight(2);
                ellipse(circles[i].x, circles[i].y, circleDiameter);
            } else {
                // aucun trait/aucun remplissage lorsque la lecture est stoppée
                noFill();
                noStroke();
            }
        } else {
            fill(circles[i].color);
            noStroke();
            ellipse(circles[i].x, circles[i].y, circleDiameter);
        }
    }
}

// lit chaque note enregistrée dans l'ordre horizontal
function playSequence() {
    if (circles.length === 0) return;
    if (playingSequence) return;
    playingSequence = true;

    // trier par coordonnée X pour garantir l'ordre de lecture
    let sorted = circles.slice().sort((a, b) => a.x - b.x);
    let delay = 0;
    // valeurs raccourcies pour jouer plus rapidement et plus brièvement
    const noteDuration = 300; // ms (auparavant 400)
    const gap = 50; // intervalle entre notes (auparavant 100)

    sorted.forEach(c => {
        let idx = c.index;
        setTimeout(() => {
            if(idx !== 0) { // ne joue pas le silence
                oscillators[idx].amp(0.5, 0.05);
                setTimeout(() => {
                    oscillators[idx].amp(0, 0.1);
                }, noteDuration);
            }
        }, delay);
        delay += noteDuration + gap;
    });

    // libérer le bouton after last note
    setTimeout(() => {
        playingSequence = false;
    }, delay);
}

