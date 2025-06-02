import {
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
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
    <Grid container spacing={2}>
      {/* Marca */}
      <Grid item xs={12} md={6}>
        <Typography fontWeight={600}>Selecciona una marca</Typography>
        <Controller
          control={control}
          name="brandId"
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field} sx={{ background: "#FFF" }}>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {/* Categoría */}
      <Grid item xs={12} md={6}>
        <Typography fontWeight={600}>Selecciona una categoría</Typography>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field} sx={{ background: "#FFF" }}>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {/* Subcategoría */}
      <Grid item xs={12} md={6}>
        <Typography fontWeight={600}>Selecciona una subcategoría</Typography>
        <Controller
          control={control}
          name="subCategoryId"
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field} sx={{ background: "#FFF" }}>
                {subcategories.map((subcategory) => (
                  <MenuItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {/* Subtipo */}
      <Grid item xs={12} >
        <Typography fontWeight={600}>¿Tiene una variante?</Typography>
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
      </Grid>

      {/* Tipo (condicional) */}
      {hasType === "yes" && (
        <Grid item xs={12} md={6}>
          <Typography fontWeight={600}>Selecciona una variante del producto</Typography>
          <Controller
            control={control}
            name="typeId"
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <Select {...field} sx={{ background: "#FFF" }}>
                  {types.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default AddProductFields;
