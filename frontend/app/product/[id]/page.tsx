'use client'
import { useParams } from 'next/navigation';

const products = [
  { id: '1', name: 'Product 1', description: 'Description for Product 1' },
  { id: '2', name: 'Product 2', description: 'Description for Product 2' },
  { id: '3', name: 'Product 3', description: 'Description for Product 3' },
];

export default function ProductDetails() {
  const params = useParams(); // Get the dynamic route params (like `id`)
  const { id } = params; // Extract the id from the params

  const product = products.find((p) => p.id === id);

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
