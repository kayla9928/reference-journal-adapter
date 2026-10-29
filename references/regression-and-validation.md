# Regression And Validation

Read this reference before any semantic CSL edit or when diagnosing an output mismatch.

## Build the contract before editing

Create controlled CSL-JSON items from the frozen rules and actual type scope. Cover material boundaries and conditional branches; do not reuse one journal's author threshold, identifiers, punctuation, or fixed item count as a universal suite.

Create citation scenarios independently from bibliography fixtures. Include single, multiple, range/collapse, sorting, disambiguation, or locator behavior only when required by the frozen specification.

Copy `assets/oracle-template.json` and record assertions for exact/contained plain text, semantic rich-text tags, absence invariants, layout parameters, and Zotero-only observations. Every material assertion should cite Rule IDs and Source IDs. Self-test the comparator's result categories before trusting it.

### JSON contract

`oracle-template.json` has these required surfaces. The distributed empty array is a copyable starting template, not a valid completed oracle; executable comparison must reject it until at least one evidence-linked assertion is present.

- `schema_version`: currently `1`.
- `catalog.rule_ids` and `catalog.source_ids`: the complete allowed identifiers referenced by assertions.
- `assertions`: an array of assertion objects.

Each assertion requires a unique `id`, `scope`, `kind`, `rule_ids`, and `source_ids`. Non-Zotero assertions also require `target`, `expected`, and `parent_status` (`pass` or `known_difference`). Supported scopes are `citation`, `entry`, `parameter`, and `zotero`. Supported kinds are `exact_text`, `contains_text`, `not_contains_text`, `html_tag_contains`, `not_html_tag_contains`, `equals`, and `zotero_only`. HTML tag assertions also require `tag`; row-field `equals` may use `field`. Adapt IDs, targets, expectations, gates, and evidence links for each project; keep `schema_version` and vocabulary exact unless the scripts are updated and retested.

`citation-scenarios-template.json` requires `schema_version`, `number_assignment_order`, and `scenarios`. `number_assignment_order` contains every controlled fixture ID once. Each scenario has a unique `id` and an `items` array. An item may be a fixture ID or a citeproc citation-item object with `id` and evidence-required properties such as `locator`, `label`, `prefix`, `suffix`, `suppress-author`, or `author-only`. Scenario selection and values must come from the frozen specification, not from this schema description.

## Replay the unmodified baseline

Render the structural parent or audit baseline with a pinned auxiliary processor and official pinned locale. Record citation and bibliography separately, including rich-text output and layout parameters. Classify each oracle assertion as parent pass or known parent difference before editing.

Do not begin semantic modification until the fixtures, oracle, comparator, and baseline can reproduce known inherited behavior without integrity errors.

## Make causal edits

Apply small coherent changes and run the full suite after each batch. A regression is a previously passing baseline assertion that now fails. Improvement of an inherited known difference is not a regression. Compare rich-text semantics rather than irrelevant serializer changes.

When actual differs from expected, inspect controlled input, oracle/frozen rule, CSL logic, processor mapping, then out-of-scope document placement or metadata facts. Do not change CSL to mask a bad record or change the oracle merely to match actual output.

## Required gates

- well-formed XML and applicable official CSL RELAX NG and Schematron validation;
- logical review of macros, variables, affixes, delimiters, sorting, and type branches;
- fixture/oracle integrity and comparator self-test;
- auxiliary baseline and working regression with recorded processor, locale, and versions;
- final actual Zotero rendering of the frozen candidate.

Schema and auxiliary processor PASS are preliminary. Zotero-only assertions remain pending until the user witness. Missing secondary types may be non-blocking only when the frozen delivery scope says so; retain their limitation.

## Standard classifications

- `pass`: the current output satisfies the assertion.
- `known-parent-difference`: the parent already failed and the current output still fails.
- `unexpected-regression`: a parent-pass assertion now fails.
- `fixture-or-expectation-suspect`: the test contract or baseline premise is inconsistent or unsupported.
- `zotero-required`: the assertion cannot be closed by the auxiliary processor.
