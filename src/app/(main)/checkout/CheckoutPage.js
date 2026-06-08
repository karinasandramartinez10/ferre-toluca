"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { createQuote } from "../../../api/quote";
import { LoadingButton } from "@mui/lab";
import { useEffect, useMemo, useState, useCallback } from "react";
import LoginContainer from "../../auth/login/LoginContainer";
import LoginForm from "../../auth/login/LoginForm";
import { useRouter } from "next/navigation";
import { useOrderContext } from "../../../context/order/useOrderContext";
import { formatPrice } from "../../../utils/currency";
import Link from "next/link";
import { useUserFiscals } from "../../../hooks/user/fiscal/useUserFiscals";
import { useFiscalMutations } from "../../../hooks/user/fiscal/useFiscalMutations";
import { useFiscalCatalogs } from "../../../hooks/user/fiscal/useFiscalCatalogs";
import { getDefaultFiscalProfile } from "../../../utils/fiscal";
import OrderItemRow from "./OrderItemRow";
import BillingSelect from "./BillingSelect";
import MessageSection from "./MessageSection";
import TotalRow from "./TotalRow";
import FiscalDialog from "./FiscalDialog";
import { parseQuoteError } from "./parseQuoteError";

const ActionsRow = ({ onClear, onSubmit, disabled, loading }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mt: 4,
      flexDirection: { xs: "column", md: "row" },
    }}
    gap={1}
  >
    <Button variant="outlined" color="primary" onClick={onClear}>
      Vaciar Carrito
    </Button>

    <LoadingButton disabled={disabled} loading={loading} variant="contained" onClick={onSubmit}>
      Solicitar cotización
    </LoadingButton>
  </Box>
);

const QuoteSchema = yup.object().shape({
  message: yup.string().nullable(),
});

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [openFiscalModal, setOpenFiscalModal] = useState(false);
  const [selectedFiscalId, setSelectedFiscalId] = useState(null);
  const { profiles, loading: loadingFiscals } = useUserFiscals();
  const { create, loading: savingFiscal } = useFiscalMutations();
  const { taxRegimes, cfdiUses } = useFiscalCatalogs();

  const router = useRouter();

  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;

  const { orderItems, removeFromOrder, clearOrder, totalItems } = useOrderContext();

  const orderTotal = useMemo(
    () =>
      orderItems.reduce(
        (sum, item) => sum + parseFloat(item.product?.price || 0) * item.quantity,
        0
      ),
    [orderItems]
  );

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: yupResolver(QuoteSchema),
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleCheckout = useCallback(
    async (values) => {
      setLoading(true);
      try {
        const products = orderItems.map((item) => ({
          ProductId: item.product.id,
          quantity: item.quantity,
        }));

        const requestBody = {
          message: values.message,
          products,
          userFiscalProfileId: selectedFiscalId || undefined,
        };

        await createQuote(requestBody);
        enqueueSnackbar("Solicitud de orden enviada correctamente.", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        clearOrder();
        reset();
      } catch (error) {
        enqueueSnackbar(parseQuoteError(error), {
          variant: "error",
          autoHideDuration: 7000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      } finally {
        setLoading(false);
      }
    },
    [orderItems, selectedFiscalId, enqueueSnackbar, clearOrder, reset]
  );

  // Default selected fiscal profile
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      const chosen = getDefaultFiscalProfile(profiles);
      setSelectedFiscalId(chosen?.id ?? profiles[0].id);
    } else {
      setSelectedFiscalId(null);
    }
  }, [profiles]);

  const sortedProfiles = useMemo(() => {
    if (!Array.isArray(profiles)) return [];
    const chosen = getDefaultFiscalProfile(profiles);
    if (!chosen) return profiles;
    return [chosen, ...profiles.filter((p) => p.id !== chosen.id)];
  }, [profiles]);

  const handleCreateFiscal = useCallback(
    async (values) => {
      try {
        const created = await create(values, "id");
        if (created?.id) setSelectedFiscalId(created.id);
        setOpenFiscalModal(false);
        enqueueSnackbar("Datos de facturación creados", { variant: "success" });
      } catch (e) {
        enqueueSnackbar(e?.message || "No se pudo crear el registro", {
          variant: "error",
        });
      }
    },
    [create, setSelectedFiscalId, setOpenFiscalModal, enqueueSnackbar]
  );

  const onSignIn = useCallback(
    async ({ email, password }) => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        enqueueSnackbar("Correo o contraseña incorrectos", {
          variant: "error",
        });
        return;
      }

      enqueueSnackbar("¡Sesión iniciada!", { variant: "success" });
      router.refresh();
    },
    [enqueueSnackbar, router]
  );

  if (orderItems.length === 0) {
    return (
      <Stack sx={{ alignItems: "center", gap: 2, p: 3 }}>
        <Typography variant="h4" textAlign="center">
          Tu carrito está vacío.
        </Typography>
        {isAuthenticated && (
          <Button component={Link} href="/user/profile/history" variant="contained">
            Ver historial de órdenes
          </Button>
        )}
      </Stack>
    );
  }

  return (
    <Box width="100%">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Productos a cotizar
      </Typography>

      <Box sx={{ maxHeight: { xs: 350, md: 450 }, overflowY: "auto", pr: 1 }}>
        {orderItems.map((item) => (
          <OrderItemRow
            key={item.product.id}
            product={item.product}
            quantity={item.quantity}
            unitPrice={item.product?.price}
            onRemove={() => removeFromOrder(item.product.id)}
          />
        ))}
      </Box>

      {isAuthenticated ? (
        <>
          <TotalRow totalItems={totalItems} orderTotal={formatPrice(orderTotal)} />
          <BillingSelect
            loading={loadingFiscals}
            profiles={sortedProfiles}
            selectedId={selectedFiscalId}
            onChange={setSelectedFiscalId}
            onOpenCreate={() => setOpenFiscalModal(true)}
          />
          <MessageSection control={control} />
          <ActionsRow
            onClear={clearOrder}
            onSubmit={handleSubmit(handleCheckout)}
            disabled={!isValid}
            loading={loading}
          />
          <FiscalDialog
            open={openFiscalModal}
            onClose={() => setOpenFiscalModal(false)}
            defaults={{
              fiscalName: "",
              rfc: "",
              taxZipCode: "",
              taxRegimeId: null,
              taxRegimeCode: "",
              defaultCfdiUseId: null,
              cfdiUseCode: "",
              isDefault: profiles.length === 0,
            }}
            taxRegimes={taxRegimes}
            cfdiUses={cfdiUses}
            onSubmit={handleCreateFiscal}
            submitting={savingFiscal}
            hideIsDefault={false}
          />
        </>
      ) : (
        <LoginContainer>
          <LoginForm onSubmit={onSignIn}>
            {({ loading, isValid }) => (
              <>
                <LoadingButton
                  loading={loading}
                  disabled={!isValid}
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Iniciar sesión
                </LoadingButton>
              </>
            )}
          </LoginForm>
        </LoginContainer>
      )}
    </Box>
  );
};

export default CheckoutPage;
