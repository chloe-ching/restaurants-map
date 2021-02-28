export const createClassName = (baseName, modifiers = {}) => {
  return baseName + Object.keys(modifiers).reduce((acc, m) =>
    modifiers[m] ? `${acc} ${baseName}--${m}` : acc
  , "");
}

export const areArraysEqual = (arrA, arrB, areObjArrays) => {
  if (arrA.length !== arrB.length) {
    return false;
  }

  for (let i = 0; i < arrA.length; i++) {
    if (areObjArrays) {
      if (!areObjShallowEqual(arrA[i], arrB[i])) {
        return false;
      }
    } else if (arrA[i] !== arrB[i]) {
      return false;
    }
  }
  return true;
};

export const areObjShallowEqual = (a, b) => {
  if (!!(a) !== !!(b)) {
    return false;
  }
  const aKeys = a ? Object.keys(a) : [];
  const bKeys = b ? Object.keys(b) : [];
  const aLen = aKeys.length;
  if (aLen !== bKeys.length) {
    return false;
  }
  for (let i = 0; i < aLen; i++) {
    if (a[aKeys[i]] !== b[aKeys[i]]) {
      return false;
    }
  }
  return true;
};
