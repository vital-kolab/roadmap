# ROADMAP GitHub Pages Prototype

This package contains a public-facing ROADMAP platform prototype.

## Main updates

- Landing page now presents ROADMAP as a concrete platform for neural hypothesis submission, data submission, evidence review, and community feedback.
- Four central portals are included: clinicians, human researchers, model developers, and community members.
- Public-facing copy avoids internal design instructions and instead explains what users can actually do on the platform.
- Community portal includes question and feedback intake language without presenting accessibility principles as public marketing copy.
- Forms are static prototypes and should be connected to GitHub Issues, REDCap, Google Forms, OSF, Dataverse, or institutional systems before launch.

## Deploy

Upload the contents of this folder to your GitHub Pages repository root.


## June 2026 visual refresh
- richer landing-page graphics and simulation showcase
- clearer four-portal landing page
- dedicated simulation workflow page with Compute Canada / Alliance recommendations


## Premium platform update
- polished landing page with richer visual hero and platform metrics
- production-style submission center for models, datasets, and simulation jobs
- backend architecture page and Markdown implementation plan for SLURM/Alliance-style compute dispatch


## ROADMAP benchmark/chatbot update
- Changed model submission language to neural hypothesis submission for animal-model researchers.
- Added a community-facing Ask ROADMAP static chatbot prototype.
- Added a benchmark dashboard page showing datasets, neural hypotheses, model/simulation benchmarking status, and translation-readiness cards.
- Added Brain-Score collaboration framing for neurotypical model simulations.


## Live submission endpoints

The `submissions.html` page now posts active ROADMAP submissions to Formspree:

- Neural hypothesis submission: `https://formspree.io/f/mrewzdrk`
- Behavior submission: `https://formspree.io/f/mdarnjyp`

The simulation job tab remains a static mock request until a ROADMAP backend/compute queue is connected.


## Knowledge User Hub
Added `knowledge-hub.html`, a page for translating benchmark-supported ROADMAP evidence into reviewed tools, explanations, evidence cards, task aids, and deployable prototypes.
