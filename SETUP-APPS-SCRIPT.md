# Setup Google Apps Script — Rapports CS

## Etape 1 : Créer le Google Sheet

1. Va sur https://sheets.google.com
2. Crée un nouveau Google Sheet
3. Renomme-le **"Rapports CS"**
4. Sur la première ligne (en-têtes), mets exactement :

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| id | date | author | bugCount | okCount | totalChecks | htmlContent |

5. Copie l'ID du Sheet depuis l'URL :
   `https://docs.google.com/spreadsheets/d/`**ICI_L_ID**`/edit`

---

## Etape 2 : Créer le script Apps Script

1. Va sur https://script.google.com
2. Clique **"Nouveau projet"**
3. Renomme le projet en **"API Rapports CS"**
4. **Supprime tout** le contenu du fichier `Code.gs`
5. **Colle le code suivant** :

```javascript
// ===== CONFIGURATION =====
const SHEET_ID = 'COLLE_ICI_L_ID_DU_SHEET';
const SHEET_NAME = 'Feuil1'; // ou 'Sheet1' si ton Sheet est en anglais

// ===== API =====

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const reports = [];
    for (let i = 1; i < data.length; i++) {
      const row = {};
      headers.forEach((h, j) => { row[h] = data[i][j]; });
      reports.push(row);
    }
    // Tri du plus récent au plus ancien
    reports.sort((a, b) => new Date(b.date) - new Date(a.date));
    return ContentService.createTextOutput(JSON.stringify(reports))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const id = body.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
    const row = [
      id,
      body.date || new Date().toISOString(),
      body.author || 'Anonyme',
      body.bugCount || 0,
      body.okCount || 0,
      body.totalChecks || 0,
      body.htmlContent || ''
    ];
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ success: true, id: id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

6. **Remplace** `COLLE_ICI_L_ID_DU_SHEET` par l'ID de ton Google Sheet (étape 1.5)

---

## Etape 3 : Déployer

1. Clique **Déployer** → **Nouveau déploiement**
2. Clique l'engrenage ⚙️ à côté de "Type" → sélectionne **"Application Web"**
3. Remplis :
   - **Description** : API Rapports CS
   - **Exécuter en tant que** : **Moi**
   - **Qui a accès** : **Tout le monde**
4. Clique **Déployer**
5. Google te demande d'autoriser → clique **Examiner les autorisations** → choisis ton compte → **Autoriser**
6. **Copie l'URL** du déploiement (elle ressemble à `https://script.google.com/macros/s/AKfyc.../exec`)

---

## Etape 4 : Coller l'URL dans l'app

1. Envoie-moi l'URL et je la mets dans checklist-cs.html et rapport.html
2. Ou bien ouvre les 2 fichiers et remplace la ligne :
   ```
   const APPS_SCRIPT_URL = '';
   ```
   par :
   ```
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/TON_URL/exec';
   ```

---

## C'est fini !

A partir de maintenant :
- **Publier un rapport** : dans la checklist, clique "Publier le rapport" → le rapport est sauvegardé dans le Sheet + un mail s'ouvre
- **Voir les rapports** : va sur rapport.html → tous les rapports de tous les testeurs apparaissent
