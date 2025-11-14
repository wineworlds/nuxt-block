# Anweisungen für CODEX (WineShopTheme)

- Suche im Quellcode nach CODEX-FIX-START und CODEX-FIX-ENDE, um angepasste Stellen zu identifizieren und ggf. zu verstehen. Diese Informationen musst du dir merken und hier so dokumentieren das du sie bei zukünftigen Anpassungen verstehst und nicht vergisst.
- Bei Korrekturen dieses Workflows die AGENTS.md aktualisieren, um Wiederholungsfehler zu vermeiden.
- Commit-Flow: zuerst fachlichen Commit nach dem Schema `<type>(codex): <subject>` (z. B. `fix(codex): reset cms block margins`), danach Version in `package.json` erhöhen und mit `chore(codex): release v<Version>` abschließen.
- Nach dem Release-Commit das passende Tag ohne Prefix setzen (z. B. `1.0.3`).
- Sobald der User "bitte veröffentlichen" sagt, den gesamten Release-Flow (fachlicher Commit, ggf. Build, Release-Commit, Tag setzen) selbstständig ausführen.

CODEX-FIX Notizen
- 2025-03-20: Modul generiert `#build/block-registry` über `addTemplate`; `src/runtime/components/Block.vue` lädt Registry statt inline Template zu verwenden. Conditions liefern jetzt eine Factory, deren Rückgabe (Promise/bool) in `Block.vue` awaited wird.
- 2025-03-20: Playground-Example 1 nutzt `useState` für Conditions (`TestBlock1`), Example 2 testet `provide/inject` über `checkoutActionCondition.ts` und `CheckoutActions.vue`. Conditions liefern nun `ref`/`computed` statt async Callback; Block.vue verschachtelt mehrere Layer per `h()` und wertet Conditions vorab aus.
- 2025-10-XX: `src/runtime/components/Block.vue` wertet Conditions erst im Render-Loop aus (anstatt bereits im `computed`), damit Composables wie `useProduct` mit `injectLocal` wieder während eines gültigen Setup-Kontexts ausgeführt werden können.
