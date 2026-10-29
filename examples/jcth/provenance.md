# 来源、规则与资源身份

## CSL 归属

两份 CSL 保留原始字节及其 **Creative Commons Attribution-ShareAlike 3.0 Unported（CC BY-SA 3.0）** 声明：[许可文本](https://creativecommons.org/licenses/by-sa/3.0/legalcode)。此项归属适用于 CSL 示例；Skill 自有代码与文档采用根目录所列的 MIT 许可证。

- `parent.csl`：Taylor & Francis AMA，原作者 **Patrick O'Brien**。来源：[官方 styles 仓库对应版本](https://github.com/citation-style-language/styles/blob/1c6404dd7660d9fcd6a4fc3842eba502cb20093f/taylor-and-francis-ama.csl)。SHA-256：`7CFCE3FCAC04AD986D04D41A4B141F8FB12B4D2846861E130F42BF131259CB7A`。
- `adapted.csl`：从上述父样式适配至 Journal of Clinical and Translational Hepatology，调整包括标题/期刊文字样式、作者截断后的斜体、DOI/PMID 条件输出、页码、行距和类型分支。SHA-256：`C1E0CCA2BFDEE62B9D5D71A0B0ED9BCB179106191C3720A05A8114B6CAD4C93D`。
- 技术参照：同一版本的 [NLM superscript 样式](https://github.com/citation-style-language/styles/blob/1c6404dd7660d9fcd6a4fc3842eba502cb20093f/nlm-citation-sequence-superscript.csl)，作者 Michael Berkowitz、Andrew Dunning 及文件内列明的贡献者；其模板为 nlm-citation-sequence，适用声明保留在原来源中。该文件不随本案例分发。

## 历史证据

下列编号沿用原案例，原始采集日期为 **2026-08-19**。oracle 中保留每项断言的来源编号与规则编号，以下提供公开摘要。

| Source ID | 来源与角色 |
|---|---|
| SRC-JCTH-A1-001 | [期刊作者指南](https://www.xiahepublishing.com/journals/jcth/instruction)，原记录更新日 2025-03-21，提供正文引用与文后格式要求 |
| SRC-JCTH-A2-001 | 期刊官方 Word 模板，补充条目布局、悬挂和类型示例 |
| SRC-JCTH-A2-002 | 出版方 2020 年参考文献指南，补充类型、标识符与电子资源示例 |
| SRC-JCTH-A3-001 | 原用户提供的 EndNote 样式可观察输出，作为格式佐证 |
| SRC-JCTH-B1-001 | 原用户提供的三张已发表文献截图，作为排版佐证；原记录未保留文章身份 |

模板、指南全文、EndNote 文件和截图未随案例复制；规则摘要保留其原有证据角色和可追溯程度。期刊网页可能更新，此处冻结为原适配案例的依据。

## 已冻结的主要选择

- CIT-001、CIT-003、CIT-004：数字上标、逗号分隔、按编号排序并压缩连续编号。
- BIB-001—004：首次引用顺序、`[n]` 编号与一个逻辑空格、悬挂对齐、双倍行距且无额外段落间距。
- BIB-005—008：姓加无标点首字母；六名以内列全，超过六名列前六名及斜体 et al.；保留文章标题大小写，期刊缩写使用普通字体。
- BIB-009—012：按类型输出日期；期刊卷期页码；完整页码端点与 en dash；DOI/PMID 四种存在组合。
- BIB-013、TYPE-WEB、TYPE-PREPRINT：保留网页与预印本的探索性检查，映射观察另列。
- TYPE-ARTICLE、TYPE-BOOK、TYPE-CHAPTER、TYPE-CONFERENCE、TYPE-THESIS：按原证据与冻结选择检查类型结构。

原冲突已裁决：页码使用 en dash 和完整端点；章节采用 `Year:Pages`；作者姓名遵循通用姓加首字母规则；编号采用 `[n]`；DOI 与 PMID 之间用逗号，标签后留空格。本次回放沿用这些选择。

## 回放依赖

| 资源 | 身份 |
|---|---|
| citeproc | npm 包 2.4.63；运行结果中的 processor 字段记录实际引擎与包许可 |
| 英语 locale | citation-style-language/locales，commit `c8b03ca9535a8613f191c91dd51f4b36c0656523`，locales-en-US.xml，SHA-256 `A6EBF5731F8DD706153919E6F0EB859BC708AD612A4938AE9D5613B924C745BB` |
| CSL schema | citation-style-language/schema，commit `506040022f6c37846343edd36658b23e85b5b8ff`，v1.0.2，schemas/styles/csl.rnc 与 csl.sch |
| Python 验证库 | 实际版本见结构检查结果中的 validator 字段 |

外部依赖、locale 与 schema 由使用者按其来源与许可取得；案例不携带安装目录或下载的完整仓库。
