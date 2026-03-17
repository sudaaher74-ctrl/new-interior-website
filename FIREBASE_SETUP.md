# Firebase Setup

This website now uses:

- `Firebase Authentication` for admin sign-in
- `Cloud Firestore` for website leads
- `Cloud Firestore` for admin project entries
- `Firebase Hosting` for deployment

## 1. Create a Firebase project

1. Open the Firebase console.
2. Create a new project.
3. Add a `Web App`.
4. Copy the web app config values.

## 2. Add your Firebase config

Open [firebase-client.js](./firebase-client.js) and replace these placeholders:

- `YOUR_API_KEY`
- `YOUR_PROJECT_ID`
- `YOUR_MESSAGING_SENDER_ID`
- `YOUR_APP_ID`

Note:

- Firebase web config is public by design.
- Your security comes from `Firestore Rules`, not from hiding the API key.

## 3. Enable Authentication

In Firebase Console:

1. Go to `Authentication`
2. Open `Sign-in method`
3. Enable `Email/Password`
4. Create your admin user in `Authentication > Users`

## 4. Create Firestore

1. Go to `Firestore Database`
2. Create the database
3. Start in production mode

## 5. Approve your admin user

This project checks admin access using a Firestore document:

- Collection: `admins`
- Document ID: your Firebase Auth user UID

Create a document like:

```json
{
  "email": "admin@yourcompany.com",
  "role": "owner"
}
```

If you sign in before creating the doc, the admin page will show the UID path you need.

## 6. Deploy Firestore rules

This repo already includes [firestore.rules](./firestore.rules).

Install the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

Then inside this project folder run:

```bash
firebase deploy --only firestore:rules
```

## 7. Deploy Hosting

This repo already includes [firebase.json](./firebase.json).

Run:

```bash
firebase deploy --only hosting
```

## 8. Data layout

Collections used by this site:

- `leads`
- `projects`
- `admins`

Lead documents are created automatically when customers submit the website form.

## 9. Important note

The public website still uses hardcoded portfolio data in [script.js](./script.js) for the front-end project gallery.

The admin `Projects` page is now stored in Firestore, but those project entries are not yet wired into the public website gallery.
