// JSON for an inline <script type="application/json|ld+json"> block. JSON.stringify leaves `</script>` intact, which
// ends the block early whatever its type; escaping `<` (and the two JS line separators) keeps it valid JSON.
const LINE_SEPARATOR = String.fromCharCode(0x2028)
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029)

export function safeJsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .split(LINE_SEPARATOR)
    .join('\\u2028')
    .split(PARAGRAPH_SEPARATOR)
    .join('\\u2029')
}
