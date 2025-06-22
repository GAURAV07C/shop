import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});

let isRefreshing = false;

let refreshSubscribers: (() => void)[] = [];

// handle logout and prevent infinite loop

const handleLogut = () => {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// handle adding a new access token to the request headers

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

// Excute queued requests after  refresh

const onRrefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// handle api requests

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Handle expired tokens and refresh logic

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent inifinity loop

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        isRefreshing = false;
        onRrefreshed();

        return axiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogut();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
