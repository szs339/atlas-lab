# Publication import — November 8, 2026

The initial bibliography uses the publication and preprint sections of Suman Saha's `Saha_CV-7.pdf`, uploaded November 7, 2026. The CV itself is not included in this repository. Its separately listed poster and oral presentations are outside this import.

## Scope and editing

- 40 records: 22 conference papers, 3 workshop papers, 4 journal articles, and 11 preprints.
- All records are visible on the Publications page (`published: true`). Scholarly publication status is a separate field; four recent accepted papers retain `status: "accepted"`.
- Every record has `featured: false`. Homepage selection is deferred to the lab director.
- Project associations are empty pending an explicit mapping to the lab's project records.
- Edit records in Pages CMS → Publications. To feature a paper later, enable **Feature on homepage**. The homepage publication limit is in Lab settings.
- Stable IDs identify records, including when their titles or publication status change. Update an existing record when a preprint becomes a published version; do not add an identical second entry.

## Verification and sources

Titles and author lists were compared with publisher-deposited Crossref metadata, official proceedings, conference pages, and arXiv records where available. A matching title alone was not enough to accept a DOI: authors and venue were also checked. The DOI links in the records identify the matched publications. The 11 CV preprints were checked against the arXiv API by their exact identifiers and have arXiv landing-page and PDF links.

Nineteen records have verified publication DOIs. Other records use verified paper, proceedings, author, or conference links where available. Missing links remain empty. No PDF is copied into the public repository; full-text links point to externally hosted copies.

### Material differences from the CV

| Record | Import decision and source |
| --- | --- |
| Scheduled Partial-Credit RL | Restored “Scheduled” at the start of the published title. [LCTES DOI](https://doi.org/10.1145/3814943.3816167). |
| Reference-Free Schema Generation | Used the ACL proceedings citation and pages 1253–1261. [ACL Anthology](https://aclanthology.org/2026.acl-srw.111/). |
| Designing Guided AI Systems | Used publisher author order: Mahfuza Farooque, Veer Amish Shah, Nikhil Khattar, Sinjoy Saha, Suman Saha. This differs from the CV's order. [ASEE citation](https://peer.asee.org/58677). |
| Next-Gen Education | Included Sri Krishna Chaitanya Velamakanni, omitted from this CV entry, and used William J. Rothwell as shown in the paper. [Publisher PDF](https://peer.asee.org/next-gen-education-enhancing-ai-for-microlearning.pdf). |
| Leveraging LLM | Restored the final word “Detection” in the title. Attached the preprint to the workshop entry instead of making a duplicate publication. [WiseML DOI](https://doi.org/10.1145/3733965.3733969), [arXiv](https://arxiv.org/abs/2504.21045). |
| CS-Mixer | Used the full published title with “Multilayer Perceptron,” volume 5, issue 10, pages 4915–4927. [IEEE DOI](https://doi.org/10.1109/TAI.2024.3415551). |
| Stock Price Trend Prediction | Corrected the venue to ICTELS 2024, pages 29–51, based on the paper's printed citation. [Official proceedings](https://www.istes.org/storage/01JFNCRCH63JN2QYWNGJHK42Y8.pdf). |
| Predicting Boolean Satisfiability | Used “Using a Graph Neural Network” and “Arya Keni” from the paper, removing the duplicated surname in the CV. Pages 67–80. [Official proceedings](https://istes.org/seeder/books/files/4a9002cabd20c85b5e87a013a0215476.pdf). |
| Faults in Linux 2.6 | Used the published order with Gilles Muller before Julia Lawall, and restored author-name diacritics. [Penn State publication record](https://pure.psu.edu/en/publications/faults-in-linux-26/), [ACM DOI](https://doi.org/10.1145/2619090). |
| Faults in Linux: Ten Years Later | Used the ASPLOS proceedings DOI, rather than the separate SIGPLAN Notices reprint. [Authors' research page](https://faultlinux.inria.fr/). |
| Finding Resource-Release Omission Faults | Used the OSR journal DOI matching the CV venue, not the PLOS workshop DOI. Retained the 2011 issue year, volume 45(3), although Crossref records January 11, 2012 as the online/publication date. [OSR DOI](https://doi.org/10.1145/2094091.2094094), [PLOS issue context](https://ess.cs.uni-osnabrueck.de/workshops/plos/2011/program.shtml). |

The FIE work-in-progress titles retain their WIP labels, consistent with the [Penn State directory](https://engr.psu.edu/directory/directory-detail-g.aspx?q=szs339) and the publisher record for the 2025 faculty-perspectives paper.

### Entries needing later enrichment

- MCP-Based LLM Agents and the two accepted FIE 2026 papers have no verified paper URL or DOI yet; their bibliographic entries remain available without a placeholder link.
- The 2012 DOM-based XSS paper retains the CV's title, authors, year, and ISA venue. A [coauthor's bibliography](https://doggzone.github.io/home/research.html) names a different conference. The venue should be checked against an original proceedings copy before changing it; no uncertain DOI or paper link was added.
- SecureCodeRL and Scheduled Partial-Credit RL have related subject matter, but the CV lists them separately and the checked arXiv record does not identify the LCTES paper as its published version. They remain separate, clearly labeled records pending author confirmation.
- Workshop and journal entries with available preprints link those versions within the same record. Whole proceedings PDFs are labeled **Proceedings (PDF)** to distinguish them from individual paper PDFs.

No design, layout, homepage selection, or other content collection is changed by this import.
