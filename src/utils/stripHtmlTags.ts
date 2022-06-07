export default function stripHtmlTags(string: string) {
  let result = string;
  result = result.replace(/<style([\s\S]*?)<\/style>/gi, "");
  result = result.replace(/<script([\s\S]*?)<\/script>/gi, "");
  result = result.replace(/<\/div>/gi, "\n");
  result = result.replace(/<\/li>/gi, "\n");
  result = result.replace(/<li>/gi, "  *  ");
  result = result.replace(/<\/ul>/gi, "\n");
  result = result.replace(/<\/p>/gi, "\n");
  result = result.replace(/<br[^>]*>/gi, "\n");
  result = result.replace(/<[^>]+>/gi, "");
  return result;
}
