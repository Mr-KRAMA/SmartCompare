'use client'
import { useState } from 'react'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductComparison() {
  const [activeTab, setActiveTab] = useState('description')

  const product = {
    name: "Smartphone X",
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.5,
    price: 799.99,
    description: "The latest Smartphone X with advanced features and cutting-edge technology.",
    specifications: [
      { name: "Display", value: "6.5 inch OLED, 120Hz refresh rate, HDR10+" },
      { name: "Processor", value: "Octa-core 2.8 GHz, 5nm process" },
      { name: "RAM", value: "8 GB LPDDR5" },
      { name: "Storage", value: "128 GB UFS 3.1" },
      { name: "Main Camera", value: "Triple 12 MP (wide), 12 MP (ultrawide), 12 MP (telephoto)" },
      { name: "Front Camera", value: "32 MP, 4K video" },
      { name: "Battery", value: "4500 mAh, 25W fast charging, 15W wireless charging" },
      { name: "OS", value: "Android 13" },
      { name: "Connectivity", value: "5G, Wi-Fi 6, Bluetooth 5.2, NFC" },
      { name: "Security", value: "In-display fingerprint sensor, Face unlock" },
      { name: "Water Resistance", value: "IP68 dust/water resistant" },
    ],
    additionalInfo: [
      { name: "Warranty", value: "1 year manufacturer warranty" },
      { name: "Return Policy", value: "30-day return policy" },
      { name: "In the Box", value: "Smartphone X, USB-C cable, Quick start guide" },
      { name: "Colors Available", value: "Midnight Black, Ocean Blue, Sunset Gold" },
    ],
  }

  const comparisons = [
    { site: "E-commerce A", price: 799.99, delivery: "Free", rating: 4.5 },
    { site: "E-commerce B", price: 789.99, delivery: "$5.99", rating: 4.3 },
    { site: "E-commerce C", price: 809.99, delivery: "Free", rating: 4.6 },
  ]

  const suggestedProducts = [
    { name: "Smartphone Y", price: 699.99, image: "/placeholder.svg?height=200&width=200" },
    { name: "Wireless Earbuds", price: 129.99, image: "/placeholder.svg?height=200&width=200" },
    { name: "Smartwatch Z", price: 249.99, image: "/placeholder.svg?height=200&width=200" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="ml-2 text-gray-600">{product.rating}</span>
          </div>
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <div className="flex space-x-4 mb-6">
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button variant="outline">
              <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="additionalInfo">Additional Info</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p>{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableBody>
                    {product.specifications.map((spec) => (
                      <TableRow key={spec.name}>
                        <TableCell className="font-medium">{spec.name}</TableCell>
                        <TableCell>{spec.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="additionalInfo" className="mt-4">
              <Table>
                <TableBody>
                  {product.additionalInfo.map((info) => (
                    <TableRow key={info.name}>
                      <TableCell className="font-medium">{info.name}</TableCell>
                      <TableCell>{info.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Price Comparison</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>E-commerce Site</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisons.map((comparison) => (
              <TableRow key={comparison.site}>
                <TableCell>{comparison.site}</TableCell>
                <TableCell>${comparison.price.toFixed(2)}</TableCell>
                <TableCell>{comparison.delivery}</TableCell>
                <TableCell>{comparison.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Suggested Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestedProducts.map((product) => (
            <Card key={product.name}>
              <CardHeader>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
              </CardHeader>
              <CardContent>
                <CardTitle>{product.name}</CardTitle>
                <p className="text-lg font-semibold mt-2">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
