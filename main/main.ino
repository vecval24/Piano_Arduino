// Bibliothèques
#include <Wire.h>               // protocole I2C (communication avec capteur, SDA & SCL)
#include "Adafruit_MPR121.h"    // bibliothèque pour le capteur

#ifndef _BV
#define _BV(bit) (1 << (bit))   // masque binaire pour chaque touche
#endif

Adafruit_MPR121 cap = Adafruit_MPR121(); // objet pour contrôler le capteur

// Stocker l'état des touches précédentes et actuelles
uint16_t lasttouched = 0;
uint16_t currtouched = 0;

void setup() {
  Serial.begin(9600); //serial monitor 9600 bauds (v comm d'un signal)
  while (!Serial) { delay(10); }

  Serial.println("Adafruit MPR121 Capacitive Touch sensor test");

  if (!cap.begin(0x5A)) {
    Serial.println("MPR121 not found, check wiring?");
    while (1) {} // boucle infinie si capteur non détecté
  }

  Serial.println("MPR121 found!");
  Serial.println("Running auto configuration.");
  cap.setAutoconfig(true);
  Serial.println("Initialization complete.");
}

void loop() {
  currtouched = cap.touched(); //état actuel des touches 0 = relâché, 1 = touché

  for (uint8_t i = 0; i < 12; i++) {
    // Nouvelle touche pressée
    if ((currtouched & _BV(i)) && !(lasttouched & _BV(i))) { //touchée mtn mais pas avant
     //Serial.print("Touche "); //Interfère avec le indextouch envoyé à la console
      Serial.print(i);
      Serial.println(",1");
      //Serial.println(" touchée");
    }

    // Touche relâchée
    if (!(currtouched & _BV(i)) && (lasttouched & _BV(i))) { //pas touchée mtn mais touchée avant
      //Serial.print("Touche ");
      Serial.print(i);
      Serial.println(",0");
      //Serial.println(" relâchée");
    }
  }

  lasttouched = currtouched; //màj état
  delay(10);
}