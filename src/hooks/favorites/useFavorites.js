import { useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toggleFavorites, getFavorites } from "../../api/favorites";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes } from "../../constants/queryConfig";

export const useFavorites = () => {
  const { status } = useSession();
  const queryClient = useQueryClient();

  const {
    data: favorites = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: queryKeys.favorites,
    queryFn: async () => {
      const response = await getFavorites();
      return response.data;
    },
    enabled: status === "authenticated",
    staleTime: staleTimes.DYNAMIC,
  });

  const favoritesMap = useMemo(() => {
    const map = new Map();
    favorites.forEach((fav) => map.set(fav.productId, fav));
    return map;
  }, [favorites]);

  const isFavorite = useMemo(
    () => (productId) => favoritesMap.has(productId),
    [favoritesMap]
  );

  const { mutateAsync: toggleFavorite } = useMutation({
    mutationFn: (product) => toggleFavorites(product.id),
    onMutate: async (product) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });

      const previous = queryClient.getQueryData(queryKeys.favorites);

      // Optimistic update
      queryClient.setQueryData(queryKeys.favorites, (old = []) => {
        const exists = old.some((fav) => fav.productId === product.id);
        if (exists) {
          return old.filter((fav) => fav.productId !== product.id);
        }
        return [...old, { productId: product.id, product }];
      });

      return { previous };
    },
    onError: (_err, _product, context) => {
      queryClient.setQueryData(queryKeys.favorites, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  });

  return {
    favorites,
    favoritesMap,
    loading,
    error: error?.message || null,
    toggleFavorite,
    isFavorite,
  };
};
