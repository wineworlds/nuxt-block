# Anweisungen für CODEX (WineShopTheme)

- Suche im Quellcode nach CODEX-FIX-START und CODEX-FIX-ENDE, um angepasste Stellen zu identifizieren und ggf. zu verstehen. Diese Informationen musst du dir merken und hier so dokumentieren das du sie bei zukünftigen Anpassungen verstehst und nicht vergisst.
- Bei Korrekturen dieses Workflows die AGENTS.md aktualisieren, um Wiederholungsfehler zu vermeiden.
- Commit-Flow: zuerst fachlichen Commit nach dem Schema `<type>(codex): <subject>` (z. B. `fix(codex): reset cms block margins`), anschließend Administration-Build committen (`chore(codex): rebuild assets`), danach Version in `composer.json` erhöhen und mit `chore(codex): release v<Version>` abschließen.
- Nach dem Release-Commit das passende Tag ohne Prefix setzen (z. B. `1.0.3`).
- Sobald der User "bitte veröffentlichen" sagt, den gesamten Release-Flow (fachlicher Commit, ggf. Build, Release-Commit, Tag setzen) selbstständig ausführen.

CODEX-FIX Notizen
- 2025-03-20: Modul generiert `#build/block-registry` über `addTemplate`; `src/runtime/components/Block.vue` lädt Registry statt inline Template zu verwenden. Bei Anpassungen daran auf konsistente Async-Imports achten.
