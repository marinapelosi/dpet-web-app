const API_BASE_URL = "http://localhost:8000/api";

const API_ROUTES = {
  PETS: `${API_BASE_URL}/pets`,
  PET_BY_ID: (id) => `${API_BASE_URL}/pets/${id}`,
  PET_TYPES: `${API_BASE_URL}/pet-types`,
  BREED_BY_PET_TYPE: (petTypeSlug) => `${API_BASE_URL}/breeds/${petTypeSlug}`,
  CREATE_PET: `${API_BASE_URL}/pets`,  
};

export { API_BASE_URL, API_ROUTES };
