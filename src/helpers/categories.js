import {
  ElectricalServices as ElectricalIcon,
  PestControl as PestControlIcon,
  Lightbulb as LightbulbIcon,
  Grass as GrassIcon,
  Build as BuildIcon,
  DirectionsCar as CarIcon,
  GasMeter as GasIcon,
  Plumbing as PlumbingIcon,
  Kitchen as KitchenIcon,
  ColorLens as ColorLensIcon,
} from "@mui/icons-material";

export const getCategoryIcon = (path) => {
  switch (path) {
    case "productos-eléctricos":
      return <ElectricalIcon color="secondary" />;
    case "control-de-plagas":
      return <PestControlIcon color="secondary" />;
    case "iluminación":
      return <LightbulbIcon color="secondary" />;
    case "pinturas,-colorantes-y-recubrimientos":
      return <ColorLensIcon color="secondary" />;
    case "jardinería":
      return <GrassIcon color="secondary" />;
    case "herramientas":
      return <BuildIcon color="secondary" />;
    case "automotriz":
      return <CarIcon color="secondary" />;
    case "controles-de-gas":
      return <GasIcon color="secondary" />;
    case "plomería-y-tuberías":
      return <PlumbingIcon color="secondary" />;
    case "línea-blanca":
      return <KitchenIcon color="secondary" />;
    default:
      return null;
  }
};

export const trimCategoryName = (name, maxLength = 20) => {
  return {
    trimmedName:
      name.length > maxLength ? `${name.slice(0, maxLength)}...` : name,
    isTrimmed: name.length > maxLength,
  };
};
