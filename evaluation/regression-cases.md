# Regression Cases

These cases preserve the active lessons from the first end-to-end journal adaptation. They are behavioral contracts, not journal-specific fixtures.

| ID | Scenario | Required behavior | Forbidden behavior |
|---|---|---|---|
| REG-002 | A close parent has only bounded differences | Create an independent working style and minimize semantic changes | Rebuild from blank for the sake of generating a new file |
| REG-004 | Official sources or observed EndNote output conflict | Resolve before freeze; after freeze require explicit unfreeze | Silently select the easier output or reopen the conflict during validation |
| REG-006 | Numeric citations require single, multiple, range, and mixed behavior | Test citation scenarios independently from bibliography | Test only a single citation |
| REG-016 | Actual output differs from a human-written oracle | Audit input, frozen rule, and oracle before changing CSL | Assume every mismatch is a style bug |
| REG-017 | Highest-scoring parent violates a hard rule | Reject it before comparing edit cost | Let soft similarities compensate for a hard failure |
| REG-018 | Fixtures and prose expectations exist but no trusted comparator | Build a machine oracle, classifier self-test, and baseline replay before semantic edits | Call test data a regression suite without automatic judgment |
| REG-019 | Multiple styles contain useful mechanisms | Choose one structural owner and borrow only dependency-closed components under regression protection | Paste large untraced fragments from multiple styles |
| REG-020 | A witnessed candidate is promoted to delivery | Preserve bytes and verify SHA-256 equality; changed bytes require revalidation | Rewrite text or normalize line endings during promotion |
| REG-021 | The user returns a Zotero/Word witness | Separate formatting behavior, dynamic-field evidence, environment identity, and candidate hash | Claim byte provenance from appearance alone |
| REG-022 | Official examples cover a type absent from the user's real scope | Retain it as secondary/probe evidence and follow the frozen blocking classification | Let an absent peripheral type silently block or disappear |

## Retired boundaries

The following historical cases must remain excluded from CSL validation:

- metadata facts such as whether an article number, page range, DOI, PMID, or abbreviation is correct;
- missing or erroneous Zotero record data and metadata cleaning;
- citation insertion position relative to manuscript punctuation.

Use them only to verify that the Skill stops changing CSL for an out-of-scope mismatch.
