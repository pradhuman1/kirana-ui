"use client";

import { useState, useEffect } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import productsData from "@/app/data/products.json";
import Input from "@/app/components/input";
import TextArea from "@/app/components/TextArea";
import Button from "@/app/components/Button";
import SearchEntity from "@/app/components/Functional/SearchEntity";
import ImagePreview from "@/app/components/Functional/ImagePreview";
import ApiHelper from "@/app/Utils/apiHelper";
import apiEndPoints from "@/app/Utils/apiEndPoints";
import Notification from "@/app/components/Notification";

interface ProductVariant {
  productID: string;
  productTitle: string;
  weight: string;
  price: string;
  brand: string;
  variants: ProductVariant[];
  imagesUrl: string[];
}

interface Product {
  productID: string;
  productTitle: string;
  weight: string;
  price: string;
  brand: string;
  variants: ProductVariant[];
  imagesUrl: string[];
}

interface Variant {
  size: string;
  color: string;
  stock: string;
  image?: string;
}

interface FormVariant {
  size: string;
  color: string;
  stock: string;
  image: string;
  name: string;
  price: string;
  weight: string;
}

export default function ManualUpload() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productStock, setProductStock] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    image: "",
    variants: [
      {
        size: "",
        color: "",
        stock: "",
        image: "",
        name: "",
        price: "",
        weight: "",
      },
    ] as FormVariant[],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [variantImagePreviews, setVariantImagePreviews] = useState<
    (string | null)[]
  >([null]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
    title?: string;
  }>({
    show: false,
    message: "",
    type: "success",
    title: "Success",
  });

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.productTitle,
        description: "",
        category: "",
        brand: selectedProduct.brand,
        price: selectedProduct.price,
        stock: "",
        image: selectedProduct.imagesUrl[0] || "",
        variants:
          selectedProduct?.variants?.map((v) => ({
            size: v.weight,
            color: "",
            stock: "",
            image: v.imagesUrl?.[0] || "",
            name: v.productTitle,
            price: v.price,
            weight: v.weight,
          })) || [],
      });
      setImagePreview(selectedProduct.imagesUrl[0] || null);
      setVariantImagePreviews(
        selectedProduct?.variants?.map((v) => v.imagesUrl?.[0] || null) || []
      );
    }
  }, [selectedProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...variantImagePreviews];
        newPreviews[index] = reader.result as string;
        setVariantImagePreviews(newPreviews);

        const newVariants = [...formData.variants];
        newVariants[index] = {
          ...newVariants[index],
          image: reader.result as string,
        };
        setFormData({ ...formData, variants: newVariants });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("api", apiEndPoints.addProduct);
      const response = await ApiHelper.post(apiEndPoints.addProduct, {
        productId: selectedProduct.productID,
        quantity: productStock,
      });

      if (response.data) {
        // Show success notification
        setNotification({
          show: true,
          message: `${selectedProduct.productTitle} successfully added`,
          type: "success",
          title: "Product Added",
        });

        // Reset form after successful submission
        setSelectedProduct(null);
        setProductStock(0);
        setFormData({
          name: "",
          description: "",
          category: "",
          brand: "",
          price: "",
          stock: "",
          image: "",
          variants: [
            {
              size: "",
              color: "",
              stock: "",
              image: "",
              name: "",
              price: "",
              weight: "",
            },
          ],
        });
        setImagePreview(null);
        setVariantImagePreviews([null]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add inventory";
      setError(errorMessage);
      setNotification({
        show: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          size: "",
          color: "",
          stock: "",
          image: "",
          name: "",
          price: "",
          weight: "",
        },
      ],
    });
    setVariantImagePreviews([...variantImagePreviews, null]);
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
    setVariantImagePreviews(variantImagePreviews.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Notification
        show={notification.show}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
      />
      <h1 className="text-2xl font-semibold mb-5">Add New Product</h1>

      <div className="mb-5">
        <SearchEntity
          selectedEntity={selectedProduct}
          onEntitySelect={(product) => {
            setSelectedProduct(product);
            if (!product) {
              setFormData({
                name: "",
                description: "",
                category: "",
                brand: "",
                price: "",
                stock: "",
                image: "",
                variants: [
                  {
                    size: "",
                    color: "",
                    stock: "",
                    image: "",
                    name: "",
                    price: "",
                    weight: "",
                  },
                ],
              });
              setImagePreview(null);
              setVariantImagePreviews([null]);
            }
          }}
          placeholder="Search from product catalogue..."
          apiEndPoint={`product/search-product`}
        />
      </div>

      {selectedProduct && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="sm:col-span-1 main-product-image">
              <div className="mt-2 flex justify-center">
                <div className="relative w-full max-w-[200px]">
                  <ImagePreview
                    imageUrl={
                      imagePreview ||
                      "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/127144a.jpg?ts=1690815073"
                    }
                    onRemove={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: "" });
                    }}
                  />
                  {!imagePreview && (
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <Input
                id="name"
                name="name"
                type="text"
                label="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                isDisabled={true}
              />
            </div>

            <div>
              <Input
                id="brand"
                name="brand"
                type="text"
                label="Brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                required
                isDisabled={true}
              />
            </div>

            <div>
              <Input
                id="category"
                name="category"
                type="text"
                label="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                isDisabled={true}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <div>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  label="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  isDisabled={true}
                />
              </div>

              <div>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  label="Stock"
                  value={productStock.toString()}
                  onChange={(e) => setProductStock(Number(e.target.value))}
                  required={true}
                  infoMessage="If you don't know the stock, leave it blank"
                  isDisabled={false}
                />
              </div>
            </div>
          </div>

          <div>
            <TextArea
              name="description"
              label="Description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="sm:col-span-2 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Similar Products
              </h3>
            </div>
            <div
              className={`grid gap-4 ${
                formData.variants.length === 1
                  ? "grid-cols-3"
                  : formData.variants.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {formData.variants.map((variant, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative w-full">
                    <ImagePreview
                      imageUrl={variantImagePreviews[index]}
                      onRemove={() => {
                        const newPreviews = [...variantImagePreviews];
                        newPreviews[index] = null;
                        setVariantImagePreviews(newPreviews);
                        const newVariants = [...formData.variants];
                        newVariants[index] = {
                          ...newVariants[index],
                          image: "",
                        };
                        setFormData({ ...formData, variants: newVariants });
                      }}
                    />
                    {!variantImagePreviews[index] && (
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={(e) => handleVariantImageChange(index, e)}
                      />
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {variant.weight && variant.name
                      ? `${variant.weight} - ${variant.name}`
                      : `Variant ${index + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-49">
            <div className="w-full px-4 sm:px-6 md:max-w-4xl md:mx-auto flex justify-end">
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                disabled={isSubmitting || !selectedProduct}
              >
                {isSubmitting ? "Adding..." : "Add Inventory"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
