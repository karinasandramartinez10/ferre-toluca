const request = (method, path, body, options, headers, token) => {
  const defaultHeaders = {
    //   Accept: 'application/json',
    Authorization: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`,
    "Content-Type": "application/json",
  };

  const fetchOptions = {
    method,
    ...options,
    headers: Object.assign({}, defaultHeaders, headers, options?.headers),
  };

  if (token) {
    fetchOptions.headers = Object.assign({}, fetchOptions.headers, {
      Authorization: `Bearer ${token}`,
    });
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  return fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${path}`,
    fetchOptions
  );
};

export const POST = (path, body, options, headers) =>
  request("POST", path, body, options, headers);
