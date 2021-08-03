module.exports = (lista, elementContained) => {
  let found = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lista.length && !found; i++) {
    found = lista[i] === elementContained;
  }
  return found;
};
