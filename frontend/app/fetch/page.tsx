// app/search/page.js

async function getProducts(query) {
  const res = await fetch(`http://localhost:8000/scrape/${query}`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data.products;
}

export default async function Search({ searchParams }) {
  const query = searchParams.q || 'laptops';  // Default to 'laptops' if no query provided
  const products = await getProducts(query);

  return (
    <div>
      <h1>Product Scraper</h1>
      <form method="get">
        <input type="text" name="q" placeholder="Search for a product" />
        <button type="submit">Search</button>
      </form>
      <div>
        <h2>Results for: {query}</h2>
        {products.length > 0 ? (
          <ul>
            {products.map((product, index) => (
              <li key={index}>
                {product.name} - {product.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}

