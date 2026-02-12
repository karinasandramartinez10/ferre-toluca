"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adaptFiscalCreateFormToPayload,
  adaptFiscalFormToPayload,
} from "../../../app/(user)/user/profile/fiscal/adapters";
import {
  createUserFiscal,
  updateUserFiscal,
  deleteUserFiscal,
  setDefaultUserFiscal,
} from "../../../api/userFiscals";
import { queryKeys } from "../../../constants/queryKeys";

export function useFiscalMutations() {
  const queryClient = useQueryClient();

  const invalidateFiscals = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.userFiscals });

  const createMutation = useMutation({
    mutationFn: ({ formValues, mode }) => {
      const payload = adaptFiscalCreateFormToPayload(formValues, { mode });
      return createUserFiscal(payload);
    },
    onSettled: invalidateFiscals,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formValues }) => {
      const payload = adaptFiscalFormToPayload(formValues);
      return updateUserFiscal(id, payload);
    },
    onSettled: invalidateFiscals,
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id) => setDefaultUserFiscal(id),
    onSettled: invalidateFiscals,
  });

  const removeMutation = useMutation({
    mutationFn: (id) => deleteUserFiscal(id),
    onSettled: invalidateFiscals,
  });

  // Wrappers para mantener la misma interfaz de llamada
  const create = (formValues, mode = "id") =>
    createMutation.mutateAsync({ formValues, mode });

  const update = (id, formValues) =>
    updateMutation.mutateAsync({ id, formValues });

  const setDefault = (id) => setDefaultMutation.mutateAsync(id);

  const remove = (id) => removeMutation.mutateAsync(id);

  const loading =
    createMutation.isPending ||
    updateMutation.isPending ||
    setDefaultMutation.isPending ||
    removeMutation.isPending;

  return { create, update, setDefault, remove, loading };
}

export default useFiscalMutations;
