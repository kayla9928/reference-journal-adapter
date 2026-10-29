"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const comparator = require(path.resolve(__dirname, "..", "..", "scripts", "compare_csl_results.js"));
const renderer = require(path.resolve(__dirname, "..", "..", "scripts", "render_csl.js"));
const skillRoot = path.resolve(__dirname, "..", "..");

const baseline = {
  citation_scenarios: [{id: "C1", html: "<sup>1</sup>", plain_text: "1"}],
  bibliography_entries: [{id: "I1", ids: ["I1"], html: "<div><i>Alpha</i></div>", plain_text: "Alpha"}],
  bibliography_parameters: {line_spacing: 1}
};
const actual = JSON.parse(JSON.stringify(baseline));
actual.bibliography_parameters.line_spacing = 2;
const oracle = {
  schema_version: 1,
  catalog: {rule_ids: ["R1", "R2", "R3"], source_ids: ["S1"]},
  assertions: [
    {id: "PASS", scope: "citation", target: "C1", kind: "exact_text", expected: "1", parent_status: "pass", rule_ids: ["R1"], source_ids: ["S1"]},
    {id: "KNOWN", scope: "entry", target: "I1", kind: "contains_text", expected: "Beta", parent_status: "known_difference", rule_ids: ["R2"], source_ids: ["S1"]},
    {id: "IMPROVED", scope: "parameter", target: "line_spacing", kind: "equals", expected: 2, parent_status: "known_difference", rule_ids: ["R3"], source_ids: ["S1"]},
    {id: "ZOTERO", scope: "zotero", target: "runtime", kind: "zotero_only", parent_status: "known_difference", rule_ids: ["R3"], source_ids: ["S1"]}
  ]
};

assert.deepStrictEqual(comparator.validateOracle(oracle, actual, baseline), []);
assert.deepStrictEqual(renderer.normalizeCitationItem("I1", "C1"), {id: "I1"});
assert.deepStrictEqual(renderer.normalizeCitationItem({id: "I1", locator: "7", label: "page"}, "C1"), {id: "I1", locator: "7", label: "page"});
assert.throws(() => renderer.assertDistinctOutput("same.json", ["same.json"]), /must differ/);
assert.throws(() => comparator.assertDistinctOutput("same.json", ["same.json"]), /must differ/);
if (process.platform === "win32") {
  assert.throws(() => renderer.assertDistinctOutput("SAME.JSON", ["same.json"]), /must differ/);
  assert.throws(() => comparator.assertDistinctOutput("SAME.JSON", ["same.json"]), /must differ/);
}
const emptyOracle = JSON.parse(fs.readFileSync(path.join(skillRoot, "assets", "oracle-template.json"), "utf8"));
const emptyScenarios = JSON.parse(fs.readFileSync(path.join(skillRoot, "assets", "citation-scenarios-template.json"), "utf8"));
assert.ok(comparator.validateOracle(emptyOracle, {citation_scenarios: [], bibliography_entries: [], bibliography_parameters: {}}, {citation_scenarios: [], bibliography_entries: [], bibliography_parameters: {}}).some((issue) => issue.includes("at least one assertion")));
assert.ok(Array.isArray(emptyScenarios.number_assignment_order) && Array.isArray(emptyScenarios.scenarios));
const missingEvidence = JSON.parse(JSON.stringify(oracle));
delete missingEvidence.assertions[0].rule_ids;
delete missingEvidence.assertions[0].source_ids;
const missingEvidenceIssues = comparator.validateOracle(missingEvidence, actual, baseline);
assert.ok(missingEvidenceIssues.some((issue) => issue.includes("rule_ids must be a nonempty array")));
assert.ok(missingEvidenceIssues.some((issue) => issue.includes("source_ids must be a nonempty array")));
const actualIndex = comparator.indexResult(actual);
const baselineIndex = comparator.indexResult(baseline);
for (const assertion of oracle.assertions) {
  const classification = comparator.classify(assertion, comparator.evaluate(assertion, actualIndex), comparator.evaluate(assertion, baselineIndex));
  if (assertion.id === "PASS") assert.strictEqual(classification, "pass");
  if (assertion.id === "KNOWN") assert.strictEqual(classification, "known-parent-difference");
  if (assertion.id === "IMPROVED") assert.strictEqual(classification, "pass");
  if (assertion.id === "ZOTERO") assert.strictEqual(classification, "zotero-required");
}

const regressed = JSON.parse(JSON.stringify(actual));
regressed.citation_scenarios[0].plain_text = "9";
assert.strictEqual(
  comparator.classify(oracle.assertions[0], comparator.evaluate(oracle.assertions[0], comparator.indexResult(regressed)), comparator.evaluate(oracle.assertions[0], baselineIndex)),
  "unexpected-regression"
);
const corruptBaseline = JSON.parse(JSON.stringify(baseline));
corruptBaseline.citation_scenarios[0].plain_text = "9";
assert.strictEqual(
  comparator.classify(oracle.assertions[0], comparator.evaluate(oracle.assertions[0], comparator.indexResult(regressed)), comparator.evaluate(oracle.assertions[0], comparator.indexResult(corruptBaseline))),
  "fixture-or-expectation-suspect"
);

console.log("PASS: comparator classifications and oracle integrity");
