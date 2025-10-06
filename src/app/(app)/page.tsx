'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import AutoPlay from 'embla-carousel-autoplay'
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  discount: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Stainless Door Hinge",
    description: "Durable and rust-proof hinge for modern doors.",
    image: "https://placehold.co/400",
    price: "₹150",
    discount: "10% Off"
  },
  {
    id: 2,
    name: "Brass Cabinet Knob",
    description: "Elegant brass knob with premium finish.",
    image: "https://placehold.co/400",
    price: "₹80",
    discount: "8% Off"
  },
  {
    id: 3,
    name: "Aluminum Window Handle",
    description: "Lightweight and sturdy window handle.",
    image: "https://placehold.co/400",
    price: "₹95",
    discount: "5% Off"
  },
  {
    id: 4,
    name: "Heavy-Duty Drawer Slide",
    description: "Smooth and strong sliding for drawers.",
    image: "https://placehold.co/400",
    price: "₹240",
    discount: "12% Off"
  },
  {
    id: 5,
    name: "Steel Door Stopper",
    description: "Protects doors and walls with stability.",
    image: "https://placehold.co/400",
    price: "₹40",
    discount: "15% Off"
  },
  {
    id: 1,
    name: "Stainless Door Hinge",
    description: "Durable and rust-proof hinge for modern doors.",
    image: "https://placehold.co/400",
    price: "₹150",
    discount: "10% Off"
  },
  {
    id: 2,
    name: "Brass Cabinet Knob",
    description: "Elegant brass knob with premium finish.",
    image: "https://placehold.co/400",
    price: "₹80",
    discount: "8% Off"
  },
  {
    id: 3,
    name: "Aluminum Window Handle",
    description: "Lightweight and sturdy window handle.",
    image: "https://placehold.co/400",
    price: "₹95",
    discount: "5% Off"
  },
  {
    id: 4,
    name: "Heavy-Duty Drawer Slide",
    description: "Smooth and strong sliding for drawers.",
    image: "https://placehold.co/400",
    price: "₹240",
    discount: "12% Off"
  },
  {
    id: 5,
    name: "Steel Door Stopper",
    description: "Protects doors and walls with stability.",
    image: "https://placehold.co/400",
    price: "₹40",
    discount: "15% Off"
  }
]

export default function Home() {
  return (
    <div className="font-sans min-h-screen px-4 md:px-8">
      
      {/* HERO SECTION */}
      <section className="max-w-full mx-aut pt-6">
        <Carousel plugins={[AutoPlay({ delay: 4000 })]} className="w-full">
          <CarouselContent>
            {[1, 2, 3].map((num) => (
              <CarouselItem key={num}>
                <Card className="overflow-hidden border-none shadow-xl rounded-2xl">
                  <CardContent className="h-56 md:h-72 flex flex-col justify-center items-center text-center">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-3xl md:text-5xl font-semibold mb-3"
                    >
                      Premium Hardware Collection
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="max-w-md"
                    >
                      Built for strength, precision, and timeless design.
                    </motion.p>
                    <Button
                      variant="outline"
                      className="mt-6"
                    >
                      Explore Now
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent> 
        </Carousel>
      </section>

      <main className="py-8 md:py-16">
      {/* FEATURED PRODUCTS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-semibold ">Featured Products</h2>
          <Separator className="mt-4 w-24 mx-auto h-[2px]" />
        </motion.div>

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className="flex"
            >
              <Card className="rounded-xl hover:shadow-lg hover:shadow-neutral-800/30 transition-all duration-300 w-full h-full py-0 pb-4 gap-2">
                <CardHeader className="p-0 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-32 md:h-44 w-full object-cover rounded-t-xl"
                  />
                  <Badge className="absolute top-3 left-3 border text-xs">
                    {product.discount}
                  </Badge>
                </CardHeader>

                <CardContent className="px-2 md:px-4 flex-grow">
                  <h3 className="text-base font-semibold mb-1  ">{product.name}</h3>
                  <p className="text-xs line-clamp-2">{product.description}</p>
                </CardContent>

                <CardFooter className="px-2 md:px-4 flex items-center justify-between">
                  <span className="text-md md:text-lg font-semibold  ">{product.price}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-neutral-800 hover:text-white"
                  >
                    <ShoppingCart className="w-2 h-2 md:w-4 md:h-4 mr-1" /> Buy
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>


        {/* FEATURED PRODUCTS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-semibold mt-8">Featured Products</h2>
          <Separator className="mt-4 w-24 mx-auto h-[2px]" />
        </motion.div>

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className="flex"
            >
              <Card className="rounded-xl hover:shadow-lg hover:shadow-neutral-800/30 transition-all duration-300 w-full h-full py-0 pb-4 gap-2">
                <CardHeader className="p-0 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-32 md:h-44 w-full object-cover rounded-t-xl"
                  />
                  <Badge className="absolute top-3 left-3 border text-xs">
                    {product.discount}
                  </Badge>
                </CardHeader>

                <CardContent className="px-2 md:px-4 flex-grow">
                  <h3 className="text-base font-semibold mb-1  ">{product.name}</h3>
                  <p className="text-xs line-clamp-2">{product.description}</p>
                </CardContent>

                <CardFooter className="px-2 md:px-4 flex items-center justify-between">
                  <span className="text-md md:text-lg font-semibold  ">{product.price}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-neutral-800 hover:text-white"
                  >
                    <ShoppingCart className="w-2 h-2 md:w-4 md:h-4 mr-1" /> Buy
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
