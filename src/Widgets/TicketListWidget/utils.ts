function combineUrl(baseUrl, ticketId) {
  if (!baseUrl || !ticketId) {
    return null;
  }
  const parsedUrl = new URL(baseUrl);
  parsedUrl.searchParams.set("ticketid", ticketId);
  return parsedUrl.toString();
}

export { combineUrl };
