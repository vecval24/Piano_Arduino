#include <Wire.h>
#include "Adafruit_MPR121.h"

#ifndef _BV
#define _BV(bit) (1 << (bit))
#endif

Adafruit_MPR121 cap = Adafruit_MPR121();

static const uint8_t PIEZO_PIN = 7;

uint16_t lasttouched = 0;
uint16_t currtouched = 0;

static const uint16_t baseFreqs[12] = {
  262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494
};

static const uint8_t octaveShift = 0;

static uint16_t applyOctave(uint16_t f, uint8_t shift) {
  uint32_t out = f;
  while (shift--) out *= 2U;
  if (out > 65535U) out = 65535U;
  return (uint16_t)out;
}

void setup() {
  Serial.begin(9600);

  while (!Serial) {
    delay(10);
  }

  Serial.println("Adafruit MPR121 Capacitive Touch sensor test");

  if (!cap.begin(0x5A)) {
    Serial.println("MPR121 not found, check wiring?");
    while (1) {}
  }

  Serial.println("MPR121 found!");
  Serial.println("Running auto configuration.");
  cap.setAutoconfig(true);
  Serial.println("Initialization complete.");

  pinMode(PIEZO_PIN, OUTPUT);
  noTone(PIEZO_PIN);
}

void loop() {
  currtouched = cap.touched();

  for (uint8_t i = 0; i < 12; i++) {
    if ((currtouched & _BV(i)) && !(lasttouched & _BV(i))) {
      uint16_t f = applyOctave(baseFreqs[i], octaveShift);
      Serial.print(i);
      Serial.print(" touched -> ");
      Serial.println(f);
      tone(PIEZO_PIN, f);
    }

    if (!(currtouched & _BV(i)) && (lasttouched & _BV(i))) {
      Serial.print(i);
      Serial.println(" released");
      noTone(PIEZO_PIN);
    }
  }

  lasttouched = currtouched;
  delay(10);
}