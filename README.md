# Cribbit Mobile

A guide to setting up and running this React Native (Expo) project.

## Project Setup

1.  **Install Dependencies**:
    Ensure you have Node.js and npm installed. From the project's root directory, run:

    ```bash
    npm install
    ```

2.  **Environment Configuration (Supabase)**:
    This application can connect to different Supabase environments (local for development and cloud for production).
    - **`.env.local`**: Use this file for your **local** Supabase credentials. The Supabase CLI provides these when you run `supabase start`. Make sure to fill in the placeholder values.
    - **`.env.cloud`**: This file stores the credentials for the **cloud** (production) Supabase instance.

    To switch between these environments, use the following npm scripts:
    - **To use the LOCAL configuration**:
      This command copies the contents of `.env.local` into the active `.env` file.

      ```bash
      npm run use:local
      ```

    - **To use the CLOUD configuration**:
      This command copies `.env.cloud` into `.env`.
      ```bash
      npm run use:cloud
      ```

    **Important**: After switching environments, you may need to restart the Metro server (`npm start`) for the changes to take effect.

3.  **Running the Application**:
    Once your environment is configured, run the app on your desired platform:

    ```bash
    # Start the Metro development server
    npm start

    # Run on an iOS simulator (after starting the server)
    npm run ios

    # Run on an Android emulator (after starting the server)
    npm run android
    ```

## Notes

### iOS Deployment (TestFlight)

- Create a new build.
- In Xcode, navigate to the "Product" tab and select "Archive".
- Follow the "Distribute App" process to upload to TestFlight.

### Sign in with Apple / Google

- Setup steps for these providers need to be configured in the Apple Developer account and Google Cloud Console, respectively, and then added to the Supabase Auth providers.

<details>
<summary>Supabase Local Development Output</summary>

This information is generated when you run `supabase start` locally. It is provided here for reference.

#### Development Tools

| Tool    | URL                        |
| ------- | -------------------------- |
| Studio  | http://127.0.0.1:54323     |
| Mailpit | http://127.0.0.1:54324     |
| MCP     | http://127.0.0.1:54321/mcp |

#### APIs

| API            | URL                                 |
| -------------- | ----------------------------------- |
| Project URL    | http://127.0.0.1:54321              |
| REST           | http://127.0.0.1:54321/rest/v1      |
| GraphQL        | http://127.0.0.1:54321/graphql/v1   |
| Edge Functions | http://127.0.0.1:54321/functions/v1 |

#### Database

| Name | URL                                                     |
| ---- | ------------------------------------------------------- |
| URL  | postgresql://postgres:postgres@127.0.0.1:54322/postgres |

#### Authentication Keys

| Type          | Key                                                 |
| ------------- | --------------------------------------------------- |
| Anon / Public | sb*publishable*... (get this from `supabase start`) |
| Secret        | sb*secret*... (get this from `supabase start`)      |

</details>

---

## TODO

- [ ] Clean up code once the final design/flow is available.
- [ ] Remove unused code and database tables.

## Database Management

### Dump Cloud DB to Local

To back up data from the cloud database and apply it locally:

```bash
supabase db dump --data-only > supabase/backup/data.sql
```

This command dumps only the data into a SQL file. You can then import this into your local database.

## how to create migration file

supabase migration new

## HOW TO run on local

supabase migration up

## run on production / cloud

supabase db push
