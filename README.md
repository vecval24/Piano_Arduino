# Piano Projet Arduino

Réalisé par Valentine Vecchi
Option Arduino 2026 – COMEM+

---

## Description du projet

Ce projet consiste à réaliser un piano d’une octave interactif à l’aide d’une carte Arduino et d’un capteur tactile capacitif Adafruit MPR121 12-Key Capacitive Touch Sensor Breakout.

Les touches du piano sont fabriquées en utilisant de l’encre conductrice, permettant de créer des surfaces tactiles représentées de manière créative. Lorsqu’une touche est activée par contact, la note correspondante est :

- Jouée sur l’ordinateur en temps réel

- Enregistrée sous forme de partition numérique

- Réécoutable à court terme


## Fonctionnement
1 - Détection des touches

    Le module MPR121 permet de détecter jusqu’à 12 entrées tactiles capacitives.
    Dans ce projet, 8 entrées sont utilisées pour représenter les notes d’une octave (Do, Ré, Mi, Fa, Sol, La, Si, Do).

    Chaque surface en encre conductrice agit comme une touche de piano. Lorsqu’un doigt entre en contact avec la surface via l'encre conductrice :

    Le changement de capacité est détecté

    L’information est envoyée à l’Arduino 

    L’Arduino transmet la note correspondante à l’ordinateur


2 - Génération du son

L’Arduino communique avec l’ordinateur.
Un programme côté ordinateur :

- Reçoit l’information de la note

- Associe la note à une fréquence précise

- Joue le son correspondant via les haut-parleurs


3 - Enregistrement et génération de partition

    Chaque note jouée est stockée dans une structure de données.

    À partir de ces informations, une partition numérique est générée automatiquement.

    Cette partition peut ensuite être visualisée et réécoutée jusqu'à ce que l'on recommence une nouvelle mélodie.


## Matériel utilisé

Carte Arduino Uno R3

Adafruit MPR121 12-Key Capacitive Touch Sensor Breakout

Encre conductrice

Câblage

Ordinateur (pour génération du son et partition)`

## Documentation

Retrouvez la documentation dans le dossier [docs](docs/).
