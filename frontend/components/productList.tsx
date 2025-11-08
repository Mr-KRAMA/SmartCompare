import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import DOMPurify from 'dompurify';

interface Listing {
  id: string;
  name: string;
  url: string;
  image: string;
  price: string;
}


function ProductListModal({ category, onSelect }: { category: string, onSelect: (product: { id: string, name: string, price: string }) => void }) {
  const [products, setProducts] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Adding error state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const encodedCategory = encodeURIComponent(category);
        const res = await fetch(`http://localhost:8000/search/${encodedCategory}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        // Sanitize data to prevent XSS
        const sanitizedData = data.map((product: any) => ({
          ...product,
          name: DOMPurify.sanitize(product.name || ''),
          price: DOMPurify.sanitize(product.price || ''),
          image: product.image || '',
          url: product.url || ''
        }));
        
        setProducts(sanitizedData);
      } catch (err) {
        console.error("Failed to fetch product list:", err);
        setError('Failed to fetch product list. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (category) {
      fetchProducts();
    }
  }, [category]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>; // Display error message if error state is set
  if (!products.length) return <p>No products found in this category.</p>;

  return (
    <>
      {products.map((product, index) => (
        <div key={index} className="border rounded p-4 flex flex-col items-center">
          <img src={product.image} alt={product.name} className="h-32 object-contain mb-2" />
          <h4 className="font-semibold text-center">{product.name}</h4>
          <p className="text-sm text-gray-500 mb-2">{product.price}</p>
          <Button
            className="bg-green-600 text-white"
            onClick={() => {
              // extract id from URL like: /products/phones/someproductID
              const match = product.url.match(/\/([^\/]+)\/([^\/]+)$/);
              if (match) {
                const id = match[2];
                onSelect({ id, name: product.name, price: product.price });
              }
            }}
          >
            Compare
          </Button>
        </div>
      ))}
    </>
  );
}

export default ProductListModal;