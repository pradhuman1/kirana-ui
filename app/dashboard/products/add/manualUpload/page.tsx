"use client";

import { useState, useEffect } from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { PhotoIcon } from "@heroicons/react/24/outline";
import productsData from "@/app/data/products.json";
import Input from "@/app/components/input";
import TextArea from "@/app/components/TextArea";
import Button from "@/app/components/Button";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  image?: string;
  variants: {
    id: string;
    size: string;
    color: string;
    stock: number;
    image?: string;
  }[];
  relatedProducts: string[];
}

interface Variant {
  size: string;
  color: string;
  stock: string;
  image?: string;
}

export default function ManualUpload() {
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    image: "",
    variants: [{ size: "", color: "", stock: "", image: "" }],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [variantImagePreviews, setVariantImagePreviews] = useState<
    (string | null)[]
  >([null]);

  const filteredProducts =
    query === ""
      ? productsData.products
      : productsData.products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        category: selectedProduct.category,
        brand: selectedProduct.brand,
        price: selectedProduct.price.toString(),
        stock: selectedProduct.stock.toString(),
        image: selectedProduct.image || "",
        variants: selectedProduct.variants.map((v) => ({
          size: v.size,
          color: v.color,
          stock: v.stock.toString(),
          image: v.image || "",
        })),
      });
      setImagePreview(selectedProduct.image || null);
      setVariantImagePreviews(
        selectedProduct.variants.map((v) => v.image || null)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: "", color: "", stock: "", image: "" },
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>

      <div className="mb-8">
        <Combobox value={selectedProduct} onChange={setSelectedProduct}>
          <div className="relative">
            <Combobox.Input
              className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(product: Product) => product?.name ?? ""}
              placeholder="Search for existing products..."
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredProducts.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                No products found. You can add a new one below.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Combobox.Option
                  key={product.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={product}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {product.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-indigo-600"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Combobox>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, image: "" });
                      }}
                      className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
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
            />
          </div>

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
            />
          </div>

          <div>
            <Input
              id="stock"
              name="stock"
              type="number"
              label="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              required
            />
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

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Variants</h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addVariant}
            >
              Add Variant
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            {formData.variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 sm:grid-cols-5"
              >
                <div className="sm:col-span-1">
                  <div className="relative">
                    {variantImagePreviews[index] ? (
                      <div className="relative">
                        <img
                          src={variantImagePreviews[index] || ""}
                          alt={`${variant.color} ${variant.size} variant`}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
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
                          className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-20 w-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500">
                        <PhotoIcon className="h-6 w-6 text-gray-400" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleVariantImageChange(index, e)}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div>
                  <Input
                    id={`variant-size-${index}`}
                    name={`variant-size-${index}`}
                    type="text"
                    placeholder="Size"
                    value={variant.size}
                    onChange={(e) =>
                      updateVariant(index, "size", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Input
                    id={`variant-color-${index}`}
                    name={`variant-color-${index}`}
                    type="text"
                    placeholder="Color"
                    value={variant.color}
                    onChange={(e) =>
                      updateVariant(index, "color", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Input
                    id={`variant-stock-${index}`}
                    name={`variant-stock-${index}`}
                    type="number"
                    placeholder="Stock"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(index, "stock", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeVariant(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Add Product
          </Button>
        </div>
      </form>
    </div>
  );
}
