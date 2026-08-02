# Smaailcard

Een custom [Home Assistant](https://www.home-assistant.io/) Lovelace-kaart als
startpunt, gebouwd met **Lit + TypeScript** en gebundeld met **Vite**. Los van
enige andere integratie of kaart — dit is een schone basis om je eigen kaart op
te bouwen.

De standaardkaart toont, als voorbeeld, de status van één geconfigureerde
entity met een optionele kop en naam. Vervang `_renderBody()` in
`src/smaailcard.ts` door je eigen inhoud.

## Ontwikkelen & testen (zonder Home Assistant)

```bash
npm install
npm run dev      # start Vite; open de getoonde URL in de browser
```

`npm run dev` serveert `index.html` met een **mock `hass`-object** en een
minimale `<ha-card>`, zodat je de kaart in een gewone browser ziet en live kunt
aanpassen — er is geen draaiende Home Assistant nodig. De mock-data staat in
`src/dev.ts`.

```bash
npm run build    # type-check (tsc) + productiebundel naar dist/smaailcard.js
npm run typecheck
```

`npm run build` maakt één self-contained ES-bundle (`dist/smaailcard.js`, Lit
inbegrepen) die Home Assistant als Lovelace-resource laadt.

## Installeren in Home Assistant

### Via HACS

1. HACS → menu (⋮) → **Custom repositories**.
2. Voeg deze repository-URL toe met categorie **Dashboard** (Lovelace).
3. Zoek "Smaailcard" in HACS en installeer.
4. HACS voegt de resource automatisch toe. Vernieuw je browser (harde refresh).

### Handmatig

1. Kopieer `dist/smaailcard.js` naar `/config/www/smaailcard.js`.
2. Instellingen → Dashboards → menu (⋮) → **Resources** → resource toevoegen:
   - URL: `/local/smaailcard.js`
   - Type: **JavaScript-module**
3. Harde refresh van de browser.

## Kaart toevoegen aan een dashboard

Via de UI: **Kaart toevoegen** → zoek "Smaailcard" (met visuele editor).

Of via YAML:

```yaml
type: custom:smaail-card
name: Smaailcard
header: Mijn kop        # optioneel
entity: sensor.example  # optioneel, toont de status als voorbeeld
```

## Projectstructuur

| Pad | Doel |
| --- | --- |
| `src/smaailcard.ts` | De kaart zelf (`<smaail-card>`). |
| `src/editor.ts` | Visuele config-editor (`ha-form`). |
| `src/types.ts` | Configuratie-typen. |
| `src/const.ts` | Versie en element-namen. |
| `src/dev.ts` + `index.html` | Browser-dev-harness met mock `hass`. |
| `dist/smaailcard.js` | Gebouwde bundel die HA laadt. |
| `hacs.json` | HACS-metadata (Lovelace-plugin). |

## Licentie

[MIT](LICENSE)
