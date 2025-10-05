'use client'
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; 
import { Camera, Calendar, Mail, MapPin, Phone } from "lucide-react";
import { Shield, Key, Trash2 } from "lucide-react";


export default function Profile() {
    return (
        <div className="mx-6 space-y-4">
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
                                <h1 className="text-2xl font-bold">John Doe</h1> 
                            </div>
                            <p className="text-muted-foreground">Shop Name</p>
                            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Mail className="size-4" />
                                    john.doe@example.com
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone className="size-4" />
                                    Mobile Number
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="size-4" />
                                    San Francisco, CA
                                </div>
                            </div>
                        </div>
                        <Button variant="default">Edit Profile</Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="personal" className="space-y-6">
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
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="firstName" defaultValue="John" />
                                </div> 
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input disabled id="email" type="email" defaultValue="john.doe@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input disabled id="jobTitle" defaultValue="Senior Product Designer" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shopName">Shop Name</Label>
                                    <Input id="shopName" defaultValue="Acme Inc." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="GSTIN">GSTIN</Label>
                                    <Input id="company" defaultValue="Acme Inc." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="company" defaultValue="Acme Inc." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" defaultValue="Acme Inc." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" defaultValue="India" />
                            </div>
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
                                    <Button variant="outline">
                                        <Key className="mr-2 h-4 w-4" />
                                        Change Password
                                    </Button>
                                </div>
                                
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}