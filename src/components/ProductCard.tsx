'use client'
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { ShoppingCart } from "lucide-react"
import { Button } from "./ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addToCart } from "@/lib/store/features/cartSlice"
import { toast } from "sonner"
import { Badge } from "./ui/badge"

export interface Product {
    id: string,
    name: string,
    description: string,
    image: string,
    unit: string,
    category: string,
    inStock: boolean
    MRP: number,
    discount: number, 
    discountPrice: number,
    quantity: number,
};

type ProductCardProps = {
    product: Product;
    index: number;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {

    const dispatch = useAppDispatch();
    const cart = useAppSelector(state => state.cart.cart.items); 

    function handleAddToCart(product: Product) { 
        dispatch(
            addToCart(product)
        ); 
        toast.success(`${product.name} added to cart!`);
    }

    return (
        <>
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
                            {product.discount}% Off
                        </Badge>
                    </CardHeader>

                    <CardContent className="px-2 md:px-4 flex-grow">
                        <h3 className="text-base font-semibold mb-1  ">{product.name}</h3>
                        <p className="text-xs line-clamp-2">{product.description}</p>
                    </CardContent>

                    <CardFooter className="px-2 md:px-4 flex items-center justify-between">
                        <div className="flex items-baseline space-x-1">
                            <span className="text-md md:text-lg font-semibold  ">
                                ₹{product.discountPrice}
                            </span>
                            <span className="text-sm md:text-md text-muted-foreground line-through mr-2">
                                ₹{product.MRP}
                            </span>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-neutral-800 hover:text-white"
                            onClick={() => handleAddToCart(product)}
                        >
                            <ShoppingCart className="w-2 h-2 md:w-4 md:h-4 mr-1" /> Add
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </>
    )
}
