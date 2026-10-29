# Reference Journal Adapter

**No usable Zotero style for your target journal? Adapt and validate an installable CSL file against the journal’s requirements.**

When preparing a submission, you may find that the journal provides only an EndNote style, or that its style is missing from the Zotero Style Repository. Authors who manage references in Zotero need a compatible CSL style to insert citations, update numbering, and generate a bibliography in the required format.

`reference-journal-adapter` helps confirm formatting requirements, select a suitable existing style, adapt it, and verify the results through output checks and actual Zotero rendering. The result is an installable CSL file with supporting records for future maintenance.

> 🎯 Identify the journal → 📋 Confirm requirements → 🛠️ Adapt the style → 🔎 Check the output → 📦 Install and use

**English · [简体中文](README-ZH.md)**

## 📑 Contents

- [What it helps you do](#what-it-helps-you-do)
- [Example: adapting a Zotero style for JCTH](#example-adapting-a-zotero-style-for-jcth)
- [Installation and first use](#installation-and-first-use)
- [Start with your task](#start-with-your-task)
- [How an adaptation works](#how-an-adaptation-works)
- [What you receive](#what-you-receive)
- [Tools and further reading](#tools-and-further-reading)
- [License and attribution](#csl-example-license-and-attribution)

<a id="what-it-helps-you-do"></a>

## ✨ What it helps you do

**The primary use is adapting a CSL file for a target journal that lacks a usable Zotero style.** The Skill also helps check and revise existing styles.

| Your situation | How the Skill helps |
|---|---|
| **The journal provides only an EndNote style** | Uses its observable output together with journal requirements to guide a CSL adaptation for Zotero |
| **The journal is missing from the Zotero Style Repository** | Finds a suitable parent style, adapts it to the target requirements, and checks the result |
| **A similar style exists, but some details differ** | Adjusts specific differences in authors, punctuation, page ranges, DOI/PMID output, and other formatting |
| **An existing CSL produces incorrect formatting** | Locates the issue, proposes changes, and checks the revised output |
| **A matching style exists, and you want to confirm its suitability** | Checks in-text citations and bibliography entries against the journal’s requirements |

### Why use this Skill?

A small CSL change can affect several output branches. Adding PMID output, for example, also requires checking punctuation when a record has only a DOI, only a PMID, or neither. Changing author truncation requires comparing records with different numbers of authors.

This Skill organizes adaptation into a workflow that can be checked step by step:

- **Requirements have sources:** important formatting choices are linked to journal materials, with conflicting instructions resolved before implementation.
- **Changes build on a suitable foundation:** a parent style is selected for its behavior, and edits focus on the differences that matter.
- **Results can be compared:** before-and-after output is retained to check intended changes and related behavior.
- **Deliverables remain traceable:** the CSL file comes with validation records and attribution to support installation and maintenance.

<a id="example-adapting-a-zotero-style-for-jcth"></a>

## 🔬 Example: adapting a Zotero style for JCTH

This example adapts **Taylor & Francis AMA** to the formatting requirements of the **Journal of Clinical and Translational Hepatology (JCTH)**, producing a CSL file for use in Zotero.

### See the change

The following processor outputs use the same controlled test record.

**Before**

[1] Alpha A. Controlled article with both identifiers. *J Delib Long Med*. 2024;12(3):101-109. doi:10.1234/JCTH.TEST.001

**After**

[1] Alpha A. Controlled article with both identifiers. J Delib Long Med 2024;12(3):101–109. doi: 10.1234/JCTH.TEST.001, PMID: 90000001.

This result shows changes to journal-title styling, punctuation, the page-range delimiter, and DOI/PMID output.

The example also covers:

| Area | Adapted behavior |
|---|---|
| In-text citations | Superscript numbers, numeric sorting, comma separation, and consecutive-number collapsing |
| Author lists | All authors through six; the first six followed by italic *et al.* when there are more than six |
| Identifiers | Separate handling for DOI+PMID, DOI only, PMID only, and neither |
| Reference types | Type-specific fields and punctuation for journal articles, books, chapters, and other entries |
| Bibliography layout | `[n]` numbering, hanging alignment, and double spacing |

### Validation and use

The adapted CSL has undergone structural checks and citation and bibliography output comparisons. The example also preserves a record of actual Zotero/Word rendering, covering superscript citations, bibliography numbering, hanging alignment, double spacing, and author truncation.

The example files include the parent style, adapted CSL, controlled test records, and validation notes. You can inspect the changes or follow the instructions to replay the checks.

📂 **[Explore the full example and validation records](examples/jcth/case.md)**  
📄 **[View the adapted CSL](examples/jcth/adapted.csl)**  
🔎 **[Read the Zotero rendering summary](examples/jcth/zotero-witness.md)**

<a id="installation-and-first-use"></a>

## 🚀 Installation and first use

### 1. Install the Skill

Place the complete folder containing `SKILL.md` in your personal Skills directory:

```text
~/.agents/skills/reference-journal-adapter/
```

Windows path example:

```text
C:\Users\<username>\.agents\skills\reference-journal-adapter\
```

Codex automatically discovers Skills in this directory. If the Skill does not appear, restart Codex. See the [official OpenAI Skills documentation](https://learn.chatgpt.com/docs/build-skills).

### 2. Gather your materials

Start with what you already have:

| Material | What you can provide |
|---|---|
| Target journal | Journal name, website, or author-guidelines link |
| Formatting evidence | Reference requirements, submission templates, sample entries, or an EndNote style |
| Existing style | Your current CSL or a candidate with similar formatting |
| Scope | The reference types you need and the main formatting issues to resolve |

You can ask the assistant to retrieve official materials, provide local files, or combine both approaches. The assistant will propose an acquisition plan for the task.

### 3. Start your first collaboration

```text
Use $reference-journal-adapter to prepare a Zotero CSL style
for the following journal.

Target journal:
…

Current situation:
The journal provides only an EndNote style.
I could not find a matching style in the Zotero Style Repository.

Source acquisition:
Start with the journal’s official website.
Explain any additional materials needed.

Main reference types:
Journal articles and book chapters.

Available materials:
…

First summarize the formatting requirements and adaptation plan.
Wait for confirmation before editing the CSL.
```

<a id="start-with-your-task"></a>

## 💬 Start with your task

### The journal provides only an EndNote style

```text
Use $reference-journal-adapter to adapt a Zotero CSL style
for the target journal.

Journal name and website:
…

EndNote style supplied by the journal:
…

Author guidelines or sample references:
…

First identify which formatting rules these materials support.
Then find a suitable CSL parent style and propose an adaptation plan.
```

### The journal is missing from the Zotero Style Repository

```text
Use $reference-journal-adapter to prepare a CSL style
for the following journal.

Target journal:
…

Official formatting requirements:
…

Main reference types:
…

Check whether a matching style already exists.
If adaptation is needed, compare suitable candidates
and explain which one you recommend as the starting point.
```

### A similar style needs specific adjustments

```text
Use $reference-journal-adapter to adapt an existing CSL
to the target journal.

Existing CSL:
…

Journal requirements:
…

Main differences:
Author truncation above six authors, DOI/PMID formatting,
page ranges, and journal-title styling.

First verify the basis for these requirements
and propose an editing and validation plan.
```

### An existing CSL produces unexpected output

```text
Use $reference-journal-adapter to investigate this formatting issue.

CSL file:
…

Test record or actual output:
…

Expected formatting and its source:
…

First determine whether the issue comes from the test expectation,
CSL rules, or Zotero field mapping.
Then propose the appropriate action.
```

<a id="how-an-adaptation-works"></a>

## 🧭 How an adaptation works

### ① Confirm the target and requirements

Identify the journal, reference types, and available materials. Turn the requirements into checkable rules, such as:

- Whether in-text citations are superscript, how they are sorted, and how consecutive numbers are collapsed.
- How many authors to list and when to use *et al.*
- How journal titles, volumes, issues, pages, and identifiers are combined.
- Which structures apply to books, chapters, and other reference types.

Source conflicts that affect output are presented together so the formatting choices can be confirmed before implementation.

### ② Select a suitable starting style

Check for an exact official style first, then compare the behavior of suitable candidates.

Selection considers in-text citations, bibliography layout, reference-type coverage, and the extent of the required changes. An existing independent CSL can also serve as the baseline for an audit or revision.

### ③ Establish a baseline and make changes

Run representative records through the original style and preserve its output. Edit a working copy to address the confirmed differences.

In-text citations and bibliography entries are checked separately, making it easier to detect how a local change affects other output.

### ④ Confirm the result in Zotero

After the machine checks, the assistant provides a candidate CSL and a short Zotero checklist.

Use the checklist to inspect key results in Zotero/Word and return the necessary screenshots or output. Further changes and checks focus on the affected behavior.

### ⑤ Prepare the final files

After rendering is confirmed, the CSL is delivered with a validation summary, source attribution, and a final checksum. This helps identify the exact file used for testing, delivery, and installation.

<a id="what-you-receive"></a>

## 📦 What you receive

A completed adaptation typically includes:

| Deliverable | Purpose |
|---|---|
| **An installable `.csl` file** | Use the target formatting in Zotero |
| **A formatting specification** | Review the adopted requirements and their sources |
| **Source and style attribution** | Trace the guidelines, parent style, and applicable licenses |
| **Test data and expected results** | Recheck behavior and support future maintenance |
| **A validation summary** | Review check results and actual rendering observations |
| **A final file checksum** | Identify the file used for installation, testing, and delivery |

Deliverables follow the task’s scope. A focused audit can address a specific issue, while a full adaptation retains the evidence chain from requirements to the final file.

<a id="tools-and-further-reading"></a>

## 🛠️ Tools and further reading

Start everyday tasks in natural language. The assistant organizes evidence gathering, editing, and validation.

The bundled scripts handle repeatable checks and file operations:

| Script | Purpose |
|---|---|
| `render_csl.js` | Render citations and bibliography entries from controlled records |
| `compare_csl_results.js` | Compare output with expectations and distinguish passes, known differences, and unexpected regressions |
| `validate_csl.py` | Run XML, RELAX NG, and Schematron checks |
| `promote_verified_artifact.py` | Verify hashes and deliver the file without changing its bytes |

Rendering uses Node.js and citeproc. Structural validation uses Python, lxml, and rnc2rng. Each adaptation records its processor, locale, and schema versions. Existing compatible environments are reused where possible; any required installation is proposed with its dependencies and location.

Further reading:

- [Evidence acquisition and requirement confirmation](references/evidence-acquisition-and-freeze.md)
- [Parent selection and component reuse](references/parent-selection-and-controlled-borrowing.md)
- [Regression checks and result classification](references/regression-and-validation.md)
- [Zotero confirmation and final delivery](references/zotero-witness-and-delivery.md)
- [Dependencies and licenses](references/dependencies-and-licenses.md)

<a id="csl-example-license-and-attribution"></a>

## 📜 License and attribution

The project’s original code and documentation are licensed under the [MIT License](LICENSE), Copyright (c) 2026 kayla9928.

The parent and adapted CSL files in the JCTH example are licensed under **CC BY-SA 3.0**, with their license declarations and source relationships preserved.

The original author of the **Taylor & Francis AMA** parent style is **Patrick O'Brien**. See the [example provenance record](examples/jcth/provenance.md) for sources, technical references, and adaptation details.
