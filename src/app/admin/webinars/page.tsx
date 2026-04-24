"use client";

import { useEffect, useState, useRef } from "react";
import { webinarAdminApi, WebinarData } from "@/lib/admin-webinar";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    MoreVertical,
    Loader2,
    Search,
    Image as ImageIcon,
    X,
    Video,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function WebinarAdminPage() {
    const [webinars, setWebinars] = useState<WebinarData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [editingWebinar, setEditingWebinar] = useState<WebinarData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        date_utc: "",
        zoom_url: "",
        meeting_id: "",
        passcode: "",
        is_active: true,
    });
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const fetchWebinars = async () => {
        try {
            setLoading(true);
            const data = await webinarAdminApi.list();
            setWebinars(data);
        } catch (error) {
            toast.error("Waa lagu fashilmay in la soo saaro webinars");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebinars();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("slug", formData.slug);
            data.append("description", formData.description);
            data.append("date_utc", formData.date_utc);
            data.append("zoom_url", formData.zoom_url);
            data.append("meeting_id", formData.meeting_id);
            data.append("passcode", formData.passcode);
            data.append("is_active", String(formData.is_active));
            if (bannerFile) {
                data.append("banner_image", bannerFile);
            }

            if (editingWebinar) {
                await webinarAdminApi.update(editingWebinar.slug, data);
                toast.success("Webinarka waa la wax ka badelay");
            } else {
                await webinarAdminApi.create(data);
                toast.success("Webinarka waa la abuurray");
            }
            resetForm();
            fetchWebinars();
        } catch (error) {
            toast.error("Waa lagu fashilmay keydinta webinkara");
        }
    };

    const handleEdit = (webinar: WebinarData) => {
        setEditingWebinar(webinar);
        setFormData({
            title: webinar.title,
            slug: webinar.slug,
            description: webinar.description,
            date_utc: webinar.date_utc.slice(0, 16),
            zoom_url: webinar.zoom_url,
            meeting_id: webinar.meeting_id,
            passcode: webinar.passcode,
            is_active: webinar.is_active,
        });
        if (webinar.banner_image) {
            setBannerPreview(webinar.banner_image);
        }
        setIsCreating(true);
    };

    const handleDelete = async (slug: string) => {
        if (confirm("Ma hubtaa inaad tirtirto webinarkan?")) {
            try {
                await webinarAdminApi.delete(slug);
                toast.success("Webinarka waa la tirtiray");
                fetchWebinars();
            } catch (error) {
                toast.error("Waa lagu fashilmay tirtirista webinkara");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            description: "",
            date_utc: "",
            zoom_url: "",
            meeting_id: "",
            passcode: "",
            is_active: true,
        });
        setBannerFile(null);
        setBannerPreview(null);
        setEditingWebinar(null);
        setIsCreating(false);
    };

    const filteredWebinars = webinars.filter(
        (w) =>
            w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Maareynta Webinars</h1>
                    <p className="text-slate-500 text-sm">Abuur, wax ka beddel ama tirtir webinars.</p>
                </div>
                <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" /> Webinar Cusub
                </Button>
            </div>

            {isCreating && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">
                            {editingWebinar ? "Wax ka beddel Webinar" : "Webinar Cusub"}
                        </h2>
                        <Button variant="ghost" size="sm" onClick={resetForm}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Cinwaanka
                                </label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Tixraadh Webinar-ga"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Slug
                                </label>
                                <Input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    placeholder="webinar-slug"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Faahfaahin
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Faahfaahin ka duwan webinar-ga..."
                                rows={3}
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Taariikhda (UTC)
                                </label>
                                <Input
                                    type="datetime-local"
                                    name="date_utc"
                                    value={formData.date_utc}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Zoom URL
                                </label>
                                <Input
                                    name="zoom_url"
                                    value={formData.zoom_url}
                                    onChange={handleInputChange}
                                    placeholder="https://zoom.us/..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Meeting ID
                                </label>
                                <Input
                                    name="meeting_id"
                                    value={formData.meeting_id}
                                    onChange={handleInputChange}
                                    placeholder="123 456 7890"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Passcode
                                </label>
                                <Input
                                    name="passcode"
                                    value={formData.passcode}
                                    onChange={handleInputChange}
                                    placeholder="abc123"
                                    required
                                />
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        className="rounded border-slate-300"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Furan</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Sawirka Banner-ga
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Door Sawir
                                </Button>
                                {bannerPreview && (
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                        <Image
                                            src={bannerPreview}
                                            alt="Banner preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                {editingWebinar ? "Wax ka beddel" : "Abuur"}
                            </Button>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Ka noqo
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Raadi webinar..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredWebinars.length === 0 ? (
                    <div className="p-20 text-center">
                        <Video className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500">Wax webinar ah looma helin.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Cinwaanka</TableHead>
                                <TableHead>Taariikhda</TableHead>
                                <TableHead>Zoom</TableHead>
                                <TableHead>Heerka</TableHead>
                                <TableHead className="text-right">Waxqabad</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWebinars.map((webinar) => (
                                <TableRow key={webinar.id}>
                                    <TableCell>
                                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100">
                                            {webinar.banner_image ? (
                                                <Image
                                                    src={webinar.banner_image}
                                                    alt={webinar.title}
                                                    width={64}
                                                    height={40}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <ImageIcon className="h-4 w-4 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-xs truncate">
                                        {webinar.title}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(webinar.date_utc).toLocaleString("so-SO")}
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500 truncate max-w-[150px]">
                                        {webinar.zoom_url}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={webinar.is_active ? "default" : "secondary"}
                                        >
                                            {webinar.is_active ? "Furan" : "Xirfad"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/webinars/${webinar.slug}`}
                                                        target="_blank"
                                                        className="flex items-center"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" /> Fiiri
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleEdit(webinar)}
                                                    className="flex items-center text-blue-600"
                                                >
                                                    <Edit className="mr-2 h-4 w-4" /> Wax ka beddel
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(webinar.slug)}
                                                    className="flex items-center text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Tirtir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}