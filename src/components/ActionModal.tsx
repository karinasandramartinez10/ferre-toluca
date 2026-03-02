import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import type { FieldValues, Resolver } from "react-hook-form";
import * as yup from "yup";
import UploadingMessage from "../app/(admin)/admin/brands/UploadingMessage";
import GroupedSelect from "./inputs/GroupedSelect";
import { useGroupedMenuItems } from "../hooks/useGroupedMenuItems";
import type { ModalMode } from "../types/ui";

type AnyRecord = Record<string, any>;

interface OptionItem {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface ActionModalProps {
  title?: string;
  optionTitle?: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AnyRecord) => void;
  loading: boolean;
  mode?: ModalMode;
  selected?: any;
  options?: any[];
  option?: string;
  groupBy?: (option: any) => string;
}

const nameSchema = yup.string().required("El nombre es requerido");

const ActionModal = ({
  title = "",
  optionTitle = "",
  open,
  onClose,
  onSubmit,
  loading,
  mode = "create",
  selected,
  options = [],
  option,
  groupBy,
}: ActionModalProps) => {
  const dynamicSchema = useMemo(() => {
    const shape: Record<string, yup.AnySchema> = { name: nameSchema };
    if (options?.length && option) {
      shape[option] = yup
        .mixed()
        .test(
          "required-related",
          "Este campo es requerido",
          (val) => val !== null && val !== undefined && val !== ""
        );
    }
    return yup.object().shape(shape);
  }, [options, option]);

  const dynamicDefaultValues = useMemo(() => {
    const base: AnyRecord = { name: "" };
    if (option) base[option] = "";
    return base;
  }, [option]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<AnyRecord>({
    resolver: yupResolver(dynamicSchema) as Resolver<FieldValues>,
    mode: "onChange",
    defaultValues: dynamicDefaultValues,
  });

  useEffect(() => {
    if (mode === "edit" && selected) {
      setValue("name", selected.name, { shouldValidate: true });

      const getRelationKey = (opt: string): string | null => {
        const map: Record<string, string> = {
          categoryId: "category",
          subcategoryId: "subCategory",
        };
        return map[opt] || null;
      };

      const relationKey = getRelationKey(option!);
      const relatedObject = relationKey
        ? (selected[relationKey] as { id?: string } | undefined)
        : undefined;
      if (option) {
        setValue(option, relatedObject?.id || "", { shouldValidate: true });
      }
    }
  }, [mode, selected, option, setValue, open]);

  const handleFormSubmit = (data: AnyRecord) => {
    onSubmit(data);
    resetValues();
  };

  const resetValues = () => {
    reset(dynamicDefaultValues);
  };

  const handleCloseModal = () => {
    resetValues();
    onClose();
  };

  const groupedMenuItems = useGroupedMenuItems(options, groupBy);

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {mode === "create" ? `Agregar ${title}` : `Editar ${title}`}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogContent sx={{ padding: "8px 24px" }}>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {options.length > 0 && (
              <>
                <Typography fontWeight={600}>{optionTitle}</Typography>
                <Controller
                  control={control}
                  name={option!}
                  render={({ field }) => (
                    <GroupedSelect
                      value={field.value}
                      onChange={field.onChange}
                      dense
                      maxMenuHeight={360}
                      sx={undefined}
                      MenuProps={undefined}
                    >
                      {groupedMenuItems}
                    </GroupedSelect>
                  )}
                />
              </>
            )}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message as string}
                  disabled={loading}
                />
              )}
            />
            {loading && <UploadingMessage />}
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button onClick={handleCloseModal} variant="outlined" disabled={loading}>
            Cancelar
          </Button>
          <LoadingButton
            type="submit"
            loading={loading}
            disabled={loading || !isValid}
            variant="contained"
            color="primary"
          >
            {mode === "create" ? "Agregar" : "Guardar Cambios"}
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ActionModal;
