# Zotero Witness And Delivery

Read this reference after all local and auxiliary gates pass.

## Freeze a candidate

Copy the working CSL into a witness area without text normalization, compute SHA-256, record style ID and title, and rerun all established gates against that exact copy. Give the user only the frozen candidate and a project-specific witness sheet derived from `assets/zotero-witness-template.md`.

## Request one minimal user witness

Ask for the Zotero version, candidate SHA-256 confirmation, style identity, citation and bibliography observations tied to frozen rules, and screenshots or copied output sufficient to inspect formatting. Use existing records where possible; do not ask the user to alter metadata merely to populate a missing branch. Mark unavailable secondary cases N/A and retain the limitation.

If a frozen rule depends on a non-obvious Zotero-to-CSL variable, request only the smallest record or field observation needed to prove runtime compatibility.

DOCX/OOXML inspection is optional. Use it only when the user returns a Word witness or explicitly requests confirmation of dynamic Zotero fields. Inspect a copy read-only; do not unlink fields, review manuscript-wide compliance, judge citation placement, or fact-check embedded item data.

## Diagnose witness mismatches

Locate the responsible layer: fixture/oracle, CSL, Zotero processor mapping, metadata fact, or document placement. Repair CSL only for CSL-controlled failures. A metadata or insertion-location mismatch is out of scope and must not be hidden with style-specific hardcoding.

If a CSL fix is needed, freeze a new candidate and request only the affected Zotero retest plus coupled behavior that could regress.

## Promote witnessed bytes

Use `scripts/promote_verified_artifact.py` or another demonstrably byte-preserving operation. Require the witnessed source hash, refuse a different existing destination, and verify destination hash equality. If any byte changes, treat the result as a new artifact and rerun required gates.

Deliver the installable CSL with source/parent/donor attribution, license information, frozen specification identity, processor/locale/Schema identities, validation summary, Zotero witness evidence, final SHA-256, and known limitations.
