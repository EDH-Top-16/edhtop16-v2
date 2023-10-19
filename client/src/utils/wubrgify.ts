export function WUBRGify(colors: string) {
  let result: string = "";
  // WUBRGify the colors
  const _colors: string[] = ["W", "U", "B", "R", "G"];
  for (const color of _colors) {
    if (colors.includes(color)) result += color;
  }

  return result;
}
