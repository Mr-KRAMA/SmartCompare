"use client"
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// This would typically come from your API or database
const products = [
  {
    id: '1',
    name: 'Smartphone X',
    image: '/placeholder.svg?height=300&width=300',
    price: 799.99,
    rating: 4.5,
    description: 'The latest Smartphone X with advanced features.'
  },
  {
    id: '2',
    name: 'Laptop Pro',
    image: '/placeholder.svg?height=300&width=300',
    price: 1299.99,
    rating: 4.7,
    description: 'Powerful Laptop Pro for all your computing needs.'
  },
  {
    id: '3',
    name: 'Wireless Earbuds',
    image: '/placeholder.svg?height=300&width=300',
    price: 149.99,
    rating: 4.3,
    description: 'High-quality wireless earbuds with noise cancellation.'
  },
  {
    id: '4',
    name: 'Smart Watch',
    image: '/placeholder.svg?height=300&width=300',
    price: 249.99,
    rating: 4.6,
    description: 'Feature-packed smart watch for fitness and more.'
  },
  {
    id: '5',
    name: 'Tablet Ultra',
    image: '/placeholder.svg?height=300&width=300',
    price: 499.99,
    rating: 4.4,
    description: 'Versatile Tablet Ultra for work and entertainment.'
  },
  {
    id: '6',
    name: 'Bluetooth Speaker',
    image: '/placeholder.svg?height=300&width=300',
    price: 79.99,
    rating: 4.2,
    description: 'Portable Bluetooth speaker with impressive sound.'
  },
  {
    id: '7',
    name: 'Gaming Console',
    image: '/placeholder.svg?height=300&width=300',
    price: 499.99,
    rating: 4.8,
    description: 'Next-gen gaming console for immersive gameplay.'
  },
  {
    id: '8',
    name: 'Wireless Mouse',
    image: '/placeholder.svg?height=300&width=300',
    price: 39.99,
    rating: 4.1,
    description: 'Ergonomic wireless mouse for comfortable use.'
  },
  {
    id: '9',
    name: 'External SSD',
    image: '/placeholder.svg?height=300&width=300',
    price: 129.99,
    rating: 4.6,
    description: 'Fast and portable external SSD for extra storage.'
  },
  {
    id: '10',
    name: 'Mechanical Keyboard',
    image: '/placeholder.svg?height=300&width=300',
    price: 89.99,
    rating: 4.4,
    description: 'Responsive mechanical keyboard for typing enthusiasts.'
  },
  // Add more products as needed
]

export default function ProductListing() {
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(6)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulating API call
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // In a real application, you would fetch data from your API here
        // const response = await fetch('/api/products')
        // if (!response.ok) throw new Error('Failed to fetch products')
        // const data = await response.json()
        // setProducts(data)
        
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setLoading(false)
      } catch (err) {
        setError('Failed to load products. Please try again later.')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  const totalPages = Math.ceil(products.length / productsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleProductsPerPageChange = (value: string) => {
    setProductsPerPage(Number(value))
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select value={productsPerPage.toString()} onValueChange={handleProductsPerPageChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="6" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <Card key={product.id} className="flex flex-col justify-between">
            <CardHeader>
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">{product.name}</CardTitle>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
              </div>
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            onClick={() => handlePageChange(index + 1)}
            className="w-10 h-10 p-0"
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}


/*
export default function Device({ params }: { params: { slug: string } }) {
  return <div>My Post: {params.slug}</div>
}*/
