# Dependencies And Licenses

Read this reference when preparing the project toolchain or acquiring official CSL resources.

## Keep dependencies project-local and pinned

Do not bundle `node_modules`, downloaded repositories, or another project's caches in this Skill. Prefer an existing compatible environment. Otherwise present the exact proposed dependency and installation location, obtain required authorization, install it in the target project's tooling area, and create a lockfile.

Record the citeproc package name, exact package version, underlying processor version when exposed, source, and license. The auxiliary renderer must resolve the project-supplied module; it must not assume a path inside this Skill or another project.

## Pin normative resources per project

Obtain styles, locales, and Schema only from authoritative CSL sources unless the user explicitly approves another source. Record repository/release, commit/tag, retrieval date, relevant path, checksum when useful, and license.

Do not encode one project's style-library, locale, or Schema commit as a universal default. Do not silently update a snapshot during an active adaptation. A version change requires a recorded revalidation decision.

The scripts accept explicit project paths for style, items, scenarios, locale, output, citeproc module, RNC, Schematron, project-local Python packages, witnessed source, destination, and expected SHA-256. `render_csl.js` also requires an explicit BCP 47 language tag; do not rely on a universal locale default.

## Respect licenses and provenance

Before copying a parent or donor component, inspect its rights metadata and repository license. Preserve required attribution and compatible license terms in the resulting CSL. Do not redistribute a processor installation or official repository snapshot merely because it was locally available.

If source identity, license, or compatibility is unclear and copying would enter the deliverable, pause before reuse.
