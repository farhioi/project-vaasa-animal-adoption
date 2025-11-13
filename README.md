# Vaasan eläinadoptio – ryhmätyö 
- Farhio & Gabriela

Digitaalinen adoptiosovellus Vaasan Eläinsuoja ry:lle.  
Sovelluksen avulla käyttäjä voi:

- selata adoptoitavia eläimiä
- nähdä jokaisen eläimen tarkemmat tiedot
- täyttää adoptiohakemuksen sähköisesti
- saada välittömän vahvistuksen hakemuksen tallentumisesta

Projekti on toteutettu kolmena palveluna Docker-konteissa:
frontend, Server A ja Server B.

---

## 1. Arkkitehtuuri

### Palvelut

- **frontend**
  - Vite + React
  - näyttää eläinlistan, eläimen sivun, adoptio-lomakkeen ja kiitos-sivun
  - portti: `3000` (Nginx palvelee buildattua fronttia)

- **servera (Server A – pääpalvelin)**
  - Node.js + Express
  - vastaa eläintiedoista ja API Gateway -toiminnallisuudesta
  - lukee ja kirjoittaa eläin-dataa tiedostosta `server_a/data/animals.json`
  - REST-rajapinnat:
    - `GET /animals`
    - `GET /animals/:id`
    - `POST /animals/:id/adopt`
        - välittää hakemuksen Server B:lle
        - päivittää eläimen statuksen (esim. "adopted")
  - portti: `8080`

- **serverb (Server B – adoptiopalvelin)**
  - Node.js + Express
  - vastaanottaa adoptiohakemukset Server A:lta
  - tallentaa hakemukset tiedostoon `server_b/data/adoptions.json`
  - estää saman eläimen uudelleenadoptoinnin
  - REST-rajapinta:
    - `POST /adoptions`
    - (lisäksi esim. `GET /adoptions` testaukseen)
  - portti: `8090`

### Tietokanta

Tietokanta on toteutettu yksinkertaisena JSON-tiedostona:

- `server_a/data/animals.json`
  - kentät: `id`, `name`, `type`, `age`, `breed`, `description`, `image`, `status`
- `server_b/data/adoptions.json`
  - kentät esim.: `id`, `animalId`, `applicant`, `date`, `status`

---

## 2. Käyttöliittymä

Frontend (React) sisältää kolme pääsivua:

1. **Etusivu / listanäkymä**
   - reitti: `/`
   - näyttää kaikki adoptoitavat eläimet kortteina
   - jokaisessa kortissa:
     - eläimen nimi
     - tyyppi (esim. kissa/koira)
     - ikä
     - pieni kuva (SVG, tai placeholder)
     - *“Katso lisää”* -painike → vie eläimen sivulle

2. **Eläimen yksityiskohtasivu**
   - reitti: `/animal/:id`
   - näyttää:
     - nimi
     - ikä
     - rotu
     - kuva
     - kuvaus
   - jos eläin on vapaana:
     - *“Adoptoi minut”* / *“Varaa”* -painike → lomakesivu
   - jos eläin on jo adoptoitu:
     - teksti tyyliin **“Tämä eläin on jo adoptoitu”**
     - nappi disabloitu

3. **Adoptio-lomakesivu**
   - reitti: `/animal/:id/adopt`
   - lomakekenttiä esim:
     - nimi
     - sähköposti
     - puhelin
     - vapaa viesti
   - *Lähetä hakemus* -nappi:
     - lähettää `POST /animals/:id/adopt` Server A:lle
     - ohjaa onnistuneen vastauksen jälkeen kiitos-sivulle

4. **Kiitos-sivu**
   - reitti: `/thank-you`
   - näyttää vahvistusviestin:
     - “Kiitos adoptiohakemuksesta!”
     - *“Palaa etusivulle”* -painike

Koko UI on toteutettu yhtenäisenä “pinkki vibe” -teemana
(gradient-yläpalkki, söpöjä värejä, eläinkortit yms.).

---

## 3. Käynnistysohjeet (Docker)

### Esivaatimukset

- Docker Desktop (Windows) tai Docker + Docker Compose (Linux/macOS)
- Git kloonattu tähän hakemistoon

### 3.1. Ensimmäinen käynnistys

Projektin juurihakemistossa:

```bash
docker compose up --build
