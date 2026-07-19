import { Breadcrumbs, Link, Typography } from "@mui/material";
import type { CatalogCrumb } from "../../../../types/promotion";

interface CatalogBreadcrumbsProps {
  path: CatalogCrumb[];
  onNavigate: (depth: number) => void;
}

const CatalogBreadcrumbs = ({ path, onNavigate }: CatalogBreadcrumbsProps) => (
  <Breadcrumbs separator="›">
    {path.length === 0 ? (
      <Typography color="text.primary" fontWeight={700}>
        Categorías
      </Typography>
    ) : (
      <Link component="button" underline="hover" color="inherit" onClick={() => onNavigate(0)}>
        Categorías
      </Link>
    )}
    {path.map((node, i) =>
      i === path.length - 1 ? (
        <Typography key={node.id} color="text.primary" fontWeight={700}>
          {node.name}
        </Typography>
      ) : (
        <Link
          key={node.id}
          component="button"
          underline="hover"
          color="inherit"
          onClick={() => onNavigate(i + 1)}
        >
          {node.name}
        </Link>
      )
    )}
  </Breadcrumbs>
);

export default CatalogBreadcrumbs;
