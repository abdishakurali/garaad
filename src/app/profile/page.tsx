"use client"

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { selectCurrentUser, logoutAction } from '@/store/features/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

// Mobile navigation component
const MobileNav = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">GARAAD</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4">
                    <nav className="space-y-4">
                        <Link href="/courses" className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>Koorsooyinka</span>
                        </Link>
                        <Link href="/practice" className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>Layli</span>
                        </Link>
                        <Link href="/profile" className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profile-kaaga</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
};

// Mobile top bar component
const MobileTopBar = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
    return (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-30 flex items-center justify-between px-4">
            <button onClick={() => setIsOpen(true)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">GARAAD</h1>
            <div className="w-6"></div>
        </div>
    );
};

// Sidebar component
const Sidebar = () => (
    <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white shadow-md z-20">
        <div className="flex flex-col w-full">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">GARAAD</h2>
            </div>
            <div className="p-4 flex-1">
                <nav className="space-y-4">
                    <Link href="/courses" className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Koorsooyinka</span>
                    </Link>
                    <Link href="/practice" className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Layli</span>
                    </Link>
                    <Link href="/profile" className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile-kaaga</span>
                    </Link>
                </nav>
            </div>
        </div>
    </div>
);

// Top bar component
const TopBar = () => {
    const user = useSelector(selectCurrentUser);

    return (
        <div className="hidden md:flex fixed top-0 left-64 right-0 h-16 bg-white shadow-sm z-10">
            <div className="flex items-center justify-between w-full px-6">
                <div></div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{user?.first_name || user?.username}</span>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {user?.first_name ? user.first_name[0] : user?.username[0]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ProfilePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const user = useSelector(selectCurrentUser);
    console.log(user)
    const dispatch = useDispatch();
    const router = useRouter();
    const { toast } = useToast();

    // Initialize form data with user data when component mounts
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically dispatch an action to update the user profile
        // For now, we'll just show a success message
        toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
        });
        setIsEditing(false);
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.new_password !== formData.confirm_password) {
            toast({
                title: "Password Mismatch",
                description: "New passwords do not match.",
                variant: "destructive",
            });
            return;
        }
        // Here you would typically dispatch an action to update the password
        // For now, we'll just show a success message
        toast({
            title: "Password Updated",
            description: "Your password has been successfully updated.",
        });
        setFormData(prev => ({
            ...prev,
            current_password: '',
            new_password: '',
            confirm_password: '',
        }));
    };

    const handleLogout = () => {
        dispatch(logoutAction());
        router.push('/welcome');
        toast({
            title: "Waad ka baxday",
            description: "Si guul leh ayaad uga baxday account-kaaga",
        });
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile navigation */}
            <MobileNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

            {/* Mobile top bar */}
            <MobileTopBar setIsOpen={setIsMobileMenuOpen} />

            {/* Desktop sidebar - hidden on mobile */}
            <Sidebar />

            {/* Desktop top bar - hidden on mobile */}
            <TopBar />

            <main className="md:ml-64 pt-16 md:pt-16">
                <div className="p-4 md:p-6 max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-xl md:text-2xl font-semibold mb-2">
                            Dejinta Profile-ka
                        </h1>
                        <p className="text-gray-600">Maamul dejinta account-kaaga iyo doorashooyinka</p>
                    </div>

                    <Tabs defaultValue="account" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="account">Account-ka</TabsTrigger>
                            <TabsTrigger value="preferences">Doorashooyinka</TabsTrigger>
                            <TabsTrigger value="security">Ammaanka</TabsTrigger>
                        </TabsList>

                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Xogta Account-ka</CardTitle>
                                    <CardDescription>
                                        Cusbooneysii xogtaada shakhsiyeed iyo faahfaahinta account-kaaga
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="flex flex-col items-center">
                                            <Avatar className="h-24 w-24 mb-2">
                                                <AvatarImage src="/placeholder-avatar.jpg" alt={user.first_name || user.username} />
                                                <AvatarFallback>{user.first_name ? user.first_name[0] : user.username[0]}</AvatarFallback>
                                            </Avatar>
                                            <Button variant="outline" size="sm" className="mt-2">
                                                Bedel Sawirka
                                            </Button>
                                        </div>

                                        <div className="flex-1 w-full">
                                            {isEditing ? (
                                                <form onSubmit={handleProfileUpdate}>
                                                    <div className="grid gap-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="first_name">Magaca Koowaad</Label>
                                                                <Input
                                                                    id="first_name"
                                                                    name="first_name"
                                                                    value={formData.first_name}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="last_name">Magaca Dambe</Label>
                                                                <Input
                                                                    id="last_name"
                                                                    name="last_name"
                                                                    value={formData.last_name}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="email">Email</Label>
                                                            <Input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex justify-end gap-2 mt-4">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => setIsEditing(false)}
                                                            >
                                                                Jooji
                                                            </Button>
                                                            <Button type="submit">Kaydi Isbedelada</Button>
                                                        </div>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Magaca Koowaad</p>
                                                            <p className="font-medium">{user.first_name || 'Aan la dejin'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Magaca Dambe</p>
                                                            <p className="font-medium">{user.last_name || 'Aan la dejin'}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email</p>
                                                        <p className="font-medium">{user.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Magaca Isticmaalaha</p>
                                                        <p className="font-medium">{user.username}</p>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Button onClick={() => setIsEditing(true)}>
                                                            Wax ka bedel Profile-ka
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preferences">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Doorashooyinka</CardTitle>
                                    <CardDescription>
                                        U qaabeey barashadaada
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Ogeysiisyada Email</Label>
                                                <p className="text-sm text-gray-500">
                                                    Hel ogeysiisyo email ah oo ku saabsan horumarka barashadaada
                                                </p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Moodka Mugdiga</Label>
                                                <p className="text-sm text-gray-500">
                                                    Bedel moodka iftiinka iyo mugdiga
                                                </p>
                                            </div>
                                            <Switch />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Luqadda</Label>
                                                <p className="text-sm text-gray-500">
                                                    Bedel luqadda interface-ka
                                                </p>
                                            </div>
                                            <select className="border rounded-md p-2">
                                                <option value="so">Soomaali</option>
                                                <option value="en">Ingiriis</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button>Kaydi Doorashooyinka</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ammaanka</CardTitle>
                                    <CardDescription>
                                        Maamul password-kaaga iyo ammaanka account-kaaga
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePasswordChange}>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current_password">Password-ka Hadda</Label>
                                                <Input
                                                    id="current_password"
                                                    name="current_password"
                                                    type="password"
                                                    value={formData.current_password}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new_password">Password Cusub</Label>
                                                <Input
                                                    id="new_password"
                                                    name="new_password"
                                                    type="password"
                                                    value={formData.new_password}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm_password">Xaqiiji Password-ka Cusub</Label>
                                                <Input
                                                    id="confirm_password"
                                                    name="confirm_password"
                                                    type="password"
                                                    value={formData.confirm_password}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit">Bedel Password-ka</Button>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Ficilada Account-ka</CardTitle>
                                    <CardDescription>
                                        Maamul account-kaaga iyo xogtaada
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Tirtir Account</Label>
                                                <p className="text-sm text-gray-500">
                                                    Tirtir si joogto ah account-kaaga iyo dhammaan xogta la xiriira
                                                </p>
                                            </div>
                                            <Button variant="destructive">Tirtir Account</Button>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Ka bax</Label>
                                                <p className="text-sm text-gray-500">
                                                    Ka bax account-kaaga device-kan
                                                </p>
                                            </div>
                                            <Button variant="outline" onClick={handleLogout}>Ka bax</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
} 