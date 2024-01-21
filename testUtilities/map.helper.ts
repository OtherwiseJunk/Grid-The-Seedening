export function cloneMapOfDecks<T, V>(map: Map<T, V[]>): Map<T, V[]> {
  const newMap = new Map();

  // Both Object and Map has entries method although the order is different
  const iterator = map.entries();

  for (const item of iterator) {
    const [constraintType, gameConstraints] = item;
    newMap.set(constraintType, [...gameConstraints]);
  }

  return newMap;
}
