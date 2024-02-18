const fetchWithAuth = async (url, options = {}) => {
	const accessToken = localStorage.getItem('accessToken');
	const headers = {
	  'Authorization': `Bearer ${accessToken}`,
	  ...options.headers,
	};
  
	const response = await fetch(url, { ...options, headers });
	return response;
  };
  
  export { fetchWithAuth };