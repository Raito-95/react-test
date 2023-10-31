const getCSRFToken = () => {
  let token = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('csrftoken=')) {
        token = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return token;
};
  
export default getCSRFToken;
  