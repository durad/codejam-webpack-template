
import { sortBy, sortedIndexBy } from 'lodash-es';
import { BigNumber } from './../node_modules/bignumber.js/bignumber';
import { readLine } from './read-line';

// import Fraction from '../node_modules/fraction.js/fraction';
// /// <reference path="../node_modules/fraction.js/fraction.d.ts" />

async function main() {

  const T = parseInt(await readLine());
  for (let ti = 0; ti < T; ti++) {
    let [N] = (await readLine()).split(' ').map(x => parseInt(x));

    console.log(`Case #${ti + 1}: ${N}`);
  }
}

main().catch(console.error);
