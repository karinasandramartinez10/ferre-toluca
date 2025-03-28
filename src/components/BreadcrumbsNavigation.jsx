import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

const BreadcrumbsNavigation = ({ items = [] }) => {
  const router = useRouter();

  const handleNavigation = (path) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return isLast ? (
          <Typography key={item.label} color="text.primary">
            {item.label}
          </Typography>
        ) : (
          <Link
            href={item.path}
            key={item.label}
            component={NextLink}
            underline="hover"
            onClick={() => handleNavigation(item.path)}
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
