import { useState, useEffect } from "react";
import { getProductImageById, ProductImage } from "@/features/products/api";

export const useProductImage = (productId?: string) => {
  const [image, setImage] = useState<ProductImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductImage = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const imageData = await getProductImageById(id);
      setImage(imageData);
    } catch (error: any) {
      console.error("Failed to fetch product image:", error);
      setError(error.message || "Failed to load product image");
      setImage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductImage(productId);
    }
  }, [productId]);

  const refetchImage = () => {
    if (productId) {
      fetchProductImage(productId);
    }
  };

  return {
    image,
    loading,
    error,
    refetchImage,
  };
};
