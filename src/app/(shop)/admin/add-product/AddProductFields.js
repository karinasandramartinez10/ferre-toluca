import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

const AddProductFields = ({ brands, hasSubCategory, control }) => {
  return (
    <Stack gap={1} width="100%">
      <Typography fontWeight={600}>Selecciona una marca</Typography>
      <Controller
        control={control}
        name="brandId"
        render={({ field }) => (
          <FormControl sx={{ minWidth: 120 }} size="small">
            <Select {...field} fullWidth sx={{ background: "#FFF" }}>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Typography fontWeight={600}>Selecciona una categoría</Typography>
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <TextField {...field} label="Categoría" fullWidth size="small" />
        )}
      />

      <Typography fontWeight={600}>¿Tiene subcategoría?</Typography>
      <Controller
        control={control}
        name="hasSubCategory"
        render={({ field }) => (
          <FormControl component="fieldset">
            <RadioGroup {...field} row>
              <FormControlLabel value="yes" control={<Radio />} label="Sí" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        )}
      />

      {hasSubCategory === "yes" && (
        <Controller
          control={control}
          name="subCategory"
          render={({ field }) => (
            <TextField {...field} label="Subcategoría" fullWidth size="small" />
          )}
        />
      )}
    </Stack>
  );
};

export default AddProductFields;
