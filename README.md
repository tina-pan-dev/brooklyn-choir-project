# Brooklyn Choir Project website

The public website is a React app backed by Sanity. Choir editors manage copy, ticket details, social links, images, and video through the Sanity Studio in `studio/`.

Local fallback content keeps the website working before Sanity is connected or if the content API is temporarily unavailable.

## 1. Create the free Sanity project

Create a project at [sanity.io/manage](https://www.sanity.io/manage), using a public dataset named `production`. Copy the project ID from the project settings.

Sanity Studio v4 requires Node 20 or newer.

## 2. Connect the editor

```bash
cp studio/.env.example studio/.env.local
```

Add the project ID to `studio/.env.local`:

```dotenv
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

Start the editing interface:

```bash
npm run studio
```

The first run opens the Studio at `http://localhost:3333` and asks you to sign in to Sanity.

Seed the original website copy once:

```bash
npm run studio:seed
```

The seed command only imports missing content, so it will not overwrite an existing homepage document. Open **Homepage** in the Studio, upload the media files under the Media tab, and publish the document.

## 3. Connect the public site

```bash
cp .env.example .env.local
```

Set the same project ID:

```dotenv
REACT_APP_SANITY_PROJECT_ID=your_project_id
REACT_APP_SANITY_DATASET=production
```

In the Sanity project settings, open **API → CORS origins** and add:

- `http://localhost:3000` for local development
- The production website origin, such as `https://brooklynchoirproject.com`

Credentials are not required for the public site because the dataset is public. Only published Studio changes appear on the website.

## Run and verify the website

```bash
npm install
npm start
```

Tests and production build:

```bash
npm test -- --watchAll=false
npm run build
```

## Deploy the editor

The client-facing editor is deployed at:

<https://brooklyn-choir-project.sanity.studio>

Only invited project members can sign in. Deploy future schema or editor changes with:

```bash
npm run studio:deploy
```

The command asks you to choose the Studio hostname. Only invited Sanity project members can sign into the editor.

## Project structure

- `src/content/sanity.js` fetches published content through Sanity’s API CDN.
- `src/content/fallbackContent.js` contains the complete local fallback.
- `src/components/RichText.js` renders Sanity Portable Text.
- `studio/schemas/siteContent.js` defines the editor fields.
- `studio/seed.ndjson` contains the original copy for the initial import.

Published text changes are loaded when a visitor opens the site, so ordinary edits do not require a website rebuild or deployment.
