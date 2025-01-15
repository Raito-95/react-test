import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

let csrfToken = null;

export const fetchCSRFToken = async () => {
  if (!csrfToken) {
    const response = await api.get("get_csrf_token/");
    if (!response.data.csrfToken) {
      throw new Error("CSRF Token not found in response");
    }
    csrfToken = response.data.csrfToken;
  }
  return csrfToken;
};

export const initializeCSRFToken = async () => {
  try {
    csrfToken = await fetchCSRFToken();
  } catch (error) {
    console.error("Failed to initialize CSRF Token:", error);
  }
};

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    if (!csrfToken && ["post", "put", "delete"].includes(config.method)) {
      csrfToken = await fetchCSRFToken();
    }
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `API Error (Status: ${error.response.status}):`,
        error.response.data.message || error.message
      );
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const fetchAnimeList = async () => {
  const response = await api.get("anime_list/");
  return response.data;
};

export const fetchReflectionList = async () => {
  const response = await api.get("reflection_list/");
  return response.data;
};

export const fetchArticleList = async () => {
  const response = await api.get("article_list/");
  return response.data;
};

export const fetchImage = async (imageId, imageType = null) => {
  const url = imageType
    ? `${BASE_API_URL}get_image/?image_id=${imageId}&type=${imageType}`
    : `${BASE_API_URL}get_image/?image_id=${imageId}`;
  const response = await api.get(url, { responseType: "blob" });
  return response.data;
};

export const submitContactForm = async (formData) => {
  if (!csrfToken) {
    csrfToken = await fetchCSRFToken();
  }

  const response = await api.post("submit_contact_form/", formData, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
  });
  return response.data;
};
