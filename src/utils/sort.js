export function sort(a, b) {
  const fieldA = a.toUpperCase();
  const fieldB = b.toUpperCase();

  if (fieldA > fieldB) {
    return 1;
  }
  if (fieldA < fieldB) {
    return -1;
  }
  return 0;
}

export function sortNumber(a, b) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}
