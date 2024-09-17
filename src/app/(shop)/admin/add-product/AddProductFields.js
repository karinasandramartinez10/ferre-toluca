import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

const AddProductFields = ({
  brands,
  categories,
  subcategories,
  types,
  control,
  hasType,
}) => {
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
        name="categoryId"
        render={({ field }) => (
          <FormControl sx={{ minWidth: 120 }} size="small">
            <Select {...field} fullWidth sx={{ background: "#FFF" }}>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Typography fontWeight={600}>Selecciona una subcategoría</Typography>
      <Controller
        control={control}
        name="subCategoryId"
        render={({ field }) => (
          <FormControl sx={{ minWidth: 120 }} size="small">
            <Select {...field} fullWidth sx={{ background: "#FFF" }}>
              {subcategories.map((subcategory) => (
                <MenuItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Typography fontWeight={600}>¿Tiene un subtipo?</Typography>
      <Controller
        control={control}
        name="hasType"
        render={({ field }) => (
          <FormControl component="fieldset">
            <RadioGroup {...field} row>
              <FormControlLabel value="yes" control={<Radio />} label="Sí" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        )}
      />

      {hasType === "yes" && (
        <Controller
          control={control}
          name="typeId"
          render={({ field }) => (
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select {...field} fullWidth sx={{ background: "#FFF" }}>
                {types.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      )}
    </Stack>
  );
};

export default AddProductFields;
