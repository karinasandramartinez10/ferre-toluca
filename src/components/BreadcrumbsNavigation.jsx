import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NextLink from "next/link";

const BreadcrumbsNavigation = ({ items = [] }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const hasPath = Boolean(item.path);
        const key = `${item.label}-${item.path || index}`;

        if (isLast || !hasPath) {
          return (
            <Typography
              key={key}
              color="text.primary"
              aria-current={isLast ? "page" : undefined}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            href={item.path}
            key={key}
            component={NextLink}
            underline="hover"
            sx={{ cursor: "pointer" }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNavigation;
