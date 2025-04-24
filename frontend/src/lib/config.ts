export const getSiteUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not set for this environment.');
  }

  return process.env.NEXT_PUBLIC_SITE_URL;
};

export const getApiBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not set for this environment.');
  }

  return process.env.NEXT_PUBLIC_API_URL;
};
