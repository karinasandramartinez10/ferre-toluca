import api from "../config/api";

export const getFavorites = async () => {
  try {
    return await api.get("/favorite");
  } catch (error) {
    console.error(`Error fetching favorites ${error.message}`);
    throw new Error("Error trying to get favorites");
  }
};

export const toggleFavorites = async (productId) => {
  try {
    return await api.post(`/favorite/toggle`, { productId });
  } catch (error) {
    console.error(`Error toggling favorite ${error.message}`);
    throw new Error("Error trying to toggle favorites");
  }
};
