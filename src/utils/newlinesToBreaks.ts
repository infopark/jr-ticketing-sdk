export default function newlinesToBreaks(string: string) {
  return string.replace(/\n/gi, "<br>");
}
