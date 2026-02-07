"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Loader2,
    Download,
    Receipt,
    CreditCard,
    Calendar,
    User,
    Mail,
    Package,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Copy,
    Check,
} from "lucide-react";
import { Header } from "@/components/Header";
import OrderService from "@/services/orders";
import { Order, OrderItem } from "@/types/order";
import { useAuthStore } from "@/store/useAuthStore";

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;
    const { user: currentUser } = useAuthStore();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadingReceipt, setDownloadingReceipt] = useState(false);
    const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);

    const orderService = OrderService.getInstance();

    // Load order details
    const loadOrder = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await orderService.getOrderById(orderId);

            if (response.success) {
                setOrder(response.data);
            } else {
                setError("Ku guuldaraystay in la soo raro faahfaahinta dalashada");
            }
        } catch (err) {
            console.error("Error loading order:", err);
            setError("Khalad ayaa dhacay. Fadlan mar kale isku day.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser && orderId) {
            loadOrder();
        }
    }, [currentUser, orderId]);

    // Handle receipt download
    const handleDownloadReceipt = async () => {
        if (!order) return;

        try {
            setDownloadingReceipt(true);
            await orderService.downloadReceipt(order.id);
        } catch (err) {
            console.error("Error downloading receipt:", err);
            setError("Ku guuldaraystay in la dajinayo rasiidka. Fadlan mar kale isku day.");
        } finally {
            setDownloadingReceipt(false);
        }
    };

    // Copy order number to clipboard
    const copyOrderNumber = async () => {
        if (!order) return;

        try {
            await navigator.clipboard.writeText(order.order_number);
            setCopiedOrderNumber(true);
            setTimeout(() => setCopiedOrderNumber(false), 2000);
        } catch (err) {
            console.error("Failed to copy order number:", err);
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case "pending":
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case "failed":
            case "cancelled":
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-600" />;
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

    // Use useEffect for redirection to avoid SSR issues and render-cycle redirects
    useEffect(() => {
        if (!loading && !currentUser) {
            router.push("/");
        }
    }, [currentUser, loading, router]);

    if (loading && !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Dib u noqo
                    </Button>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">La soo rarayo...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Order Details */}
                    {order && (
                        <div className="space-y-6">
                            {/* Order Header */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-2xl mb-2">
                                                Faahfaahinta Dalashada
                                            </CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span>Lambarka Dalashada:</span>
                                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                                    {order.order_number}
                                                </code>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={copyOrderNumber}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    {copiedOrderNumber ? (
                                                        <Check className="w-3 h-3" />
                                                    ) : (
                                                        <Copy className="w-3 h-3" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge
                                                className={`bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800 border-${getStatusColor(order.status)}-200`}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(order.status)}
                                                    {order.status_somali}
                                                </div>
                                            </Badge>
                                            {orderService.canDownloadReceipt(order) && (
                                                <div className="mt-2">
                                                    <Button
                                                        onClick={handleDownloadReceipt}
                                                        disabled={downloadingReceipt}
                                                        size="sm"
                                                    >
                                                        {downloadingReceipt ? (
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <Receipt className="w-4 h-4 mr-2" />
                                                        )}
                                                        Dajin Rasiidka
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Order Date */}
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                <Calendar className="w-4 h-4" />
                                                Taariikh Dalashada
                                            </div>
                                            <p className="font-medium">{formatDate(order.created_at)}</p>
                                        </div>

                                        {/* Payment Date */}
                                        {order.paid_at && (
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Taariikh Bixinta
                                                </div>
                                                <p className="font-medium">{formatDate(order.paid_at)}</p>
                                            </div>
                                        )}

                                        {/* Payment Method */}
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                <CreditCard className="w-4 h-4" />
                                                Habka Bixinta
                                            </div>
                                            <p className="font-medium">{getPaymentMethodName(order.payment_method)}</p>
                                        </div>

                                        {/* Total Amount */}
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                <Package className="w-4 h-4" />
                                                Wadarta Guud
                                            </div>
                                            <p className="font-medium text-lg">
                                                {formatCurrency(order.total_amount, order.currency)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Xogta Macaamiilka</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                <User className="w-4 h-4" />
                                                Magaca
                                            </div>
                                            <p className="font-medium">{order.customer_name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                <Mail className="w-4 h-4" />
                                                Iimaylka
                                            </div>
                                            <p className="font-medium">{order.customer_email || "N/A"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Alaabta la dalbaday</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {order.items && order.items.length > 0 ? (
                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-lg">{item.name}</h3>
                                                            <p className="text-gray-600 text-sm mt-1">
                                                                {item.description}
                                                            </p>

                                                            {/* Subscription Details */}
                                                            {item.subscription_type && (
                                                                <div className="mt-2 space-y-1">
                                                                    <p className="text-sm text-gray-600">
                                                                        <span className="font-medium">Nooca Ishtiraakaa:</span>{" "}
                                                                        {orderService.getSubscriptionName(item.subscription_type, "so")}
                                                                    </p>
                                                                    {item.subscription_start_date && (
                                                                        <p className="text-sm text-gray-600">
                                                                            <span className="font-medium">Taariikh Bilowga:</span>{" "}
                                                                            {formatDate(item.subscription_start_date)}
                                                                        </p>
                                                                    )}
                                                                    {item.subscription_end_date && (
                                                                        <p className="text-sm text-gray-600">
                                                                            <span className="font-medium">Taariikh Dhammaadka:</span>{" "}
                                                                            {formatDate(item.subscription_end_date)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="text-right ml-4">
                                                            <p className="text-sm text-gray-600">
                                                                {item.quantity} x {formatCurrency(item.unit_price, order.currency)}
                                                            </p>
                                                            <p className="font-medium text-lg">
                                                                {formatCurrency(item.total_price, order.currency)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <Separator />

                                            {/* Total */}
                                            <div className="flex justify-between items-center font-medium text-lg">
                                                <span>Wadarta Guud</span>
                                                <span>{formatCurrency(order.total_amount, order.currency)}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-center py-4">
                                            Ma jiraan alaabtii dalashada
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Transaction Details */}
                            {(order.waafi_transaction_id || order.waafi_reference_id) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Faahfaahinta Bixinta</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {order.waafi_transaction_id && (
                                                <div>
                                                    <div className="text-sm text-gray-600 mb-1">
                                                        ID-ga Bixinta (Waafi)
                                                    </div>
                                                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                                        {order.waafi_transaction_id}
                                                    </code>
                                                </div>
                                            )}
                                            {order.waafi_reference_id && (
                                                <div>
                                                    <div className="text-sm text-gray-600 mb-1">
                                                        ID-ga Tixraacda (Waafi)
                                                    </div>
                                                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                                        {order.waafi_reference_id}
                                                    </code>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Subscription Information */}
                            {order.subscription_info && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Xogta Ishtiraakaa</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <div className="text-sm text-gray-600 mb-1">Nooca</div>
                                                <p className="font-medium">{order.subscription_info.name}</p>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600 mb-1">Bilow</div>
                                                <p className="font-medium">{formatDate(order.subscription_info.start_date)}</p>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600 mb-1">Dhammaad</div>
                                                <p className="font-medium">{formatDate(order.subscription_info.end_date)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 