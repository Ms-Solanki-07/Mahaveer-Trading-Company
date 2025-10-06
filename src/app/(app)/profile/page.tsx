'use client'
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MapPin, Phone, Key } from "lucide-react";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfileSchema } from "@/schemas/updateProfileSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";


export default function Profile() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('')
    const [shopName, setShopName] = useState('')
    const [GSTIN, setGSTIN] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [pinCode, setPinCode] = useState('')
    const [state, setState] = useState('')

    useEffect(() => {
        const user = async () => {
            try {
                const res = await axios.post('/api/get-user-profile')

                res.data.user.fullName && setFullName(res.data.user.fullName);
                res.data.user.email && setEmail(res.data.user.email);
                res.data.user.phone && setPhone(res.data.user.phone);
                res.data.user.role && setRole(res.data.user.role);
                res.data.user.shopDetails[0]?.shopName && setShopName(res.data.user.shopDetails[0].shopName);
                res.data.user.shopDetails[0]?.GSTIN && setGSTIN(res.data.user.shopDetails[0].GSTIN);
                res.data.user.shopDetails[0]?.address && setAddress(res.data.user.shopDetails[0].address);
                res.data.user.shopDetails[0]?.city && setCity(res.data.user.shopDetails[0].city);
                res.data.user.shopDetails[0]?.pinCode && setPinCode(res.data.user.shopDetails[0].pinCode);
                res.data.user.shopDetails[0]?.state && setState(res.data.user.shopDetails[0].state);

                console.log("User Profile Data:", fullName);

                toast.success(res.data.message);

            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                const errorMessage = axiosError.response?.data.message
                toast.error(errorMessage ? errorMessage : 'Server Error: Something went wrong')
            }
        }
        user();
    }, [])


    //zod implementation
    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            fullName: "",
            email: "",
            role: "",
            phone: "",
            shopName: "",
            GSTIN: "",
            address: "",
            city: "",
            pinCode: "",
            state: ""
        }
    });

    useEffect(() => {
        form.reset({
            fullName,
            email,
            role,
            phone,
            shopName,
            GSTIN,
            address,
            city,
            pinCode,
            state
        });
    }, [fullName, email, role, phone, shopName, GSTIN, address, city, pinCode, state, form]);

    const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
        setIsUpdating(true);
        try {
            const res = await axios.post('/api/update-user-profile', data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            window.location.reload();
            toast.success(res.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast.error(errorMessage ? errorMessage : 'Server Error: Something went wrong')
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mx-6 space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src="https://bundui-images.netlify.app/avatars/08.png" alt="Profile" />
                                        <AvatarFallback className="text-2xl">JD</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                        <h1 className="text-2xl font-bold">{fullName}</h1>
                                    </div>
                                    <p className="text-muted-foreground">{shopName}</p>
                                    <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Mail className="size-4" />
                                            {email}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="size-4" />
                                            {phone}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="size-4" />
                                            {city}, {state} - {pinCode}
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="" variant="default" disabled={isUpdating}>Update Profile</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="personal" className="space-y-2">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="personal">Personal</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                        </TabsList>

                        {/* Personal Information */}
                        <TabsContent value="personal" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your personal details and profile information.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            name="fullName"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name*</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="email"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input disabled placeholder="john.doe@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="phone"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone No.*</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="9243*****3" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="role"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Role</FormLabel>
                                                    <FormControl>
                                                        <Input disabled placeholder="Customer" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="shopName"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Shop Name*</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Acme Inc." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="GSTIN"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>GSTIN*</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter GSTIN" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="address"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter complete shop address" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="city"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your city" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="pinCode"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Pin Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your pin code" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="state"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your state" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <p className="text-sm text-cyan-600">* Requried filed</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Settings */}
                        <TabsContent value="security" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                    <CardDescription>Manage your account security and authentication.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-base">Password</Label>
                                                <p className="text-muted-foreground text-sm">Update password for improve security</p>
                                            </div>
                                            <a href="/forgot-password" className="flex flex-row items-center border-1 border-gray-400 rounded-sm px-3 py-1 hover:bg-gray-800">
                                                <Key className="mr-2 h-4 w-4" />
                                                Change Password
                                            </a>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </Form>
        </div>
    )
}