"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GroupedProductsList from "../../../components/GroupedProductsList";
import useGroupedProducts from "../../../hooks/grouped/useGroupedProducts";

const AllProductsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "superadmin";
  const { groupedResult, loading, error, currentPage, setCurrentPage } =
    useGroupedProducts({});

  return (
    <GroupedProductsList
      title="Todos los productos"
      groupedResult={groupedResult}
      loading={loading}
      error={error}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onProductClick={(id) => router.push(`/product/${id}`)}
      showBtns={!isAdmin}
    />
  );
};

export default AllProductsPage;
