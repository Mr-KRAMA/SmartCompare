"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { useDebouncedCallback } from "use-debounce";
import ProductTabs from "@/components/products/ProductsTabs";
import Link from "next/link";
import DOMPurify from 'dompurify';
import AuthGuard from '@/components/AuthGuard';

interface Listing {
  id: string;
  name: string;
  url: string;
  image: string;
  price: string;
  img: string;
}

interface DetailedListing {
  store_image: string;
  price: string;
  shipping: string[];
  store_url: string;
}

interface ProductData {
  id: string;
  name: string;
  price: string;
  features: string[];
  listings: Listing[];
  detailed_listings: DetailedListing[];
  specifications: Record<string, string[]>;
  carousel_images: string[];
}

interface ComparedProduct {
  id: string;
  catId: string;
  name: string;
  price: string;
  specifications: Record<string, string[]>;
}

function ProductDetail({
  params,
}: {
  params: { catId: string; id: string };
}) {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [activeTab, setActiveTab] = useState("specifications");
  const [comparedProduct, setComparedProduct] =
    useState<ComparedProduct | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareInput, setCompareInput] = useState({ id: "", catId: "" });
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Listing[]>([]);
  const [showLimited, setShowLimited] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        
        if (!params.catId || !params.id) {
          throw new Error('Invalid product parameters');
        }
        
        const encodedCatId = encodeURIComponent(params.catId);
        const encodedId = encodeURIComponent(params.id);
        
        const res = await fetch(
          `http://localhost:8000/details/${encodedCatId}/${encodedId}`
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Sanitize and validate data
        const sanitizedData = {
          ...data,
          name: DOMPurify.sanitize(data.name || 'Unknown Product'),
          price: DOMPurify.sanitize(data.price || 'Price not available'),
          features: Array.isArray(data.features) ? data.features.map((f: string) => DOMPurify.sanitize(f)) : [],
          carousel_images: Array.isArray(data.carousel_images) 
            ? data.carousel_images.filter((img: string) => img && img.startsWith("http"))
            : [],
          specifications: data.specifications || {},
          listings: Array.isArray(data.listings) ? data.listings : [],
          detailed_listings: Array.isArray(data.detailed_listings) ? data.detailed_listings : []
        };
        
        setProductData(sanitizedData);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setFetchError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [params.catId, params.id]);

  const handleSearch = useDebouncedCallback(async (newCat: string) => {
    if (!newCat || newCat.trim().length === 0) {
      setProducts([]);
      return;
    }

    try {
      const sanitizedCat = DOMPurify.sanitize(newCat.trim());
      const encodedCat = encodeURIComponent(sanitizedCat);
      const res = await fetch(`http://localhost:8000/search/${encodedCat}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      if (Array.isArray(data)) {
        const updatedData = data.map((item: any) => ({
          ...item,
          id: item.link ? item.link.split("/").pop() : '',
          name: DOMPurify.sanitize(item.name || ''),
          price: DOMPurify.sanitize(item.price || ''),
          img: item.img || '/placeholder-image.svg'
        }));

        setProducts(updatedData);
        setError("");
      } else {
        setProducts([]);
        setError("No products found for this category.");
      }
    } catch (err) {
      console.error('Search error:', err);
      setError("Failed to fetch products for this category.");
      setProducts([]);
    }
  }, 400);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (!params.catId) return;
        
        const encodedCatId = encodeURIComponent(params.catId);
        const res = await fetch(`http://localhost:8000/search/${encodedCatId}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();

        if (Array.isArray(data)) {
          const updatedData = data.map((item: any) => ({
            ...item,
            id: item.link ? item.link.split("/").pop() : '',
            name: DOMPurify.sanitize(item.name || ''),
            price: DOMPurify.sanitize(item.price || ''),
            img: item.img || '/placeholder-image.svg'
          }));

          setProducts(updatedData);
        }
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      }
    };

    fetchRelatedProducts();
  }, [params.catId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{fetchError}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  const allSpecKeys = Array.from(
    new Set([
      ...Object.keys(productData.specifications || {}),
      ...Object.keys(comparedProduct?.specifications || {}),
    ])
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Carousel */}
        <div>
          <Swiper
            key={productData.carousel_images.length}
            navigation
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Navigation, Autoplay]}
            loop
            className="sm-swiper"
          >
            {productData.carousel_images && productData.carousel_images.length > 0 ? (
              productData.carousel_images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img}
                    alt={productData.name}
                    className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg duration-500 animate-fadeIn"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                    }}
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <img
                  src="/placeholder-image.svg"
                  alt="No image available"
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
                />
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{productData.name}</h1>
          <p className="text-2xl font-bold mb-4">{productData.price}</p>

          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-gray-600">(4.5 out of 5)</span>
          </div>

          <div className="flex gap-4 mb-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowCompareModal(true)}
            >
              Compare Another Product
            </Button>
          </div>

          <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "specifications" && (
            <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
              {Object.entries(productData.specifications).map(
                ([category, specs], index) => (
                  <div
                    key={category}
                    className={`grid grid-cols-2 p-4 text-sm ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div className="font-semibold">{category}</div>
                    <div>{specs.join(", ")}</div>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "listings" && (
            <div className="mt-4 grid gap-4">
              {productData.detailed_listings.map((listing, index) => (
                <div key={index} className="border rounded-lg shadow-sm">
                  <div className="flex items-center justify-between p-4">
                    <img
                      src={listing.store_image}
                      alt="Store"
                      className="h-8"
                    />
                    <p className="text-lg font-bold">{listing.price}</p>
                    <div className="text-sm text-gray-500">
                      {listing.shipping.join(", ")}
                    </div>
                    <a
                      href={listing.store_url}
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Visit Store
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compare Modal */}
      {showCompareModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="relative bg-white p-6 rounded-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">

      {/* ❌ Close Button */}
      <button
        onClick={() => setShowCompareModal(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
      >
        ×
      </button>

      <h3 className="text-xl font-bold mb-4">Compare Another Product</h3>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <input
        type="text"
        placeholder="Enter Category Name (e.g. phones)"
        className="border p-2 w-full mb-4 rounded"
        value={compareInput.catId}
        onChange={(e) => {
          const newCat = e.target.value;
          setCompareInput({ ...compareInput, catId: newCat });
          handleSearch(newCat.trim());
        }}
      />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded hover:bg-gray-100 cursor-pointer"
              onClick={async () => {
                try {
                  const res = await fetch(
                    `http://localhost:8000/details/${params.catId}/${product.id}`
                  );
                  const data = await res.json();

                  const newProduct: ComparedProduct = {
                    id: product.id,
                    catId: compareInput.catId,
                    name: data.name,
                    price: data.price,
                    specifications: data.specifications || {},
                  };

                  setComparedProduct(newProduct);
                  setCompareInput({ id: "", catId: "" });
                  setProducts([]);
                  setShowCompareModal(false);
                  setError("");
                } catch (err) {
                  console.error("Compare Error:", err);
                  setError("Failed to fetch product details.");
                }
              }}
            >
              <img
                src={product.img}
                alt={product.name}
                className="h-32 w-full object-contain mb-2"
              />
              <h4 className="font-bold text-sm">{product.name}</h4>
              <p className="text-green-600 text-sm">{product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          Enter a valid category to see products.
        </p>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <Button
          onClick={() => setShowCompareModal(false)}
          variant="ghost"
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
)}

      {/* Comparison Table */}
      {comparedProduct && (
        <div
          ref={compareRef}
          className="mt-10 border border-gray-300 p-4 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Product Comparison</h2>
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm md:text-base">
            <thead className="bg-gray-200 text-gray-800 font-semibold">
              <tr>
                <th className="px-4 py-3 border border-gray-300 text-left">
                  Specification
                </th>
                <th className="px-4 py-3 border border-gray-300 text-left">
                  Product 1
                </th>
                <th className="px-4 py-3 border border-gray-300 text-left">
                  Product 2
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="bg-gray-100">
                <td className="px-4 py-3 font-bold border border-gray-300">
                  Name
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {productData.name}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {comparedProduct.name}
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-bold border border-gray-300">
                  Price
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {productData.price}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {comparedProduct.price}
                </td>
              </tr>
              {allSpecKeys.map((key, idx) => (
                <tr
                  key={key}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-3 font-bold border border-gray-300">
                    {key}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {productData.specifications[key]?.join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {comparedProduct.specifications[key]?.join(", ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button
            variant="destructive"
            className="mt-4"
            onClick={() => setComparedProduct(null)}
          >
            Clear Comparison
          </Button>
        </div>
      )}

      {/* 🔥 More Products Section */}
      {products.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            More Products in this Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {(showLimited ? products.slice(0, 10) : products).map((product) => (
              <Link
                key={product.id}
                href={`/details/${params.catId}/${product.id}`}
              >
                <div className="border rounded p-4 hover:shadow-md transition duration-200 cursor-pointer">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="h-32 w-full object-contain mb-2"
                  />
                  <h4 className="font-bold text-sm line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-green-600 text-sm">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
          {products.length > 10 && (
            <div className="mt-4 text-center">
              <Button
                onClick={() => setShowLimited((prev) => !prev)}
                variant="outline"
              >
                {showLimited ? "Show All" : "Show Less"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SpecsPage({ params }: { params: { catId: string; id: string } }) {
  return (
    <AuthGuard>
      <ProductDetail params={params} />
    </AuthGuard>
  );
}
