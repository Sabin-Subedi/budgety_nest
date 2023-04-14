export const getUrlPermission = (
  urlName: string,
  handlerName: string,
  method: string,
) => {
  let routeName = urlName.concat(
    handlerName.startsWith(':') ? handlerName : `/${handlerName}`,
  );

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

export const generateOtpCode = (numOfDigits = 6) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return numOfDigits > 0 ? otp.toString().slice(0, numOfDigits) : otp;
};
