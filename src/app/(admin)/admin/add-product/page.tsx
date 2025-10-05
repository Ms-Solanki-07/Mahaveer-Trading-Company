"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useDropzone } from "react-dropzone"
import { Loader2, Upload } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addProductSchema } from "@/schemas/addProductSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

export default function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [discountedPrice, setDiscountedPrice] = useState('')
  const [MRP, setMRP] = useState('')
  const [discount, setDiscount] = useState('')

  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file =>
      (file.type === "image/png" || file.type === "image/jpeg") &&
      file.size <= 5 * 1024 * 1024
    )
    setFiles(validFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024,
  })

  //zod implemenation
  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: '',
      description: '',
      MRP: '',
      discount: '0',
      unit: '',
      category: '',
      inStock: true
    }
  })

  useEffect(() => {
    const mrpNum = parseFloat(MRP) || 0
    const discountNum = parseFloat(discount) || 0
    const discounted = mrpNum - (mrpNum * discountNum) / 100
    setDiscountedPrice(discounted.toFixed(2))
  }, [MRP, discount])


  const onSubmit = async (data: z.infer<typeof addProductSchema>) => {
    setIsSubmitting(true)
    try {
      // Add image property to data
      const formData = { ...data, image: files[0] }
      console.log(formData)
      const res = await axios.post<ApiResponse>('/api/add-product', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success(res.data.message);
      form.reset()
      setFiles([])
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      toast.error(errorMessage ? errorMessage : 'Server Error: Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDiscard = () => {
    form.reset()
    setFiles([])
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="md:text-2xl font-bold">Add Products</h1>
            <div className="flex gap-2">
              <Button onClick={handleDiscard} variant="outline">Discard</Button>
              <Button type="submit" className="" disabled={isSubmitting}>
                {
                  isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : ('Add Product')
                }
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Section */}
            <div className="md:col-span-2 space-y-6">
              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Set a description for better visibility." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Product Images */}
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/20 transition"
                  >

                    <div>
                      <input type="file" {...getInputProps()} />
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-8 rounded-full flex items-center justify-center border">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      {isDragActive ? (
                        <p className="text-sm font-medium">Drop the images here…</p>
                      ) : (
                        <>
                          <p className="text-sm font-medium">Drop Product images here</p>
                          <p className="text-xs text-muted-foreground">PNG or JPG (max. 5MB)</p>
                          <Button variant="outline" size="sm" className="mt-0">
                            <Upload className="mr-2 h-4 w-4" /> Select images
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Preview thumbnails */}
                  {files.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="rounded-lg border object-cover w-full h-32"
                          />
                          <p className="text-xs mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <FormField
                    name="MRP"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0.00"
                            {...field}
                            onChange={e => {
                              setMRP(e.target.value)
                              field.onChange(e)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="discount"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (in Percentage)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0.00"
                            {...field}
                            onChange={e => {
                              setDiscount(e.target.value)
                              field.onChange(e)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <Label>Discounted Price</Label>
                    <Input disabled placeholder="0.00" value={discountedPrice} />
                  </div>
                  <div >
                    <FormField
                      name="inStock"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>In stock</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <FormField
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue className="" placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="electronics">Electronics</SelectItem>
                              <SelectItem value="fashion">Fashion</SelectItem>
                              <SelectItem value="home">Home & Living</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardContent>
                  <FormField
                    name="unit"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue className="" placeholder="Select a unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pieces">Pieces</SelectItem>
                              <SelectItem value="box">Box</SelectItem>
                              <SelectItem value="set">Set</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form >
  )
}
