# How the backbone works

Astro generates static HTML from validated JSON records. Visitors need no database connection or login. A small browser script enhances search/filter controls; without JavaScript, the full listings remain readable. Pages CMS is an external editor for the Git repository, not the website host.

## Content map

| Location | Owns | Relationships |
| --- | --- | --- |
| `content/page-text.json` | Visible page wording, headings, navigation and shared labels | Stable text keys, separate from URLs |
| `content/site.json` | Lab copy, contact, CV, homepage limits | Director ID |
| `content/projects/` | Research projects and stable URLs | Other records point here |
| `content/people/` | Current researchers and alumni | Project participation with roles/dates |
| `content/publications/` | Bibliographic records | Many projects; optional person links for authors |
| `content/news/` | Dated announcements | Many projects, people, publications, awards |
| `content/funding/` | Awards and support | Many projects |
| `content/resources/` | Code, data, demos and other links | Many projects |
| `content/opportunities/` | Proposed thesis directions | One or more projects |
| `public/uploads/` | CMS-uploaded public files | Referenced by `/uploads/filename` |
| `public/files/` | Optional manually managed public files | Referenced by `/files/filename` |

IDs, rather than titles or array positions, connect records. Renaming a project's title updates its links everywhere without rewriting other records. Author display names are explicit bibliographic values and preserve citation spelling independently of profile edits.

## Code map

| Location | Responsibility |
| --- | --- |
| `src/lib/page-text.mjs` | Website-text field definitions, defaults and validation schema |
| `src/lib/content.mjs` | Schemas, graph validation, public-only selection and related content |
| `src/lib/site.mjs` | Loaded content, deployment-aware paths and contact links |
| `src/pages/` | Page composition and project route generation |
| `src/components/` | Reusable content records and filter controls |
| `src/layouts/Layout.astro` | Header, navigation, footer and metadata |
| `src/styles/site.css` | Colors, typography, spacing and responsive layout |
| `scripts/generate-cms.mjs` | Editable form definitions; generates `.pages.yml` |
| `scripts/validate.mjs` | Pre-build content validation |
| `scripts/check-built.mjs` | Post-build routes, assets, links, anchors, basic page structure |
| `tests/` | Content behavior and isolated populated-site builds |
| `.github/workflows/deploy.yml` | Install, test, build, inspect, upload, deploy |

Change a visual component or stylesheet to redesign the site. Change the content schema, CMS generator, and corresponding tests together when introducing a new field. The test suite checks form field coverage so the CMS and content schema do not drift silently.

## Publishing lifecycle

An editor's save creates a Git commit. The workflow installs the lockfile versions, tests the content model, validates real content, generates static pages, and checks internal links. Only a successful main-branch build reaches the deployment job. Pull requests run checks without publishing. GitHub retains the previous published version if a new build fails.

`SITE_URL` supplies the host origin. `BASE_PATH` supplies the repository path. The workflow reads both from GitHub Pages. Local commands default to `/`. All generated internal links and uploads use the same path helper; integration tests also build under `/atlas-lab/`.

There is no scheduled publication job. Future-dated entries are not automatically held back; use the publish toggle when ready. Alumni positions, project completion, and opportunity availability are editorial updates, not automatically inferred facts.

The development command uses Astro's `--ignore-lock` option to stay in the foreground, including in automated preview environments. The process that launches it owns its lifecycle; use Ctrl+C locally. Host and port remain configurable through normal CLI arguments.

## Scope and growth

This structure is intended for a research lab's projects, people, papers, and announcements. Static hosting handles visitor traffic without an application server. Large media should be linked from appropriate external repositories; bulk datasets and videos do not belong in the website source.

Filtering currently loads all listed records into the page. If the collection grows into many thousands of entries, add pagination or a generated search index. The data layout can remain the same. Neither unlimited hosting nor zero future maintenance is promised: periodically review dependencies, backups, public records, and service limits.

The design uses system font fallbacks plus optional Google Fonts, with no tracking or analytics code. Removing the CSS font import makes typography fully local. No Penn State logo asset is included. The text identity can be refined with approved university branding later.

The account-backed deployment and actual CMS commit round trip cannot be verified until a GitHub repository and authorized editor account are connected.
