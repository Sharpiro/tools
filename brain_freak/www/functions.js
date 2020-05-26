/**
 * @param {string} query
 * @returns {HTMLElement} element
 */
export function selectElement(query) {
  const el = (document.querySelector(query));
  if (!el) throw new Error(`could not find element with query '${query}'`);
  return /** @type {HTMLElement} */ (el);
}

/**
 * @param {string} query
 * @returns {HTMLInputElement} element
 */
export function selectInput(query) {
  return /** @type {HTMLInputElement} */ (selectElement(query));
}
