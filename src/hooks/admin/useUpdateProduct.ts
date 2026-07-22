import { useState } from "react";
import { updateProduct, updateProductPricing, updateProductAvailability } from "../../api/products";
import { revalidateProduct } from "../../actions/revalidate";

export interface ProductUpdatePayload {
  formData: FormData;
  pricing: Record<string, number | null>;
  isAvailable: boolean;
}

export function useUpdateProduct() {
  const [saving, setSaving] = useState(false);

  const update = async (id: string, { formData, pricing, isAvailable }: ProductUpdatePayload) => {
    setSaving(true);
    try {
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
      await revalidateProduct(id);

      if (failed.length > 0) {
        throw new Error(`Error al actualizar ${failed.join(" y ")}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return { update, saving };
}
