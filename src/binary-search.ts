
export function binSearchLastPass(min: number, max: number, test: (x: number) => boolean) {
  let l = min;
  let r = max + 1;

  while (r > l + 1) {
    const m = Math.floor((l + r) / 2);

    if (test(m)) {
      l = m;
    }
    else {
      r = m;
    }
  }

  return l;
}

export function binSearchFirstPass(min: number, max: number, test: (x: number) => boolean) {
  let l = min - 1;
  let r = max;

  while (r > l + 1) {
    const m = Math.floor((l + r) / 2);

    if (test(m)) {
      r = m;
    }
    else {
      l = m;
    }
  }

  return test(r) ? r : null;
}

export function binSearchLastIndex<T>(a: T[], x: T, compare: (x: T, y: T) => number = (x: T, y: T) => x < y ? -1 : (x > y ? 1: 0)) {
  const k = binSearchLastPass(0, a.length - 1, i => compare(a[i], x) <= 0);

  return (k !== null && a[k] === x) ? k : null;
}

export function binSearchFirstIndex<T>(a: T[], x: T, compare: (x: T, y: T) => number = (x: T, y: T) => x < y ? -1 : (x > y ? 1: 0)) {
  const k = binSearchFirstPass(0, a.length - 1, i => compare(a[i], x) >= 0);

  return (k !== null && a[k] === x) ? k : null;
}
