import { useMemo } from "react";
import { ListSubheader, MenuItem } from "@mui/material";
import { toCapitalizeWords } from "../utils/cases";

export function useGroupedMenuItems(options, groupBy) {
  return useMemo(() => {
    if (!options?.length) return null;

    if (!groupBy) {
      return options.map((opt) => (
        <MenuItem
          key={opt.id}
          value={opt.id}
          sx={{ fontSize: 14, py: 0.5, minHeight: 32 }}
        >
          {toCapitalizeWords(opt.name)}
        </MenuItem>
      ));
    }

    const groups = new Map();
    options.forEach((opt) => {
      const key = groupBy(opt) || "Otros";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(opt);
    });

    const items = [];
    groups.forEach((opts, label) => {
      items.push(
        <ListSubheader
          key={`subheader-${label}`}
          sx={{
            fontSize: 12,
            lineHeight: 1.25,
            color: "text.secondary",
            py: 1,
          }}
        >
          {toCapitalizeWords(label)}
        </ListSubheader>
      );
      opts.forEach((opt) => {
        items.push(
          <MenuItem
            key={opt.id}
            value={opt.id}
            sx={{ fontSize: 14, py: 0.5, minHeight: 32 }}
          >
            {toCapitalizeWords(opt.name)}
          </MenuItem>
        );
      });
    });
    return items;
  }, [options, groupBy]);
}
