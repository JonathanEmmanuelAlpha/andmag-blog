/**
 * Return wether or not two set are equal
 * @param {Set} set_1
 * @param {Set} set_2
 */
export function areEqualSet(set_1, set_2) {
  return set_1.size === set_2.size && [...set_1].every((set) => set_2.has(set));
}
