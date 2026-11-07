# ATLAS Lab website backbone

**Advancing Trustworthy Learning and Systems · Penn State**

Version 0.1.1 provides a working Astro website, shared content records, Pages CMS forms, automated checks, and a GitHub Pages deployment workflow. Content is separate from presentation, so the design can evolve without re-entering records.

## Start on your computer

1. Install [Node.js 24 LTS](https://nodejs.org/) and [Git](https://git-scm.com/).
2. Extract this archive. Open a terminal inside `atlas-lab-backbone`, the folder containing `package.json`.
3. Run:

```bash
npm ci
npm run check
npm run dev
```

Open the local URL printed in the terminal, normally `http://localhost:4321`. Press Ctrl+C to stop. No accounts or keys are needed to run locally.

## What is implemented

| Area | Behavior |
| --- | --- |
| Home | Research themes, featured projects, recent news, selected publications, thesis invitation |
| Projects | Search/filter directory and one page per published project |
| Project page | Optional research, people, publications, funding, resources, news, thesis ideas |
| People | Director, current graduate/undergraduate researchers, graduate/undergraduate alumni, collaborators on one page |
| Publications | One shared bibliography, with project and year filters |
| News | Dated announcements on one page, with project filtering; longer text expands inline |
| Opportunities | Penn State M.S. and undergraduate honors thesis ideas, linked to projects |
| About and CV | Lab introduction, director, contact, optional CV download |
| Editing | Pages CMS configuration for all collections and settings |
| Publishing | Tests and static build on changes; deploy successful main-branch builds to GitHub Pages |

There are no individual person/news pages and no standalone Funding/Resources pages. Those records are displayed in project sections. `/cv/` is a small utility page for the optional CV download.

The source contains a director record, introductory ALAASKA and CISB-Bench project records, and two **proposed thesis directions for discussion**. Review the wording before launch. The people roster, publications, news, grants, project assets, and CV are ready to populate; they have not been bulk-imported. Automated tests use isolated fictional records that never appear on the live site.

## Publish to GitHub Pages

Use a public repository for the GitHub Free route. Your content files and their Git history will be public, including records marked as drafts. Keep unpublished research data and private student information outside this repository.

1. Create an **empty public** repository, for example `atlas-lab`, in your GitHub account or lab organization. Do not initialize it with a README or another template.
2. From the extracted project directory, initialize and push the source. Replace `OWNER` and `REPOSITORY` with your actual values:

```bash
git init -b main
git add .
git commit -m "Create ATLAS Lab website backbone"
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

If Git asks for your author name/email or GitHub login, complete its normal setup. Use GitHub Desktop instead if preferred. Commit the entire source directory, including `.github/`, `.pages.yml`, `.gitignore`, and `package-lock.json`. Do not upload `node_modules/` or `dist/`.

3. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Open **Actions → Validate and publish ATLAS → Run workflow**, choosing `main`. The initial push may have run before Pages was enabled; rerun after step 3 if needed.
5. Wait for both build and deploy to succeed. Open the URL shown by the deployment or Pages settings.

A project repository normally publishes at `https://OWNER.github.io/REPOSITORY/`. A repository named `OWNER.github.io` publishes at the account root. The workflow gets the origin and path from GitHub automatically, so no hard-coded account name is required.

No custom domain, database, paid web server, or application API key is needed. GitHub plan limits and hosted-service terms still apply. The source can also build static files for a Penn State host; that would require the university's actual upload method and site path.

## Enable everyday editing

1. Visit [Pages CMS](https://app.pagescms.org/) and sign in with GitHub.
2. Install/authorize its GitHub App for this repository. An organization owner may need to approve installation.
3. Select the repository and `main` branch. The existing `.pages.yml` provides the editing forms. Do not replace it with a starter configuration.
4. Open Website text for page wording, Lab settings for lab information, or a collection such as Projects, People, Publications, News, Funding, Resources, or Thesis opportunities.
5. Create/edit a record, select related records in the reference fields, and save. Turn on **Publish on website** when ready.
6. A saved change creates a Git commit. GitHub Actions validates it and deploys the new site. Publication follows a successful build; it is not instantaneous.

For example: add one paper, choose ALAASKA and CISB-Bench under Related projects, and save. That same record supplies the Publications page and both project pages. Turn on its homepage feature flag to include it among selected publications.

Until the account is connected, `.pages.yml` is configuration rather than a working login inside the website. There is no `/admin` route or visitor login to maintain. If the hosted CMS is unavailable, the same JSON files can be edited in GitHub or locally.

## Daily tasks and checks

- [Online editing and upgrading](docs/ONLINE-EDITING.md): your controls and installing this update.
- [Editing guide](docs/EDITING.md): IDs, links, current/alumni transitions, CV updates, recovery.
- [Architecture](docs/ARCHITECTURE.md): where records live, rendering relationships, future changes.
- [Testing](docs/TESTING.md): automated checks and the first real publishing test.
- [Milestones](docs/MILESTONES.md): what is finished and what comes next.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local design/content preview |
| `npm run validate` | Check content schemas, references, dates and local assets |
| `npm test` | Unit and isolated integration tests, including a repository subpath build |
| `npm run build` | Validate and generate static files in `dist/` |
| `npm run test:built` | Check generated routes, assets, local links and anchors |
| `npm run check` | Run tests, production build, and output checks |
| `npm run preview` | Preview the generated production site |
| `npm run cms:generate` | Regenerate `.pages.yml` after changing the CMS form generator |

The initial implementation passes 17 automated tests and generates 11 pages. Counts will grow with published projects. Live GitHub deployment and an authenticated Pages CMS save remain to be tested after connecting a repository.

## Official references

- [Astro documentation](https://docs.astro.build/)
- [GitHub Pages availability and site types](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Actions publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Pages CMS setup](https://pagescms.org/docs/quick-start/)
- [Pages CMS collections](https://pagescms.org/docs/configuration/content/)
- [Pages CMS relationships](https://pagescms.org/docs/configuration/fields/reference/)

Configuration checked against official documentation on November 7, 2026.
