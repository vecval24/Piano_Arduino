# Piano Projet Arduino

Réalisé par Valentine Vecchi
Option Arduino 2026 – COMEM+

---

## Description du projet

Ce projet consiste à réaliser un piano interactif à l’aide d’une carte Arduino et d’un capteur tactile capacitif Adafruit MPR121 12-Key Capacitive Touch Sensor Breakout.

[Piano Arduino et l'interface](docs/assets/Piano_Arduino_Interface.jpg)

Les touches du piano sont les bouts des câbées reliés aux 12 entrées du capteur, représentées de manière créative. Lorsqu’une touche est activée par contact, la note correspondante est :

- Jouée sur l’ordinateur en temps réel

- Enregistrée sous forme de partition numérique

- Réécoutable à court terme


## Fonctionnement
1 - Détection des touches

Le module MPR121 permet de détecter jusqu’à 12 entrées tactiles capacitives.
Dans ce projet, les 12 entrées sont utilisées pour représenter les notes du piano dont une une blanche (silence) pour y ajouter plus de modalités au niveau sonore. 

Lorsqu’un doigt entre en contact avec la surface d'un câble :

- Le changement d'état est détecté (0 ou 1)

- L’information est envoyée à l’Arduino 

- L’Arduino transmet la note correspondante à l’ordinateur


2 - Génération du son

L’Arduino communique avec l’ordinateur.
Un programme côté ordinateur :

- Reçoit l’information de la note / l'index

- Associe la note à une fréquence précise

- Joue le son correspondant via les haut-parleurs de l'ordinateur


3 - Enregistrement et génération de partition

Chaque note jouée est stockée dans une structure de données.

À partir de ces informations, une partition numérique est générée automatiquement.

Cette partition peut être visualisée et réécoutée jusqu'à ce que l'on recommence une nouvelle mélodie. (choix via des boutons sur l'interface)


## Matériel utilisé

- Carte Arduino Uno R3

- Adafruit MPR121 12-Key Capacitive Touch Sensor Breakout

- Carton pour la structure

- Câblage

- Ordinateur (pour génération du son et partition)`

## Documentation

Retrouvez la documentation dans le dossier [docs](docs/).
