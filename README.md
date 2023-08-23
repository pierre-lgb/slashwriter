https://user-images.githubusercontent.com/83542054/227054132-b9f0d190-47f2-497e-890d-19e3c8ac2ea5.mp4

## Introduction

**Slashwriter** is a tool for creating, organizing, and sharing documents online. Its block-based collaborative editor, which is easy to use, is designed to help you create high-quality documents while saving you time.

Here's an overview of some of the features:

-   **Commands.** To add content to your document, you can use commands. By typing / in the editor, the list of commands appears. For example, /title allows you to add a title, and /bold allows you to make text bold.

-   **Block Editor.** The editor organizes your document into blocks: paragraphs, headings, images, tables, etc. By hovering over one of these blocks, the handle (⠿) that appears allows you to drag and drop them to another part of the document.

-   **Embedded Documents.** To organize your documents, you can embed sub-documents within a document using the /document command. When a document becomes too long, moving the content of a section into embedded documents makes reading and navigation easier.

-   **Markdown.** The editor is compatible with markdown commands to make writing faster. For example, #, ##, and ### can be used to create titles and subheadings.

And many more...

![Cover](.github/slashwriter-cover.png)

It was created using [NextJS](https://github.com/vercel/next.js) and [Supabase](https://github.com/supabase/supabase), as well as a lot of modules detailed in the `package.json` file.

## Demo

A demo is available online at https://slashwriter.fly.dev.

## Local Setup

### Prerequisites

To run Slashwriter locally, you need :

-   Node.js
-   PostgreSQL
-   Supabase CLI, which itself requires Docker

### Steps to follow :

1. Download repository
2. In the repository's root directory, run `yarn install`
3. Start Supabase locally:
    - Run `supabase init` (or `npx supabase init` if supabase-cli has been installed with npm)
    - Run `supabase start` (or `npx supabase start` if supabase-cli has been installed with npm). Don't forget to start Docker.
4. Setup environment variables: duplicate `.env.development`, rename it `.env.local` and set the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables to the URLs logged in the console after running `supabase start`:
    ```
    NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
    ```
5. Run the following command (set --dbname to your local database URL):
    ```cmd
    cd server/scripts && psql --single-transaction --variable ON_ERROR_STOP=1 --file tables.sql --file auth.sql --file rpc.sql --file folders.sql --file documents.sql --file shares.sql --file cron.sql --file realtime.sql --file storage.sql --dbname "postgresql://postgres:postgres@localhost:54322/postgres" && cd ../..
    ```
6. Rename `@tiptap-pro-placeholder` (`shared/editor/extensions/@tiptap-pro-placeholder`) to `@tiptap-pro`
7. To start the app in development mod, run `npm run dev`. To start the app in production mode, run `npm run build` then `npm run start`.

### Stopping Supabase

To stop supabase server, run `supabase stop` (or `npx supabase stop` if supabase-cli has been installed with npm)
