import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProductList from "../components/ProductList";
import { Box } from "@mui/material";

const Products = () => {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <Box sx={{ p: 2 }}>
        <ProductList token={auth.token} />
      </Box>
    </>
  );
};

export default Products;
