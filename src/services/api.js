import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

let csrfToken = null;

export const fetchCSRFToken = async () => {
  if (!csrfToken) {
    const response = await api.get("get_csrf_token/");
    csrfToken = response.data.csrfToken;
  }
  return csrfToken;
};

api.interceptors.request.use(
  async (config) => {
    if (!csrfToken && config.method !== "get") {
      csrfToken = await fetchCSRFToken();
    }
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => {
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
    ? `get_image/?image_id=${imageId}&type=${imageType}`
    : `get_image/?image_id=${imageId}`;
  const response = await api.get(url, {
    responseType: "blob",
  });
  return response.data;
};

export const submitContactForm = async (formData) => {
  const response = await api.post("submit_contact_form/", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
