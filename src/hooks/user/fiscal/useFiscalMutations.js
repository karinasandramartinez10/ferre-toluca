"use client";

import { useCallback, useState } from "react";
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

export function useFiscalMutations() {
  const [loading, setLoading] = useState(false);

  const create = useCallback(async (formValues, mode = "id") => {
    setLoading(true);
    try {
      const payload = adaptFiscalCreateFormToPayload(formValues, { mode });
      return await createUserFiscal(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, formValues) => {
    setLoading(true);
    try {
      const payload = adaptFiscalFormToPayload(formValues);
      return await updateUserFiscal(id, payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const setDefault = useCallback(async (id) => {
    setLoading(true);
    try {
      return await setDefaultUserFiscal(id);
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    try {
      return await deleteUserFiscal(id);
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, update, setDefault, remove, loading };
}

export default useFiscalMutations;
