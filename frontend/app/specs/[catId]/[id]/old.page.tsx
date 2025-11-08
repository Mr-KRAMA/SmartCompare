"use client"
import { useState } from 'react'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Specification {
  [key: string]: string
}

interface EcommerceListing {
  image_url: string
  price: string
}

interface ProductData {
  product_name: string
  product_price: string
  specifications: Specification
  ecommerce_listings: EcommerceListing[]
}

export default function ProductDetail() {
  const [activeTab, setActiveTab] = useState('specifications')

  // This would typically come from your API or props
  const productData: ProductData = {
    "product_name": "Motorola Moto G85 5G",
    "product_price": "₹18,992",
    "specifications": {
      "Android v14": "Good",
      "Thickness: 7.59 mm": "Slim",
      "172 g": "Light",
      "6.67 inch, pOLED Screen": "Average",
      "1080 x 2400 pixels": "Average",
      "393 ppi": "Poor",
      "50 MP + 8 MP Dual Rear Camera with OIS": "Average",
      "32 MP Front Camera": "Average",
      "2.3 GHz, Octa Core Processor": "Average",
      "8 GB RAM + 8 GB Virtual RAM": "Average",
      "128 GB Inbuilt Memory": "Average",
      "5000 mAh Battery": "Average"
    },
    "ecommerce_listings": [
      {
        "image_url": "https://cdn1.smartprix.com/rx-iAJ5bGSls-w100-h33/amazon.jpg",
        "price": "₹18,992"
      }
    ]
  }

  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'good':
        return 'text-green-500'
      case 'average':
        return 'text-yellow-500'
      case 'poor':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src="/placeholder.svg?height=400&width=400" alt={productData.product_name} className="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{productData.product_name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="ml-2 text-gray-600">(4.5 out of 5)</span>
          </div>
          <p className="text-2xl font-bold mb-4">{productData.product_price}</p>
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
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="ecommerce">E-commerce Listings</TabsTrigger>
            </TabsList>
            <TabsContent value="specifications" className="mt-4">
              <Table>
                <TableBody>
                  {Object.entries(productData.specifications).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell className={getRatingColor(value)}>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="ecommerce" className="mt-4">
              <div className="grid gap-4">
                {productData.ecommerce_listings.map((listing, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-between p-4">
                      <img src={listing.image_url} alt="E-commerce logo" className="h-8" />
                      <p className="text-lg font-bold">{listing.price}</p>
                      <Button>Visit Store</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}




/*
"use client"

import {useEffect} from 'react'

export default function Specs({params} :{params: {catId: string, id: string}}) {

  useEffect(() => {
    const fetchSpecs = async () => {
      const res = await fetch(`http://localhost:8000/details/${params.catId}/${params.id}`)
      const data = res.json()
      console.log(data)
    }
  })

  return (
    <div>ID: {params.id} {params.catId}</div>
  )
}
*/
