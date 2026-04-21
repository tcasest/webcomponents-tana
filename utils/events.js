/**
 * Autor: Tanausú Castrillo Estévez
 * Helper pequeño para registrar listeners y devolver su cleanup.
 */
export const events = (node, event, cb) => {
  node.addEventListener(event, cb);
  return () => node.removeEventListener(event, cb);
};
