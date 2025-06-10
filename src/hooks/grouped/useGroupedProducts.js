import { useCallback, useEffect, useState } from "react";
import { getGroupedProducts } from "../../api/products";

export default function useGroupedProducts({
  pageSize = 10,
  brandId,
  categoryId,
  query,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [groupedResult, setGroupedResult] = useState({
    products: [],
    count: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchStrategies = {
    brand: async (page) => {
      const { data } = await getGroupedProducts("groupedBrand", {
        id: brandId,
        page,
        size: pageSize,
      });
      return data;
    },
    category: async (page) => {
      const { data } = await getGroupedProducts("groupedCategory", {
        id: categoryId,
        page,
        size: pageSize,
      });
      return data;
    },
    search: async (page) => {
      const { data } = await getGroupedProducts("groupedSearch", {
        q: query,
        page,
        size: pageSize,
      });
      return data;
    },
    all: async (page) => {
      const { data } = await getGroupedProducts("grouped", {
        page,
        size: pageSize,
      });
      return data;
    },
  };

  const getActiveStrategy = () => {
    if (query && query.length >= 3) return "search";
    if (brandId) return "brand";
    if (categoryId) return "category";
    return "all";
  };

  const fetchData = useCallback(
    async (page) => {
      setLoading(true);
      try {
        const strategy = getActiveStrategy();
        const data = await fetchStrategies[strategy](page);
        setGroupedResult({
          products: data.products,
          count: data.count,
          totalPages: data.totalPages,
        });
        setError(false);
      } catch (err) {
        console.error("Error fetching grouped products:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [brandId, categoryId, query, pageSize]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  return {
    groupedResult,
    loading,
    error,
    currentPage,
    setCurrentPage,
  };
}

//TODO: checar que el loading solo sea en medio entre Breadcrumnbs y footer
