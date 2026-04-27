# ⛽ Fuel Station Card - Pro

Una Custom Card per Home Assistant elegante e compatta, progettata per visualizzare i prezzi del carburante di 20 stazioni con loghi personalizzati e indicazione dell'indirizzo al click.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ✨ Caratteristiche
- 📱 Layout ottimizzato a 5 colonne.
- 🎨 Loghi locali ad alta risoluzione (caricamento istantaneo).
- 📍 Visualizzazione indirizzo tramite Alert al click e Tooltip al passaggio del mouse.
- 🟢 Prezzi evidenziati in verde neon per la massima leggibilità.

## 🛠️ Installazione Manuale

1. Scarica questo repository come ZIP e estrailo.
2. Copia la cartella `gas-station-card` nel percorso `/config/www/` del tuo Home Assistant.
   - La struttura finale dovrà essere: `/config/www/gas-station-card/fuel-pro-v3.js` e la cartella `logos/`.
3. In Home Assistant, vai in **Impostazioni > Dashboard > Risorse** e aggiungi:
   - **URL:** `/local/gas-station-card/fuel-pro-v3.js`
   - **Tipo:** `Modulo JavaScript`

## 📝 Configurazione Dashboard

Aggiungi una card **Manuale** e incolla il seguente codice YAML:

```yaml
type: custom:fuel-pro-v9
entity_top20: sensor.carburanti_nome-città_carburante_top_20

## ex:
type: custom:fuel-pro-v9
entity_top20: sensor.carburanti_foggia_metano_top_20
