export default function areValid(lista: any): boolean {
  if (!Array.isArray(lista)) { return false; }

  let valid = true;
  for (let i = 0; i < lista.length && valid; i++) {
    valid = isValid(lista[i]);
  }
  return valid;
}

export function isValid(element: any): boolean {
  return element != null && (typeof element !== 'number' || Number.isFinite(element));
}
