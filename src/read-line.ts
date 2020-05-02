
process.stdin.setEncoding('utf8');

let bufferedChunks: string[] = [];
let bufferedLines: string[] = [];

export async function readLine(): Promise<string> {
  if (bufferedLines === null) {
    throw new Error('OMG!');
  }

  if (bufferedLines.length > 0) {
    const line = bufferedLines.shift();
    return line;
  }

  return new Promise((resolve) => {
    process.stdin.on('data', (chunk) => {
      const breakIndex = chunk.indexOf('\n');

      if (breakIndex === -1) {
        bufferedChunks.push(chunk);
      } else {
        bufferedChunks.push(chunk.substr(0, breakIndex));
        const result = bufferedChunks.join('');
        const rest = chunk.substr(breakIndex + 1).split('\n');
        bufferedChunks = [rest[rest.length - 1]];
        bufferedLines = [...bufferedLines, ...rest.slice(0, rest.length - 1)];
        process.stdin.pause();
        process.stdin.removeAllListeners('data');
        process.stdin.removeAllListeners('end');

        return resolve(result);
      }
    });

    process.stdin.on('end', () => {
      const result = bufferedChunks.join('');
      bufferedChunks = null;
      bufferedLines = null;
      process.stdin.removeAllListeners('data');
      process.stdin.removeAllListeners('end');

      return resolve(result);
    });

    process.stdin.resume();
  });
}
