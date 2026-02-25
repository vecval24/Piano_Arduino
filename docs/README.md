# Documentation

## Recherche et conception

`Quelques notes sur la conception, des projets de référence, mon intention, etc.`

![Description de l'image](/docs/assets/croquis-de-recherche.png)

## Circuit électronique

Le circuit électronique du projet repose sur une communication entre la carte microcontrôleur Arduino et un module de détection tactile capacitif Adafruit. L’ensemble est monté sur une breadboard, liés avec des câbles. Huit entrées sont utilisées pour relier aux notes de l'octave du piano.

### Schéma

Schéma de câblage montrant un Arduino Uno relié sur breadboard à un Adafruit MPR121 12-Key Capacitive Touch Sensor Breakout, avec les connexions d’alimentation et I2C, et un câble connecté à une touche de piano capacitive (une des 8 notes de l’octave).
![Schéma de câblage montrant un Arduino Uno relié sur breadboard à un Adafruit MPR121 12-Key Capacitive Touch Sensor Breakout, avec les connexions d’alimentation et I2C, et un câble connecté à une touche de piano capacitive (une des 8 notes de l’octave).](/docs/assets/Schéma%20Fritzing.png)

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

`Quelques notes sur des le code, des particularités, sa structure, l'usage de libs particulières, etc.`

## Roadmap

`Mention de choses pas tout à fait fonctionnelles ou améliorables. Idées de nouvelles fonctionnalités et liste d'améliorations souhaitables.`
