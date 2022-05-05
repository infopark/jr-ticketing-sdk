export default function newlinesToBreaks(string) {
  return string.replace(/\n/gi, "<br>");
}
