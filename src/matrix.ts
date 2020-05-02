
type MatrixValue<V> = V | ((r: number, c: number) => V);

/**
 * Creates a new matrix
 * @param {number} R Number of rows.
 * @param {number} C Number of columns.
 * @param {any} [v] Default value to populate.
 */
export function createMatrix<V>(R: number, C: number, v?: MatrixValue<V>): V[][] {
  const r = [];

  for (let y = 0; y < R; y++) {
    const line = [];
    for (let x = 0; x < C; x++) {
      line.push(typeof v === 'function' ? v.call(null, y, x) : v);
    }
    r.push(line);
  }

  return r;
}

export function duplicateMatrix<V>(m: V[][]) {
  const r = [];

  for (let y = 0; y < m.length; y++) {
    r.push(m[y].slice(0));
  }

  return r;
}

interface PrintMatrixOptions<V> {
  width?: number;
  nullish?: string;
  spacing?: number;
  emptyLines?: number;
  finalEmptyLine?: boolean;
  align?: 'left' | 'middle' | 'right';
  value?: (r: number, c: number, v: V) => string;
  secondValue?: (r: number, c: number, v: V) => string;
  indent?: (r: number) => number;
  mark?: (r: number, c: number, v: V) => boolean;
  markUnderline?: (r: number, c: number, v: V) => boolean;
  markInverse?: (r: number, c: number, v: V) => boolean;
  markBg?: (r: number, c: number, v: V) => boolean;
}

function formatValue<V>(str: string, width: number, m: V[][], r: number, c: number, index: number, options: PrintMatrixOptions<V>): string {
  const mark = (options.mark && options.mark(r, c, m[r][c])) ? '\x1b[33m' : '';
  const markUnderline = (options.markUnderline && options.markUnderline(r, c, m[r][c])) ? '\x1b[4m' : '';
  const markInverse = (options.markInverse && options.markInverse(r, c, m[r][c])) ? '\x1b[7m' : '';
  const markBg = (options.markBg && options.markBg(r, c, m[r][c])) ? '\x1b[100m' : '';
  const markReset = '\x1b[0m';
  const markSecond = index === 1 ? '\x1b[2m' : '';
  const align = options.align || 'left';
  const prefixLength = align === 'left' ? 0 : Math.max(0, Math.floor((width - str.length) / (align === 'middle' ? 2 : 1)));
  const postfixLength = Math.max(0, width - str.length - prefixLength);
  const prefix = ' '.repeat(prefixLength);
  const postfix = ' '.repeat(postfixLength);

  return [
    markBg, markInverse, mark, markSecond,
    prefix,
    markUnderline, str,
    markReset,
    markBg, markInverse, mark,
    postfix,
    markReset,
  ].join('');
}

/**
 * Prints the matrix in console
 * @param {any} m Matrix to be printed.
 * @param {object} [options] Optional options object.
 * @param {number} [options.width] Desired width of matrix cell. If not defined auto-width is being calculated.
 * @param {string} [options.nullish] String used to print null and undefined values. Single space by default.
 * @param {number} [options.spacing] Number of spaces between each cell. Default: 1.
 * @param {number} [options.emptyLines] Number of empty lines after each row.
 * @param {boolean} [options.finalEmptyLine] Print empty line after printing whole matrix. True by default.
 * @param {'left' | 'right' | 'middle'} [options.align] Alignment of individual cells.
 * @param {(r: number, c: number, v: any) => any} [options.value] Function used to format value of each field.
 * @param {(r: number, c: number, v: any) => any} [options.secondValue] Function used to provide secondary line of values.
 * @param {(r: number) => number} [options.indent] Function used to provide each row's indent value.
 * @param {(r: number, c: number, v: any) => boolean} [options.mark]
 * @param {(r: number, c: number, v: any) => boolean} [options.markUnderline]
 * @param {(r: number, c: number, v: any) => boolean} [options.markInverse]
 * @param {(r: number, c: number, v: any) => boolean} [options.markBg]
 */

export function printMatrix<V>(m: V[][], options: PrintMatrixOptions<V> = {}) {
  const spacing = options.spacing !== undefined ? options.spacing : 1;
  const space = ' '.repeat(spacing);
  const nullish = options.nullish !== undefined ? options.nullish : ' ';
  const emptyLines = options.emptyLines || (options.secondValue ? 1 : 0);
  const finalEmptyLine = options.finalEmptyLine !== undefined ? options.finalEmptyLine : true;
  const values = [];
  let maxWidth = 0;

  for (let r = 0; r < m.length; r++) {
    const vLine = [];

    for (let c = 0; c < m[r].length; c++) {
      const vObj: { vStr: string, sStr: string } = { vStr: undefined, sStr: undefined };
      vLine.push(vObj);
      const value = options.value ? options.value(r, c, m[r][c]) : m[r][c];
      vObj.vStr = (value !== null && value !== undefined) ? value.toString() : nullish;
      maxWidth = Math.max(maxWidth, vObj.vStr.length);

      if (options.secondValue) {
        const sValue = options.secondValue(r, c, m[r][c]);
        vObj.sStr = (sValue !== null && sValue !== undefined) ? sValue.toString() : nullish;
        maxWidth = Math.max(maxWidth, vObj.sStr.length);
      }
    }

    values.push(vLine);
  }

  const width = options.width !== undefined ? options.width : maxWidth;

  for (let r = 0; r < values.length; r++) {
    const p = [];
    const indent = options.indent ? options.indent(r) : 0;
    if (indent > 0) p.push(' '.repeat(indent));

    for (let c = 0; c < values[r].length; c++) {
      p.push(formatValue(values[r][c].vStr, width, m, r, c, 0, options));
    }
    console.log(p.join(space));

    if (options.secondValue) {
      const pp = [];
      if (indent > 0) pp.push(' '.repeat(indent));
      for (let c = 0; c < values[r].length; c++) {
        pp.push(formatValue(values[r][c].sStr, width, m, r, c, 1, options));
      }
      console.log(pp.join(space));
    }

    for (let i = 0; i < emptyLines; i++) {
      console.log();
    }
  }

  if (finalEmptyLine) {
    console.log();
  }
}
