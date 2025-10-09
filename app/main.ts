const args = process.argv;
const pattern = args[3];

const inputLine: string = await Bun.stdin.text();

function matchPattern(inputLine: string, pattern: string): boolean {
  if (pattern.length === 1) {
    return inputLine.includes(pattern);
  } else if (pattern.startsWith('[') && pattern.endsWith(']')) {
    const substringToMatch = pattern.slice(1, pattern.length - 1)

    return inputLine.split('').some((char) => substringToMatch.includes(char));
  }

  switch (pattern) {
    case '\\d':
      return inputLine.split('').some((char) => char >= '0' && char <= '9');
    case '\\w':
      return inputLine.split('').some((char) => (char.toLowerCase() >= 'a' && char.toLowerCase() <= 'z') || (char >= '0' && char <= '9') || char === '_');
    default:
      throw new Error(`Unhandled pattern: ${pattern}`);
  }
}

if (args[2] !== "-E") {
  console.log("Expected first argument to be '-E'");
  process.exit(1);
}

// Uncomment this block to pass the first stage
if (matchPattern(inputLine, pattern)) {
  process.exit(0);
} else {
  process.exit(1);
}
