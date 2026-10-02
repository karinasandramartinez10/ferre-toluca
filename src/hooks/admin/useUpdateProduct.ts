import { useState } from "react";
import {
  getProductById,
  updateProduct,
  updateProductPricing,
  updateProductAvailability,
} from "../../api/products";
import { revalidateProduct } from "../../actions/revalidate";

export interface ProductUpdatePayload {
  formData: FormData;
  pricing: Record<string, number | null>;
  isAvailable: boolean;
}

const variantIdsOf = async (id: string): Promise<string[]> => {
  const product = await getProductById(id);
  return (product?.variants ?? []).map((v: { id: string | number }) => String(v.id));
};

export function useUpdateProduct() {
  const [saving, setSaving] = useState(false);

  const update = async (id: string, { formData, pricing, isAvailable }: ProductUpdatePayload) => {
    setSaving(true);
    try {
      const previousVariantIds = await variantIdsOf(id);

      await updateProduct(id, formData);

      const failed: string[] = [];
      try {
        await updateProductPricing(id, pricing);
      } catch {
        failed.push("precios");
      }
      try {
        await updateProductAvailability(id, isAvailable);
      } catch {
        failed.push("disponibilidad");
      }

      // Revalidar hasta el final: hacerlo antes de los PATCH de precio deja la
      // página pública cacheada con el valor anterior, y con `revalidate = false`
      // nadie la vuelve a regenerar.
      const currentVariantIds = await variantIdsOf(id);
      await revalidateProduct(id, [...previousVariantIds, ...currentVariantIds]);

      if (failed.length > 0) {
        throw new Error(`Error al actualizar ${failed.join(" y ")}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return { update, saving };
}
