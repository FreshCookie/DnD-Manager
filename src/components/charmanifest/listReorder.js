// Verschiebt den Eintrag an Index `idx` um eine Position nach oben (-1) oder
// unten (+1). Mit `groupKey` bezieht sich "eine Position" nur auf andere
// Einträge derselben Gruppe (z.B. Ausrüstung: nur innerhalb der Kategorie) -
// ohne `groupKey` ist die ganze Liste eine Gruppe.
export function moveEntry(items, idx, direction, groupKey) {
  const groupIndices = items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => (groupKey ? groupKey(item) === groupKey(items[idx]) : true))
    .map(({ i }) => i);
  const posInGroup = groupIndices.indexOf(idx);
  const swapWith = groupIndices[posInGroup + direction];
  if (swapWith === undefined) return items;
  const next = [...items];
  [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
  return next;
}

export function isFirstInGroup(items, idx, groupKey) {
  const groupIndices = items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => (groupKey ? groupKey(item) === groupKey(items[idx]) : true))
    .map(({ i }) => i);
  return groupIndices[0] === idx;
}

export function isLastInGroup(items, idx, groupKey) {
  const groupIndices = items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => (groupKey ? groupKey(item) === groupKey(items[idx]) : true))
    .map(({ i }) => i);
  return groupIndices[groupIndices.length - 1] === idx;
}
