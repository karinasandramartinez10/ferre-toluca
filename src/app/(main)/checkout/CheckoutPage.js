"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
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
import Link from "next/link";
import { useUserFiscals } from "../../../hooks/user/fiscal/useUserFiscals";
import { useFiscalMutations } from "../../../hooks/user/fiscal/useFiscalMutations";

import { useFiscalCatalogs } from "../../../hooks/user/fiscal/useFiscalCatalogs";
import { FiscalProfileSchema } from "../../../schemas/user/fiscal";
import FiscalForm from "../../(user)/user/profile/fiscal/FiscalForm";
import { getDefaultFiscalProfile } from "../../../utils/fiscal";
import OrderItemRow from "./OrderItemRow";
import BillingSelect from "./BillingSelect";
import MessageSection from "./MessageSection";

const TotalRow = ({ totalItems }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
    <Typography
      variant="body"
      fontWeight={600}
    >{`Total de productos: ${totalItems}`}</Typography>
  </Box>
);

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

    <LoadingButton
      disabled={disabled}
      loading={loading}
      variant="contained"
      onClick={onSubmit}
    >
      Solicitar cotización
    </LoadingButton>
  </Box>
);

const FiscalDialog = ({
  open,
  onClose,
  defaults,
  taxRegimes,
  cfdiUses,
  onSubmit,
  submitting,
  hideIsDefault,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle>Nuevos datos de facturación</DialogTitle>
    <DialogContent sx={{ paddingTop: "16px !important" }}>
      <FiscalForm
        defaults={defaults}
        schema={FiscalProfileSchema}
        taxRegimes={taxRegimes}
        cfdiUses={cfdiUses}
        onSubmit={onSubmit}
        submitting={submitting}
        onCancel={onClose}
        hideIsDefault={hideIsDefault}
      />
    </DialogContent>
  </Dialog>
);

const QuoteSchema = yup.object().shape({
  message: yup.string().required("El mensaje es requerido"),
});

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [openFiscalModal, setOpenFiscalModal] = useState(false);
  const [selectedFiscalId, setSelectedFiscalId] = useState(null);
  const { profiles, loading: loadingFiscals, refetch } = useUserFiscals();
  const { create, loading: savingFiscal } = useFiscalMutations();
  const { taxRegimes, cfdiUses } = useFiscalCatalogs();

  const router = useRouter();

  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;

  const { orderItems, removeFromOrder, clearOrder, totalItems } =
    useOrderContext();

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
        console.log(error);
        enqueueSnackbar(
          error?.message || "Hubo un error al procesar la orden",
          {
            variant: "error",
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          }
        );
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
        await refetch();
        if (created?.id) setSelectedFiscalId(created.id);
        setOpenFiscalModal(false);
        enqueueSnackbar("Datos de facturación creados", { variant: "success" });
      } catch (e) {
        enqueueSnackbar(e?.message || "No se pudo crear el registro", {
          variant: "error",
        });
      }
    },
    [create, refetch, setSelectedFiscalId, setOpenFiscalModal, enqueueSnackbar]
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
          <Button component={Link} href="/history" variant="contained">
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

      {orderItems.map(({ product, quantity }) => (
        <OrderItemRow
          key={product.id}
          product={product}
          quantity={quantity}
          onRemove={() => removeFromOrder(product.id)}
        />
      ))}

      {isAuthenticated ? (
        <>
          <TotalRow totalItems={totalItems} />
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
