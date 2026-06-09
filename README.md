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

> [!WARNING]
> **MIGRATION SINGLE SOURCE OF TRUTH**: 
> Database migrations **MUST NOT** be created or pushed from this dashboard project repository (`cribbit-dashboard-shadcn`).
> All database schema migrations are managed solely inside the **Cribbit Mobile** (`cribbit-mobile`) repository to prevent version history conflicts.
>
> If you make changes to the database structure:
> 1. Create and push the migration SQL file from the `cribbit-mobile` project using the Supabase CLI.
> 2. Regenerate the TypeScript schema definitions in this project by running:
>    ```bash
>    npm run generate:db
>    ```

