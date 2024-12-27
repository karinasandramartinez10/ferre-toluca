import { useState, useEffect, useMemo } from "react";
import { toggleFavorites, getFavorites } from "../../api/favorites";

export const useFavorites = () => {
  const [favoritesMap, setFavoritesMap] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFavorites();
      const favorites = response.data;

      // Crear un mapa a partir de los favoritos
      const map = new Map();
      favorites.forEach((favorite) => map.set(favorite.productId, favorite));
      setFavoritesMap(map);
    } catch (err) {
      setError(err.message || "Error fetching favorites");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (product) => {
    setLoading(true);
    try {
      const productId = product.id;

      if (favoritesMap.has(productId)) {
        await toggleFavorites(productId);
        setFavoritesMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.delete(productId);
          return newMap;
        });
      } else {
        const response = await toggleFavorites(productId);
        const addedFavorite = response.data;
        setFavoritesMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(productId, addedFavorite);
          return newMap;
        });
      }
    } catch (err) {
      setError(err.message || "Error toggling favorite");
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = useMemo(
    () => (productId) => favoritesMap.has(productId),
    [favoritesMap]
  );
  
  const favorites = useMemo(
    () => Array.from(favoritesMap.values()),
    [favoritesMap]
  );

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    favoritesMap,
    loading,
    error,
    toggleFavorite,
    isFavorite,
  };
};
