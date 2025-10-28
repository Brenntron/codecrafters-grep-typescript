const args = process.argv;
const pattern = args[3];

const inputLine: string = await Bun.stdin.text();

function parsePattern(pattern: string): string[] {
  const atoms: string[] = [];
  let i = 0;

  while (i < pattern.length) {
    if (pattern[i] === '\\' && i + 1 < pattern.length) {
      // Escape sequences like \d or \w
      atoms.push(pattern.slice(i, i + 2));
      i += 2;
    } else if (pattern[i] === '[') {
      // Character class like [abc] or [^abc]
      const closeId = pattern.indexOf(']', i);
      if (closeId !== -1) {
        atoms.push(pattern.slice(i, closeId + 1));
        i = closeId + 1;
      } else {
        atoms.push(pattern[i]);
        i++;
      }
    } else {
      // Literal character
      atoms.push(pattern[i]);
      i++;
    }
  }

  return atoms;
}

function matchAtom(char: string, atom: string): boolean {
  if (atom === '\\d') {
    return char >= '0' && char <= '9';
  } else if (atom === '\\w') {
    return (char.toLowerCase() >= 'a' && char.toLowerCase() <= 'z') ||
           (char >= '0' && char <= '9') ||
           char === '_';
  } else if (atom.startsWith('[^') && atom.endsWith(']')) {
    // Negated character class
    const charsToMatch = atom.slice(2, atom.length - 1).split('');
    return !charsToMatch.includes(char);
  } else if (atom.startsWith('[') && atom.endsWith(']')) {
    // Character class
    const charsToMatch = atom.slice(1, atom.length - 1).split('');
    return charsToMatch.includes(char);
  } else {
    // Literal character
    return char === atom;
  }
}

function matchAtomsAt(inputLine: string, atoms: string[], startPosition: number): boolean {
  let inputPosition = startPosition;

  for (let i = 0; i < atoms.length; i++) {
    const atom = atoms[i];

    if (inputPosition >= inputLine.length) {
      return false;
    }

    if (!matchAtom(inputLine[inputPosition], atom)) {
      return false;
    }

    inputPosition++;
  }

  return true;
}

function matchPattern(inputLine: string, pattern: string): boolean {
  const atoms = parsePattern(pattern);

  for (let i = 0; i <= inputLine.length; i++) {
    if (matchAtomsAt(inputLine, atoms, i)) {
      return true;
    }
  }

  return false;
}

if (args[2] !== "-E") {
  process.exit(1);
}

if (matchPattern(inputLine, pattern)) {
  console.log("Matched");
  process.exit(0);
} else {
  console.log("Not Matched");
  process.exit(1);
}
