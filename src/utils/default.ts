export const getUrlPermission = (
  urlName: string,
  handlerName: string,
  method: string,
) => {
  let routeName = urlName.concat(handlerName);

  if (routeName.endsWith('/')) {
    routeName = routeName.slice(0, -1);
  }

  routeName = routeName
    .split(/\/|(?=)\:/g)
    .join('-')
    .replace('id', 'detail');

  const lowerCaseMethod = method.toLowerCase();

  return [routeName, lowerCaseMethod];
};
