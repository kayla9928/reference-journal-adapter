---
name: reference-journal-adapter
description: "Use when creating, adapting, or auditing a Zotero CSL journal style: collaboratively gather journal-format evidence, freeze an executable specification, select and adapt a suitable parent style, run reproducible CSL checks, and complete a minimal Zotero rendering witness. Do not use for journal selection, Zotero library management, metadata or reference fact-checking, plain-text reference conversion, manuscript editing, or unsupported from-scratch CSL construction."
---

# Reference Journal Adapter

Create an auditable Zotero CSL journal style without turning a formatting task into metadata governance or manuscript editing. This is an experimental v0.1 validated on one parent-based journal adaptation; do not claim cross-journal stability before a materially different second case passes.

## Supported routes

- Verify an exact official style against a frozen specification.
- Adapt one structural parent style with minimal changes.
- Audit an existing independent CSL as the working baseline.
- Borrow a bounded component from another style only after tracing its dependency closure, provenance, license, global-option interactions, and regression impact.

Do not construct a style from scratch or combine multiple large structural halves. If no candidate passes the hard requirements, or borrowing would replace competing macro systems or global behavior, stop with a gap report. Route any requested expansion to a separate experimental design or Skill-update task; user willingness to continue does not create an undefined construction workflow inside v0.1.

## Work in controlled stages

1. Identify the target journal, intended Zotero use, deliverable types, existing CSL, and authority/permission boundaries.
2. If the format specification is not already frozen, read [evidence acquisition and freeze](references/evidence-acquisition-and-freeze.md). Unless the current request already chooses a retrieval path, present the user with a source-acquisition choice before browsing or asking for uploads. Freeze the executable specification only after explicit user confirmation.
3. Read [parent selection and controlled borrowing](references/parent-selection-and-controlled-borrowing.md). Search a recorded official styles snapshot, apply hard gates before similarity, choose one structural owner, and preserve originals read-only.
4. Before semantic edits, read [regression and validation](references/regression-and-validation.md) and [dependencies and licenses](references/dependencies-and-licenses.md). Build fixtures, a machine oracle, comparator self-tests, and an unmodified baseline replay. Validate citation and bibliography separately.
5. Make small semantic changes in an independent working copy and rerun the full regression suite after each batch. Treat XML, Schema, Schematron, and auxiliary citeproc results as preliminary evidence only.
6. Read [Zotero witness and delivery](references/zotero-witness-and-delivery.md). Freeze a candidate, obtain the minimum user-run Zotero witness, and promote the witnessed bytes without rewriting them.

## Preserve user control

Read [human checkpoints](references/human-checkpoints.md) whenever evidence is incomplete or a decision could change the implementation, validation contract, permissions, or asset structure. Pause at least for:

- the initial choice between official-site retrieval and user-provided files, unless the user already chose explicitly;
- conflicts or unreadable evidence that could change output;
- explicit confirmation of the frozen specification;
- absence of a suitable parent or need for broad multi-style composition;
- any new dependency installation or materially expanded network access;
- the final Zotero witness or any later need to unfreeze the specification.

Between checkpoints, continue autonomously within the approved scope. Ask with a concrete recommendation, alternatives, consequences, and the smallest additional evidence needed.

## Enforce the validation boundary

Evaluate only CSL-controlled structure, formatting, conditional behavior, and actual Zotero rendering. Do not:

- verify or clean authors, titles, journal abbreviations, dates, pages, article numbers, DOI, PMID, or other bibliographic facts;
- judge where the user inserted a citation relative to manuscript punctuation;
- audit the whole Word manuscript or unlink Zotero fields;
- reopen a frozen source conflict merely because output differs from the oracle;
- hardcode around bad or missing Zotero metadata.

When a frozen rule depends on a non-obvious Zotero-to-CSL variable, request only the smallest runtime compatibility witness needed to determine whether Zotero can expose that variable.

## Keep the evidence chain

- Record source identity, version/date, authority, coverage, and unresolved limits.
- Link each material oracle assertion to Rule IDs and Source IDs.
- Record parent, donor, locale, Schema, processor, package, and repository versions plus licenses.
- Distinguish pass, known parent difference, unexpected regression, fixture/oracle suspect, and Zotero-required.
- If a frozen candidate's hash changes, treat it as a new artifact and rerun the required gates.
- Report limitations explicitly; never infer journal rules from convenience or from a single example.

Use the templates in `assets/` as project-local starting points. Use the deterministic helpers in `scripts/` only after their external paths and pinned dependencies are supplied by the target project.
