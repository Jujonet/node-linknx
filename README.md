node-linknx
===========

Communication entre nodejs et Linknx

Description
===========

Un simple module qui permet de demander l'�tat de tous les objets ou de certains seulement, ainsi que de changer l'�tat de un ou plusieurs objets et de recevoir tout cela dans une variable json
Uses [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) 

Installation
============

la fa�on la plus simple d'installer `node-linknx` est d'utiliser [npm](http://npmjs.org) , `npm
install node-linknx` va t�l�charger node-linknx et toutes les d�pendances.

Usage
=====

On d�clare la lib avec les variables Host (adresse ip serveur linknx) et PORT (le port linknx normalement 1028)

```javascript
var linknx = require('node-linknx');
var HOST = "127.0.0.1";
var PORT = 1028;
```

On cr�e la fonction de callback �  envoyer elle prendra en param�tre un fichier json
```javascript
var callback = function(arg) { 
        console.dir(arg);
        /* Votre code sur le retour ici */
};
```

Pour une Demande �tat de tous les Objets linknx toute les X (var interval ) sec 

```javascript
var interval = 2000;
var refresh_linknx = linknx.refresh_linknx(HOST,PORT, interval, callback);
```

Pour la reception des eventsource de linknx pour evit� les requetes multiple et etre averti en live 

```javascript
var PORT_EVENT = 80;
var eventsource_linknx = linknx.eventsource_linknx(HOST,PORT_EVENT,callback);
``` 


Pour une Demande �tat de tous les Objets linknx une seule fois

```javascript
var status_all_linknx = linknx.status_all(HOST,PORT, callback);
```


Pour une Demande etat d'une liste Objets linknx
On d�clare d'abord une variable json
```javascript
var Liste_objects_linknx = new Array();
Liste_objects_linknx = '{"objects":['
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Lumiere_Chambre_2_Rue_Status"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Lumiere_Petite_Buanderie_Plafond_Status"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Chauffage_salle_a_mangee_temp_ambiante"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Chauffage_cuisine_setpoint_in"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Chauffage_cuisine_mode_choix"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Arduino_remise_3_status"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Lumiere_Chambre_2_Cote_Ensemble_Cmd"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Lumiere_Salle_a_Manger_Lustre_Table_Cmd"}'
Liste_objects_linknx = Liste_objects_linknx + ']}';
Liste_objects_linknx = JSON.parse(Liste_objects_linknx);
```
Puis
On appel la fonction:
```javascript
var multi_status_linknx = linknx.status_multi(HOST,PORT,Liste_objects_linknx, callback);
```


Pour un changement �tat pour un seul objet

```javascript
var objet_linknx = "Lumiere_Salle_a_Manger_Lustre_Table_Cmd";
var value = "on"
var change_state_linknx = linknx.change_state(HOST,PORT,objet_linknx,value,callback);
```


Pour un changement �tat de plusieurs objets

On d�clare d'abord une variable json
```javascript
var Liste_objects_linknx = new Array();
Liste_objects_linknx = '{"objects":['
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Lumiere_Buanderie_Plafond_Cmd","value":"off"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Lumiere_Bureau_Plafond_Cmd","value":"off"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Lumiere_Cuisine_Lustre_Table_Cmd","value":"off"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Lumiere_Hall_Plafond_Cmd","value":"off"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Lumiere_Salle_a_Manger_Lustre_Table_Cmd","value":"off"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Chauffage_bureau_mode_choix","value":"comfort"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Chauffage_hall_entree_mode_choix","value":"comfort"},'
Liste_objects_linknx = Liste_objects_linknx + '{"id":"Chauffage_cuisine_setpoint_in","value":"22"}'
Liste_objects_linknx = Liste_objects_linknx + ']}';
Liste_objects_linknx = JSON.parse(Liste_objects_linknx);
```
Puis
On appel la fonction:
```javascript
var change_state_multi_linknx = linknx.change_state_multi(HOST,PORT,Liste_objects_linknx,callback);
```

Retour des fonctions
------------------

Le retour des fonctions sont toujours en json

