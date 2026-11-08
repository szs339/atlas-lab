# Everyday editing

Start with the Pages CMS setup in the README. Each form edits one JSON file. You can perform the same edits directly in `content/`.

## Edit page wording

Open **Website text** to change headings, descriptions, navigation labels, button text, research-area wording, and messages. Fields are grouped by page. Changes preserve the existing URLs and data relationships. Lab settings separately controls the lab introduction/about body, email, CV, opportunities introduction and inquiry instructions. See [Online editing](ONLINE-EDITING.md) for the complete map.

## Rules that keep updates simple

- Give each record a permanent lowercase ID, such as `student-name` or `paper-short-name-2026`. Its filename must be that ID plus `.json`. Do not change the ID when changing a name, title, or role.
- Keep a project's URL name (`slug`) stable. Changing it changes the address; automatic redirects are not implemented.
- Select related records using the CMS reference fields. An item can belong to several projects.
- Dates use `YYYY-MM-DD`. Leave unknown optional dates blank.
- Save as a draft while preparing public-facing content. Drafts are excluded from generated pages, but their repository files and uploads are still public. A draft flag is not a confidentiality control.
- Plain-text paragraphs support line breaks. HTML and Markdown are not rendered in these fields. Use link fields for links.
- IDs/references, dates, required values, missing files, and image descriptions are checked before deployment. If validation fails, the existing published website remains in place.

## Add a project

1. Choose Projects → New. Enter ID, URL name, title, summary, research theme, and active/completed status.
2. Add the optional expanded name, research overview, image with alternative text, and external links.
3. Turn on the homepage feature flag if desired.
4. Publish and save. The project directory and `/projects/URL-NAME/` page are generated automatically.
5. Link people, papers, news, funding, resources, and thesis ideas from their own records. Empty project sections disappear automatically.

Create a project before other records refer to it. You may link drafts, but draft projects will not have public links or pages. Link an opportunity to at least one published project before making it public.

## Add or update a person

1. Enter name, role, category (graduate/undergraduate/etc.), and current/alumni membership status.
2. Add the program, brief biography, dates, public profile links, and an optional photograph with alternative text. Use **Involvement period (semesters or years)** for a period such as `Fall 2025 – Spring 2026` when exact dates are unknown; it replaces the displayed Joined/Left dates.
3. Add project participation entries: project, role, and optional actual start/end dates. Leave the end date blank while participation continues.
4. Publish and save.

When someone leaves, update the existing record to alumni, enter the actual end date, and add a publicly confirmed current position if known. Keep the ID and project participation entries. Their research associations remain intact. Position and position-verification date can be updated later; an unknown position may stay blank.

On project pages, alumni and people whose project participation has ended appear as former contributors. A person may finish a project while remaining a current lab member. The participation end date expresses that distinction.

## Add a paper

Enter the title, year, venue, type, and scholarly status. Add authors in citation order, using names as published. Linking an author to a lab member is optional; external coauthors do not need People records. Select all relevant projects.

The DOI field expects an identifier such as `10.1234/example`, not a DOI URL. A PDF upload and publication URL are optional. The website's publish toggle controls visibility separately from preprint/accepted/published scholarly status. Enable the homepage feature flag to show a paper among selected publications.

## Add news

Enter a headline, date, and announcement. Choose related projects and optionally people, papers, or grants. Project associations control placement on project pages. People and paper references create inline links; funding references are retained as structured associations. Use an external link for an award announcement when appropriate.

The News page shows all published announcements. Short announcements appear in full; longer announcements expand inline. There is no separate news-item route. Enable **Feature on homepage** for news you want on the homepage. Featured items appear newest first, up to the Homepage news items limit in Lab settings. Items with this setting off remain available on the News page and any linked project pages.

## Record funding and resources

Funding entries contain sponsor, award title/number, investigators, dates, and relevant projects. An amount is optional. When entered, explain whether it is the total award, Penn State allocation, or another figure. Use actual awarded funding; proposal plans are not awards.

Use **Award period (months, semesters, or years)** when the source gives a period such as September 2026 – August 2028 or Spring 2027. This text takes precedence over the displayed start/end dates, so exact days need not be invented. **Program and support details** can identify the grant program, describe stipend or tuition support, or distinguish student awards and sponsored research support from PI/Co-PI grants. Leave undisclosed amounts blank, and link an award only to projects it supports.

Resources contain a title, type, link, description, and relevant projects. They may point to code, a dataset, documentation, demo, or an uploaded file. Funding and resources are shown only within linked project pages.

## Add a thesis idea

Enter a research question, possible contribution/scope, useful background, and eligible pathways (M.S., undergraduate honors, or both). Related projects are optional: leave them empty for broad research ideas without a named project. Only linked ideas appear on project pages, and the project filter appears when there are linked projects to choose from. Search covers the full idea, including its possible contribution. Availability means:

- **Discuss an idea:** a starting point to scope with a student.
- **Open for inquiries:** currently accepting inquiries about this direction.
- **Closed:** hidden from opportunity lists and project thesis sections while retaining the record.

These labels do not imply funded assistantships, university admission, or automatic thesis approval. The contact button opens the student's email client with a project-specific subject. No application database is needed.

## Replace the public CV

In Lab settings, upload/select the PDF in the Public CV field and save. It will be stored under `public/uploads/`; the About and CV utility pages then expose the download. A new PDF can replace the selected document without editing a layout. Upload only the version intended for public release.

## Fix a failed update or recover an earlier version

Open the latest GitHub Actions run and read the failed validation/build step. Typical errors name the collection and ID, such as an unknown project reference or a missing upload. Correct the record in the CMS and save again. A failure does not replace the last successful deployment.

For a broader rollback, use GitHub's commit history or Git to revert the content-changing commit, then push the revert. Do not overwrite unrelated newer changes. The resulting successful build redeploys the restored content.

Prefer unpublishing a record to deleting it. Deleting a referenced record is blocked by validation until every reference is deliberately removed. Uploads are separate files; unpublishing a record does not remove its uploaded assets from the public site or Git history.

## Collaborators and approvals

Start with the director as editor. Configure GitHub repository access and CMS authorization intentionally before inviting students. The current setup publishes successful saves to `main`; it does not implement record-specific permissions or a separate approval queue. To require review, use branches and pull requests and test that workflow with the editor accounts before depending on it.
