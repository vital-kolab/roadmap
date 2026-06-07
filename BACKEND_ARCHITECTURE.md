# ROADMAP Backend Architecture Plan

## Goal
Keep the ROADMAP public website polished and static, while routing neural hypothesis submissions, dataset submissions, and simulation requests through a secure backend that can dispatch reproducible jobs to lab or national compute infrastructure.

## Recommended stack

- **Front end:** GitHub Pages static site.
- **Backend API:** FastAPI.
- **Database:** PostgreSQL.
- **File/object storage:** S3-compatible bucket, institutional storage, or controlled shared project storage.
- **Compute:** SLURM-managed cluster access through Digital Research Alliance of Canada / Compute Canada-style infrastructure.
- **Containers:** Apptainer/Singularity runners for reproducible execution.
- **Worker:** Python job dispatcher that creates job manifests, submits jobs, polls state, and triggers benchmark/report generation.

## Core objects

1. `model_submission`
   - model name
   - model type
   - repository or package
   - container status
   - intended claim
   - known limitations
   - benchmark eligibility

2. `dataset_submission`
   - dataset title
   - data type
   - participant/species context
   - access level
   - ethics/consent constraints
   - task and measure metadata

3. `simulation_job`
   - job name
   - base model
   - task family
   - perturbation parameters
   - selected benchmarks
   - requested resources
   - output targets
   - status and audit trail

## Minimal job lifecycle

1. User submits a form.
2. API validates schema and files.
3. API creates a durable job record.
4. Dispatcher creates `job_spec.json` and `roadmap_run.sbatch`.
5. Dispatcher submits with `sbatch`.
6. Worker polls job status.
7. Results are copied to controlled storage.
8. Benchmark runner computes metrics.
9. Report generator creates model cards, evidence cards, and community-readable summaries.
10. Dashboard and email notify the submitter.

## Security rules

- Do not execute arbitrary user code on the web server.
- Use containerized model runners.
- Separate public, restricted, and internal datasets.
- Store every result with model version, data version, container hash, and benchmark code version.
- Use a human review gate before public clinical or product-facing claims.

## MVP milestones

1. Static submission UI with JSON download.
2. FastAPI endpoint that accepts JSON but does not yet dispatch jobs.
3. Database-backed registry for models, datasets, and jobs.
4. Manual SLURM job submission using generated manifests.
5. Automated SLURM dispatch and status polling.
6. Benchmark runner and report generator.
7. Public/private dashboard access.


## Community chatbot on GitHub Pages

GitHub Pages should host only the chat front end. A production ROADMAP assistant should call a secure backend API that stores consented questions, applies safety instructions, retrieves approved ROADMAP evidence records, and routes unresolved questions to the team. Do not expose LLM API keys directly in JavaScript.

Recommended production path:
1. GitHub Pages chat widget.
2. ROADMAP FastAPI endpoint: `/api/community/questions`.
3. Retrieval over approved evidence cards, dataset metadata, benchmark summaries, and glossary entries.
4. Human review queue for uncertain or sensitive answers.
5. Optional email/dashboard response to the community member.

## Benchmark dashboard

The benchmark dashboard should be the central product surface for the platform. It should join four database tables: datasets, neural hypotheses, simulation jobs, and benchmark results. Each row should link back to source evidence, access level, validation status, and translation-readiness labels. Neurotypical model simulation results should be imported from the Brain-Score collaboration workflow when available rather than duplicated inside ROADMAP.
