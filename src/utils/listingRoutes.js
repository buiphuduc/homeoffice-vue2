// Canonical, path-based URLs keep category pagination crawlable.
export function pageNumber(value) {
  const number = Number(value || 1);
  return Number.isSafeInteger(number) && number > 0 ? number : 1;
}
export function listingPath(categories = [], page = 1) {
  const category = categories.length ? `/nhom/${categories.map(encodeURIComponent).join('/')}` : '';
  const pagination = pageNumber(page) > 1 ? `/trang/${pageNumber(page)}` : '';
  return `/danh-muc${category}${pagination}`;
}
export function listingProps(route) {
  return {
    catPath: route.params.categoryPath ? route.params.categoryPath.split('/') : [],
    searchQuery: typeof route.query.q === 'string' ? route.query.q : '',
    page: pageNumber(route.params.page),
  };
}
