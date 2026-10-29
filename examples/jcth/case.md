# JCTH：从既有父样式到期刊参考文献样式

本案例展示如何把期刊格式证据转为可执行检查，选择接近目标的 CSL 父样式，进行受控调整，并比较调整前后的引用和参考文献输出。

原始适配工作完成于 **2026-08-19**，是提炼 reference-journal-adapter 工作流的来源案例。**2026-10-30** 使用当前 Skill 配套脚本重新渲染与检查，保留了原始 CSL 和测试数据。它记录的是历史规则与当前脚本回放。

## 案例文件

| 内容 | 文件 |
|---|---|
| Taylor & Francis AMA 父样式 | [parent.csl](parent.csl) |
| JCTH 适配结果 | [adapted.csl](adapted.csl) |
| 14 条受控记录 | [controlled-items.json](controlled-items.json) |
| 4 种引用组合 | [citation-scenarios.json](citation-scenarios.json) |
| 53 项规则检查 | [oracle.json](oracle.json) |
| 来源、规则与许可 | [provenance.md](provenance.md) |
| 调整前后完整预览 | [comparison.html](comparison.html) |
| 历史 Zotero 见证摘要 | [zotero-witness.md](zotero-witness.md) |

受控记录混合了合成记录与期刊指南中的文献示例，用于检查格式；其中的测试 DOI、PMID 与网页地址按测试数据使用。

## 当前回放结果

| 检查结果 | 父样式 | 适配样式 |
|---|---:|---:|
| 格式断言通过 | 17 | 47 |
| 仍与目标不同 | 31 | 1 |
| 交由 Zotero 观察的项目 | 5 | 5 |
| 测试契约完整性错误 | 0 | 0 |
| 意外回归 | 0 | 0 |

两份样式均通过 XML、RELAX NG 与 Schematron 检查。53 项断言包括 48 项处理器检查与 5 项 Zotero 观察项目。

最终适配保留一项会议日期 `29-Sep` 与 `29–Sep` 的已知差异。两项斜体检查现分别使用 `Controlled` 与 `Grounded` 作为匹配片段，在两种大小写风格中均能识别目标标题，正确检查父样式的斜体与适配后的普通字体。

原历史父样式报告为 20 通过、28 差异；当时的预印本检查只搜索编号 `2025.01.15.123456`，目前保存的预期采用完整位置片段 `medRxiv 2025:2025.01.15.123456`。本次另外修正了两项斜体检查的大小写匹配，使父样式统计为 17 通过、31 差异。适配样式维持 47 通过、1 差异，原始转换稿与历史报告另存为内部证据。

详细报告：[父样式比较](results/parent-comparison.json)、[适配样式比较](results/adapted-comparison.json)、[父样式结构检查](results/parent-schema.json)、[适配样式结构检查](results/adapted-schema.json)。报告中的本机资源路径已替换为相对路径或外部资源标识，结果字段保持原值。

## 回放方法

使用 reference-journal-adapter 的 `scripts/render_csl.js` 渲染父样式和适配样式，再用 `scripts/compare_csl_results.js` 将两者与 oracle 比较。资源身份见 provenance.md。路径参数由使用者指向自己的已安装依赖和资源。

```sh
node "$SKILL/scripts/render_csl.js" --style parent.csl --items controlled-items.json --scenarios citation-scenarios.json --locale "$LOCALE" --lang en-US --citeproc "$CITEPROC" --output parent-render.json
node "$SKILL/scripts/render_csl.js" --style adapted.csl --items controlled-items.json --scenarios citation-scenarios.json --locale "$LOCALE" --lang en-US --citeproc "$CITEPROC" --output adapted-render.json
node "$SKILL/scripts/compare_csl_results.js" --oracle oracle.json --actual parent-render.json --baseline parent-render.json --output parent-comparison.json
node "$SKILL/scripts/compare_csl_results.js" --oracle oracle.json --actual adapted-render.json --baseline parent-render.json --output adapted-comparison.json
python "$SKILL/scripts/validate_csl.py" adapted.csl --rnc "$RNC" --schematron "$SCH" --schema-id 506040022f6c37846343edd36658b23e85b5b8ff --schema-release v1.0.2 --json-output adapted-schema.json
```

示例采用 shell 路径变量：`SKILL` 为 Skill 根目录，`LOCALE` 为英语 locale 文件，`CITEPROC` 为 citeproc 包目录，`RNC` 与 `SCH` 为官方 schema 文件。Python 环境需有 lxml、rnc2rng；项目独立安装位置可通过验证脚本的 `--dependency-path` 提供。使用修订后的 oracle，两条比较命令均返回退出码 0，已知差异在报告中单独列出。
