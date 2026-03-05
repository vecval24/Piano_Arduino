# Documentation

## Recherche et conception

L'idée du piano m'est venue en m'inspirant de projets réalisés avec Arduino. Je suis tombée sur un projet qui s'intitule [Blossom](https://shakethatbutton.com/blossom/) et qui est une histoire interactive avec des touches de piano directement dans le livre. Mon but étant de reprendre l'idée des touches de piano et de les afficher sur une interface et de pouvoir improviser des mélodies tout en les rééecoutant par la suite. Le choix du capteur s'est porté sur Adafruit, qui contient 12 entrées, relié au microcontrôleur Arduino.


![Piano Arduino et l'interface sur ordinateur](/docs/assets/Piano_Interface.jpg)

## Circuit électronique

Le circuit électronique du projet repose sur une communication entre la carte microcontrôleur Arduino et un module de détection tactile capacitif Adafruit. L’ensemble est monté sur une breadboard, liés avec des câbles. Douze entrées sont utilisées pour relier aux notes d'un piano.

### Schéma

Schéma de câblage montre un Arduino Uno relié sur breadboard à un Adafruit MPR121 12-Key Capacitive Touch Sensor Breakout, avec les connexions d’alimentation (VIN et GND) et I2C (SCL et SDA), et un câble connecté à une touche de piano capacitive (une des 12 notes de piano).
![Schéma de câblage montrant un Arduino Uno relié sur breadboard à un Adafruit MPR121 12-Key Capacitive Touch Sensor Breakout, avec les connexions d’alimentation et I2C, et un câble connecté à une touche de piano capacitive (une des 12 notes).](/docs/assets/Fritzing.png)

### BOM

| Réf | Composant      | Quantité | Description                            | Fournisseur / Lien                                            |
| --- | -------------- | -------- | -------------------------------------- | ------------------------------------------------------------- |
| 1   | Arduino Uno R3 | 1        | Microcontrôleur ATmega328P             | [Arduino](https://store.arduino.cc/products/arduino-uno-rev3) 
(#)                               |
| 2   | Breadboard     | 1        | Plaque de prototypage                  | [Lien](https://store.arduino.cc/collections/breadboards/products/breadboard-400-contacts) 
(#)                               |
| 3   | Adafruit MPR121|          |
|     | 12-Key Capacitive|        |
|     |Touch Sensor Breakout      | 1    | Capteur tactile capacitif      |[Lien](https://learn.adafruit.com/adafruit-mpr121-12-key-capacitive-touch-sensor-breakout-tutorial)                                  
(#)                               |
| 4   | Câbles mâles   | 14       | Câbles mâles (breadboard, capteur)     |[Lien](https://store-usa.arduino.cc/collections/cables-wires/products/10-jumper-wires-150mm-male)
(#) 
| 5   | Câbles USB 2.0 |          |
|     |  type A/B      | 1    | Câble Arduino et ordinateur                |[Lien](https://store-usa.arduino.cc/collections/cables-wires/products/usb-2-0-cable-type-ab)
(#) 

## Programme

Dans le fichier html, voici les librairies chargées : 
- p5.js (v1.4.0) : framework graphique/animation
- p5.serialport.js : communication USB série entre Arduino et navigateur
- p5.sound.js (v1.9.0) : synthèse audio (oscillateurs)

Dans le fichier sketch.js, voici les données clés utilisées : 
- notes : noms des 12 notes (G5 à C4)
- notePositions : Y des lignes de la partition
- frequencies : Hz de chaque note
- oscillators : 12 oscillateurs p5.Oscillator actifs
- circles : visualisation des notes jouées (avec position X)

**Mode "enregistrement" :**

isPlaying = true
Reçoit les touches du capteur via série
Ajoute les cercles sur la partition (X = nextX qui décale les notes)
Joue le son en temps réel avec les oscillateurs
Mode "lecture" : bouton Listen et Start

**Particularités :**

userStartAudio() nécessaire pour démarrer Web Audio API (restrictions navigateur)


## Roadmap

Pour les choses améliorables, il y aurait la détection des touches afin d'utiliser la peinture conductrice. Les câbles mâles sont actuellement trop sensibles et mal réglés car ils détectent en continu lorsqu'ils sont reliés à la peinture. 

Pour les nouvelles fonctionnalités, la partition pourrait être améliorée avec notamment une diversification des notes de musique (noire, blanche, croche, double croche etc.). Ceci demanderait une notion de temps et de rapidité pour la détection des touches.