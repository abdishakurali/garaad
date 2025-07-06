"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Loader2,
    Search,
    Filter,
    Download,
    Eye,
    RefreshCw,
    Calendar,
    CreditCard,
    Receipt,
    ShoppingBag,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import OrderService from "@/services/orders";
import {
    Order,
    OrderFilters,
    ORDER_STATUS_OPTIONS,
    PAYMENT_METHOD_OPTIONS,
    CURRENCY_OPTIONS,
} from "@/types/order";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";

const ITEMS_PER_PAGE = 10;

export default function OrderHistoryPage() {
    const router = useRouter();
    const currentUser = useSelector(selectCurrentUser);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [downloadingReceipt, setDownloadingReceipt] = useState<string | null>(null);

    // Filters
    const [filters, setFilters] = useState<OrderFilters>({
        status: "",
        payment_method: "",
        start_date: "",
        end_date: "",
        page: 1,
        page_size: ITEMS_PER_PAGE,
    });

    const orderService = OrderService.getInstance();

    // Load orders
    const loadOrders = async (resetPage = false) => {
        try {
            setLoading(true);
            setError(null);

            const currentFilters = {
                ...filters,
                search: searchTerm || undefined,
                page: resetPage ? 1 : currentPage,
            };

            const response = await orderService.getOrders(currentFilters);

            if (response.success) {
                setOrders(response.data.orders);
                setTotalPages(response.data.pagination.total_pages);
                setTotalOrders(response.data.pagination.total_count);
                if (resetPage) {
                    setCurrentPage(1);
                }
            } else {
                setError("Ku guuldaraystay in la soo raro dalbashada");
            }
        } catch (err) {
            console.error("Qalad ayaa dhacay marka la soo raray dalabaadaha:", err);
            setError("Khalad ayaa dhacay. Fadlan mar kale isku day.");
        } finally {
            setLoading(false);
        }
    };

    // Load orders on component mount and when filters change
    useEffect(() => {
        if (currentUser) {
            loadOrders(true);
        }
    }, [currentUser, filters]);

    // Load orders when page changes
    useEffect(() => {
        if (currentUser && currentPage > 1) {
            loadOrders();
        }
    }, [currentPage]);

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadOrders(true);
    };

    // Handle filter change
    const handleFilterChange = (key: keyof OrderFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined,
        }));
    };

    // Handle receipt download
    const handleDownloadReceipt = async (orderId: string) => {
        try {
            setDownloadingReceipt(orderId);
            await orderService.downloadReceipt(orderId);
        } catch (err) {
            console.error("Qalad ayaa dhacay marka la soo dejin lahaayeen rasiidhka:", err);
            setError("Ku guuldaraystay in la dajinayo rasiidka. Fadlan mar kale isku day.");
        } finally {
            setDownloadingReceipt(null);
        }
    };

    // Handle view order details
    const handleViewOrder = (orderId: string) => {
        router.push(`/orders/${orderId}`);
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "pending":
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case "failed":
            case "cancelled":
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    // Get status color
    const getStatusColor = (status: string) => {
        return orderService.getOrderStatusColor(status);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return orderService.formatOrderDate(dateString, "so");
    };

    // Format currency
    const formatCurrency = (amount: string, currency: string) => {
        return orderService.formatCurrency(amount, currency);
    };

    // Get payment method name
    const getPaymentMethodName = (method: string) => {
        return orderService.getPaymentMethodName(method, "so");
    };

    // If user is not authenticated, redirect to login
    if (!currentUser) {
        router.push("/");
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Taariiqda Dalbashada
                        </h1>
                        <p className="text-gray-600">
                            Halkan ka eeg dhammaan dalbashada aad samaysay
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Search and Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Raadi oo Shaandheyn
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                                {/* Search */}
                                <div className="lg:col-span-2">
                                    <form onSubmit={handleSearch} className="flex gap-2">
                                        <Input
                                            placeholder="Raadi lambarka dalashada..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button type="submit" size="sm">
                                            <Search className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>

                                {/* Status Filter */}
                                <Select
                                    value={filters.status || ""}
                                    onValueChange={(value) => handleFilterChange("status", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Xaalada" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Dhammaan</SelectItem>
                                        {ORDER_STATUS_OPTIONS.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label_somali}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Payment Method Filter */}
                                <Select
                                    value={filters.payment_method || ""}
                                    onValueChange={(value) => handleFilterChange("payment_method", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Habka Bixinta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Dhammaan</SelectItem>
                                        {PAYMENT_METHOD_OPTIONS.map((method) => (
                                            <SelectItem key={method.value} value={method.value}>
                                                {method.label_somali}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Start Date */}
                                <Input
                                    type="date"
                                    placeholder="Taariikh Bilowga"
                                    value={filters.start_date || ""}
                                    onChange={(e) => handleFilterChange("start_date", e.target.value)}
                                />

                                {/* End Date */}
                                <Input
                                    type="date"
                                    placeholder="Taariikh Dhammaadka"
                                    value={filters.end_date || ""}
                                    onChange={(e) => handleFilterChange("end_date", e.target.value)}
                                />
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <p className="text-sm text-gray-600">
                                    {totalOrders} dalabad oo ah la helay
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadOrders(true)}
                                    disabled={loading}
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                    Cusboonaysii
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Dalbashada ({totalOrders})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading && orders.length === 0 ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                    <span className="ml-2 text-gray-600">La soo rarayo...</span>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Ma jiraan dalashado
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Wali ma samaysanin dalabad. Bilow ishtiraak!
                                    </p>
                                    <Button onClick={() => router.push("/subscribe")}>
                                        Bilow Ishtiraak
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Lambarka</TableHead>
                                                <TableHead>Taariikh</TableHead>
                                                <TableHead>Qiimaha</TableHead>
                                                <TableHead>Habka Bixinta</TableHead>
                                                <TableHead>Xaalada</TableHead>
                                                <TableHead>Ficillada</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-mono text-sm">
                                                        {order.order_number}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            {formatDate(order.created_at)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {formatCurrency(order.total_amount, order.currency)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                                            {getPaymentMethodName(order.payment_method)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={`bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800 border-${getStatusColor(order.status)}-200`}
                                                        >
                                                            <div className="flex items-center gap-1">
                                                                {getStatusIcon(order.status)}
                                                                {order.status_somali}
                                                            </div>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleViewOrder(order.id)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            {orderService.canDownloadReceipt(order) && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDownloadReceipt(order.id)}
                                                                    disabled={downloadingReceipt === order.id}
                                                                >
                                                                    {downloadingReceipt === order.id ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <Receipt className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-600">
                                        Bogga {currentPage} ee {totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1 || loading}
                                        >
                                            Horay
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages || loading}
                                        >
                                            Dambaa
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 