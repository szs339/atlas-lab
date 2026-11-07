# Validation and acceptance

Run `npm run check` before pushing implementation changes. Everyday CMS saves trigger equivalent checks in GitHub Actions.

## Automated coverage

The current suite contains 17 tests, including an integration test that builds a populated site at `/` and `/atlas-lab/`. Fictional data lives only in temporary test directories, so it cannot be mistaken for actual lab accomplishments.

The suite verifies shared records across projects, draft exclusion, alumni transitions, ordered authors including external collaborators, chronological news, dates, missing references, duplicate IDs/slugs, repeated relationships, safe URLs, image descriptions, explicit award amounts, blank CMS values, uploaded-file existence, and CMS/schema field alignment.

The generated-site checker verifies expected routes, a single main heading per page, language and description metadata, unique HTML IDs, local assets, internal links, and section anchors. It rejects unexpected detail pages and stale draft project routes. It does not make requests to every external link or guarantee third-party availability.

These tests use fixed synthetic content for behavior checks and separately validate actual editable records. Adding real projects, people, or papers does not require changing expected fixture counts.

## First account-connected acceptance test

After publishing the repository and connecting Pages CMS:

1. Confirm the homepage loads at the actual GitHub Pages URL, with styled pages and working navigation.
2. Open a project in the CMS; confirm the JSON filename, ID, and reference fields load correctly.
3. Make a small genuine content edit and save it. Confirm a commit, successful workflow, and updated site.
4. Add a real publication linked to two projects. Confirm one citation on the Publications page and its appearance on both projects. Edit it once and verify both update.
5. Upload the intended public CV. Confirm the PDF download works under the repository URL.
6. Verify the editor's draft toggle excludes a record from the generated site. Remember that the source file is still public.
7. When an actual student moves to alumni, update the existing record and confirm their project links remain.

Avoid publishing fictional people, grants, or publications just to test the production site. Use a separate test branch or local fixture builds for those cases.

## Manual browser review

- Check navigation, project details, opportunities, current/alumni grouping, empty states, and CV behavior.
- Search and filter projects, people, publications, news, and thesis ideas. Verify zero results and Reset.
- Check a narrow viewport for horizontal overflow and readable controls.
- Navigate with the keyboard; verify visible focus and the Skip to content link.
- Check representative images, long titles, and many author names after adding actual content.

This is a practical baseline, not a full accessibility certification or load-test claim.

## Initial verification record — November 7, 2026

All 15 automated tests passed, including populated fixture builds at both deployment paths. The real starter content generated 11 pages with no broken local links or anchors.

A desktop browser review verified the homepage and project layout, navigation to project/People/Opportunities pages, project area filtering, search with zero results, Reset, People category filtering, and opportunity filtering by project. The mailto inquiry links contained the intended subject and public contact address; no email was sent.

Mobile-device testing, a complete keyboard/accessibility audit, production GitHub deployment, and authenticated CMS editing remain part of the next acceptance pass.

## Website text update

The expanded suite checks website-text field validation and complete CMS form coverage. The populated fixture build changes a homepage heading, navigation label, research-area wording, and result label, then verifies the output at both root and repository paths. It also verifies that HTML-looking text is escaped and that stable category IDs and routes remain intact.

After this update, a desktop browser check confirmed the homepage presentation and live search result counts, including Reset. The account-connected Pages CMS save remains unverified.
