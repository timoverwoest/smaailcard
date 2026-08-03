# Smaailcard

Een custom [Home Assistant](https://www.home-assistant.io/) Lovelace-kaart die
een **dot-matrix vertrekbord** in de stijl van een reisposter tekent: elke regel
is een bestemming met een jaartal, opgebouwd uit losse LED-puntjes, met een
wereldkaart en een tekensetlegenda in de voet.

De kaart is een vector-SVG, dus hij blijft scherp op elk formaat, en alles wat
je ziet is instelbaar — via de visuele editor in Home Assistant of in YAML.

<!-- Absolute URL, niet relatief: HACS strijkt relatieve image-paden uit de
     README weg, waardoor het plaatje daar niet laadt. -->
![Smaailcard](https://raw.githubusercontent.com/timoverwoest/smaailcard/main/docs/preview.png)

## Installatie

### Via HACS

1. HACS → menu (⋮) → **Custom repositories**.
2. Voeg `https://github.com/timoverwoest/smaailcard` toe met categorie
   **Dashboard**.
3. Zoek "Smaailcard" in HACS en installeer.
4. Vernieuw je browser (harde refresh).

### Handmatig

1. Kopieer `dist/smaailcard.js` naar `/config/www/smaailcard.js`.
2. Instellingen → Dashboards → menu (⋮) → **Resources** → toevoegen:
   - URL: `/local/smaailcard.js`
   - Type: **JavaScript-module**
3. Harde refresh van de browser.

## Kaart toevoegen

Via de UI: **Kaart toevoegen** → zoek "Smaailcard". De kaart heeft een volledige
visuele editor, dus YAML is niet nodig.

Minimaal voorbeeld:

```yaml
type: custom:smaail-card
rows:
  - dest: NEW YORK
    year: "1997"
  - dest: MADRID
    year: "2000"
  - dest: WHAT'S NEXT?
    year: ""
```

## Regels

Elke regel op het bord is een item in `rows`:

| Optie | Betekenis |
| --- | --- |
| `dest` | Vaste tekst voor de bestemming. |
| `year` | Jaartal. **Weggelaten** = lege jaartalkolom (het raster blijft staan). **`""`** = de regel loopt over de volle breedte. |
| `color` | `yellow`, `white`, `grey` of een hexcode. Standaard wisselen de regels elkaar af (geel/wit). |
| `entity` | Entity waarvan de **status** de bestemming wordt, in plaats van `dest`. |
| `attribute` | Gebruik dit attribuut van `entity` in plaats van de status. |
| `year_entity` | Entity waarvan de status het jaartal wordt. |
| `year_attribute` | Gebruik dit attribuut van `year_entity`. |

Met `entity` haal je de tekst live uit Home Assistant:

```yaml
type: custom:smaail-card
title: NEXT UP
rows:
  - entity: sensor.volgende_reis   # status wordt de bestemming
    year_entity: sensor.reis_jaar
  - dest: TEXEL
    year: "2025"
```

De kaart tekent alleen opnieuw als een entity die daadwerkelijk op het bord
staat verandert, niet bij elke willekeurige statuswijziging in HA.

### Volgorde

De kaart zet de regels zelf op jaartal, dus je hoeft `rows` niet in de goede
volgorde te zetten. Standaard is dat oplopend (oudste eerst); met `sort: desc`
draai je dat om en met `sort: none` houdt de kaart de volgorde aan die je in
`rows` hebt opgegeven.

Regels **zonder** jaartal doen niet mee aan het sorteren: die houden hun eigen
volgorde en komen onder de gesorteerde regels. Zo blijft een afsluitende regel
als `WHAT'S NEXT?` gewoon onderaan staan.

Jaartallen die geen getal zijn (bijvoorbeeld `SOON`) worden alfabetisch
gesorteerd en komen ná de numerieke. Regels met hetzelfde jaartal houden
onderling de volgorde uit `rows`.

De geel/wit-afwisseling volgt de volgorde zoals je die op het bord ziet, niet
die uit de configuratie — een regel met een eigen `color` houdt uiteraard die
kleur.

De korte schrijfwijze `"BESTEMMING|JAAR"` uit het originele generator-script
werkt ook:

```yaml
rows:
  - NEW YORK|1997
  - WHAT'S NEXT?|
```

## Alle opties

| Optie | Standaard | Betekenis |
| --- | --- | --- |
| `title` | `DEPARTURES` | Tekst in de kop. Wordt automatisch gecentreerd. |
| `dest_label` | `DESTINATION` | Kop boven de bestemmingskolom. |
| `year_label` | `YEAR` | Kop boven de jaartalkolom. |
| `rows` | `[]` | De regels (zie hierboven). |
| `row_count` | `9` (of meer als je meer regels opgeeft) | Aantal regelposities, inclusief lege. |
| `sort` | `asc` | Volgorde: `asc` (op jaartal, oudste eerst), `desc` (nieuwste eerst) of `none` (volgorde uit `rows`). |
| `show_header` | `true` | Kop met vliegtuigicoon en titel. |
| `show_column_labels` | `true` | Kolomkoppen. |
| `show_footer` | `true` | De twee voetteksten met pijlen. |
| `show_map` | `true` | Wereldkaart in de voet. |
| `show_legend` | `true` | Tekensetlegenda in de voet. |
| `pin` | `[5.12, 52.09]` | Markering op de wereldkaart als `[lengtegraad, breedtegraad]`. `null` verbergt hem. |
| `footer_title` | `Travel board` | Eerste voettekst. |
| `footer_subtitle` | `Mapping memories, one destination at a time` | Ondertitel daarvan. |
| `footer2_title` | `My next adventure` | Tweede voettekst. |
| `footer2_subtitle` | `Just one ticket away` | Ondertitel daarvan. |
| `accent_color` | `#F2DD00` | Accentkleur (icoon, pijlen, legenda, markering). |
| `background_color` | `#0C0C0C` | Achtergrond van het bord. |
| `unlit_color` | `#3A3A3A` | Kleur van de gedoofde dots. |

Zet je secties uit, dan krimpt de kaart mee — de ruimte die een verborgen blok
zou innemen valt weg, zodat er geen leeg vlak overblijft. Met alle secties aan
en `row_count: 9` is de kaart exact de originele posterverhouding (1000×1414).

Een compacte variant, bijvoorbeeld naast andere kaarten:

```yaml
type: custom:smaail-card
title: LOGBOEK
row_count: 4
show_map: false
show_legend: false
show_footer: false
rows:
  - dest: TEXEL
    year: "2024"
  - dest: VLIELAND
    year: "2025"
```

## Tekenset

Het bord gebruikt een 5×7 dot-matrix font met een beperkte tekenset:

```
A-Z   0-9   spatie   -   .   ?   '
```

Andere tekens worden als spatie getekend. Tekst wordt automatisch naar
hoofdletters omgezet en afgekapt op wat er past: **10 tekens** in de
bestemmingskolom, **4** in de jaartalkolom, en **16** op een regel over de volle
breedte.

## Ontwikkelen

```bash
npm install
npm run dev      # kaart in de browser met mock-hass, geen Home Assistant nodig
npm run build    # type-check + dist/smaailcard.js
npm run typecheck
```

`npm run dev` serveert `index.html` met een nagebootst `hass`-object, zodat je
de kaart live kunt aanpassen zonder draaiende Home Assistant. De mock-data staat
in `src/dev.ts`.

### Projectstructuur

| Pad | Doel |
| --- | --- |
| `src/smaailcard.ts` | De kaart (`<smaail-card>`): config, entities, layout. |
| `src/editor.ts` | Visuele config-editor (`<smaail-card-editor>`). |
| `src/board.ts` | Bouwt de SVG: geometrie, regels, voet, kaart, legenda. |
| `src/font.ts` | Het 5×7 dot-matrix font. |
| `src/dots.ts` | Dot- en tekst-primitieven. |
| `src/worldmap.ts` | Continentcontouren + projectie voor de mini-wereldkaart. |
| `src/types.ts` | Configuratietypen. |
| `src/dev.ts`, `index.html` | Browser-dev-harness. |

De geometrie (rasterafstand, kolombreedtes, kleuren, het font en de
continentcontouren) is overgenomen uit het oorspronkelijke
`departures_board.py`-generatorscript, zodat de kaart bij `row_count: 9` exact
hetzelfde beeld geeft als de poster.

Waar de kaart bewust afwijkt van dat script:

- **Prestaties.** Het script tekent elk puntje als een losse `<circle>` (~5500
  stuks). Omdat een Lovelace-kaart bij elke statuswijziging opnieuw tekent,
  gebruikt de kaart één SVG-`pattern` voor het gedoofde raster en bundelt hij de
  opgelichte dots per kleur in één `<path>`: ~60 DOM-nodes in plaats van ~5500.
- **Centrering van de kop.** Het script zet de kop op een vaste positie die
  alleen klopt voor het woord "DEPARTURES". De kaart meet de kop na het tekenen
  en centreert hem, zodat elke `title` goed staat.
- **Afkappen.** Te lange tekst wordt afgekapt op wat in de kolom past, zodat een
  bestemming nooit in de jaartalkolom loopt.

### Een release maken

Releases worden door GitHub Actions gemaakt, niet met de hand:

1. Ga naar **Actions** → workflow **Release** → *Run workflow*.
2. Vul het versienummer in **zonder `v`** (bijvoorbeeld `0.2.0`) en start.

De workflow zet die versie in `package.json` en `src/const.ts`, draait de build,
commit het resultaat, en maakt de tag `v0.2.0` plus de GitHub Release met
`dist/smaailcard.js` als asset — dat laatste is wat HACS bij voorkeur
binnenhaalt. De release-notities worden automatisch uit de commits samengesteld.

## Credits

Het ontwerp van het bord is gebaseerd op een poster van
**[Smaail](https://smaail.be/index.php/posters/)**. Het dot-matrix-font, de
rastergeometrie, het kleurenpalet en de mini-wereldkaart zijn overgenomen uit
het `departures_board.py`-generatorscript dat dat ontwerp nabouwt.

Dit is een persoonlijk Home Assistant-project, niet uitgegeven door of
verbonden aan Smaail. De rechten op het oorspronkelijke posterontwerp liggen
bij Smaail; de MIT-licentie hieronder geldt voor de code in deze repository.

## Licentie

[MIT](LICENSE)
