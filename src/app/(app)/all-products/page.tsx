'use client'
import { Card, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button" 
import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel"
import AutoPlay from 'embla-carousel-autoplay'
import { motion } from "framer-motion" 
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner" 
import { Product, ProductCard } from "@/components/ProductCard"

export default function AllProducts() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/get-inStock-product')
                setProducts(res.data.data)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                const errorMessage = axiosError.response?.data.message
                toast.error(errorMessage ? errorMessage : 'Server Error: Something went wrong')
            }
        }
        fetchProducts()
    }, [])

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
                        <ProductCard key={product.id} product={product} index={index}/>
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
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </main>
        </div>
    )
}
