# Your online editing controls

Once GitHub Pages and Pages CMS are connected, you can update public content entirely in a browser. Node.js is needed for local development, not for everyday online editing.

The website source should live in a GitHub repository owned by your account or lab organization. You control repository access and authorize the Pages CMS GitHub App. GitHub Pages serves the public website; Pages CMS supplies the editing forms.

## What each editor area controls

| Editor area | What you change |
| --- | --- |
| Website text | Page headings, navigation labels, research-area wording, descriptions, buttons, filter labels, empty-state messages, contact wording, footer labels |
| Lab settings | Lab name/expansion, main introduction and about text, contact email, CV upload, opportunities introduction and inquiry instructions, homepage item limits |
| Projects | Add projects and edit summaries, research text, status, images and links |
| People | Add/edit people, current/alumni status, program, role, biography, project participation and current position |
| Publications | Authors, title, venue, year, status, DOI, PDF, related projects and homepage selection |
| News | Announcement text, date and associated projects/records |
| Funding | Public award details and associated projects |
| Resources | Code, data, demos, links and associated projects |
| Thesis opportunities | Research questions, possible contributions, background, degree pathways, availability and project links |
| Media | Upload public photos, images and PDFs |

Website text is grouped by page and shared components. Research-area wording can change without altering internal category IDs. Navigation labels can change without changing page addresses. For example, renaming the navigation label Projects to Research keeps `/projects/` working.

## Normal update routine

1. Open https://app.pagescms.org/ and sign in with your authorized GitHub account.
2. Select your lab repository and the `main` branch.
3. Open the relevant editor area and change its fields. Use Website text for a page heading and a collection such as People for an entry.
4. Save. For collection records, turn on Publish on website when the record is ready.
5. The save creates a commit. GitHub Actions validates the content and rebuilds the site.
6. Open the live website after the deployment succeeds. If a build fails, correct the reported field; the previous successful website remains online.

No local Terminal command or manual HTML upload is required for this routine. The save-to-publication round trip must still be verified with your actual account and repository.

## What still uses code

Wording and entries are editable through forms. Changing the page structure, adding a new kind of page, changing the relationship model, or redesigning CSS still requires a code update. The editor is a content system, not a drag-and-drop layout builder.

Dates and numbers use the site's existing formatting. The font-based wordmark text is editable; the small favicon is a separate image asset. Adding a new research category is a schema change, while renaming its displayed wording is a content edit.

## Publication and access

The initial workflow publishes successful saves to `main`. It does not provide a private staging preview or per-record student approval permissions. Before giving others editing access, decide which GitHub/CMS roles they need. Keep the repository in your account or lab organization so access is under your control.

The no-cost public-repository setup exposes source files and uploads, including draft records. Draft visibility controls the generated website, not access to repository contents. Store only material appropriate for public release.

## Install this update on your Mac

Your already-running local copy is not updated automatically by downloading this revised package.

1. Stop the current local server with Control+C.
2. Keep the existing folder as a backup. Extract the revised archive into a different folder.
3. If you have made no content changes, run `npm ci`, `npm run check`, and `npm run dev` in the newly extracted folder.
4. If you have edited content, copy your existing `content/` records and `public/uploads/` and `public/files/` into the revised project, merging the folders. Keep the new `content/page-text.json`. Preserve any existing custom `page-text.json` if you already have one.
5. Run `npm run check` before publishing. If you changed layout/code files in the original copy, merge those changes separately instead of overwriting them.

This update changes no dependency versions and does not require reinstalling Node.js.
