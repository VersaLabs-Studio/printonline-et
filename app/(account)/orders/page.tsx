// app/(account)/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Package,
  Search,
  ExternalLink,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Loader2,
  Filter,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  order_number: string;
  created_at: string | null;
  status: string;
  total_amount: number;
  payment_status: string | null;
}

export default function OrdersPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isSessionPending) {
      fetchOrders();
    }
  }, [session, isSessionPending]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-indigo-500" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200"
          >
            Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isSessionPending || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-muted-foreground">
          Fetching your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">
            Track and manage your recent printing orders.
          </p>
        </div>
        <Link href="/all-products">
          <Button className="btn-pana">Place New Order</Button>
        </Link>
      </div>

      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search order number..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No orders found</h3>
                <p className="text-sm text-muted-foreground max-w-[300px] mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters or search term."
                    : "You haven't placed any orders yet. Start your first print today!"}
                </p>
              </div>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/all-products">
                  <Button variant="outline">Browse Products</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Package size={24} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          {order.order_number}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {order.created_at
                            ? format(new Date(order.created_at), "MMM d, yyyy")
                            : "N/A"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="font-bold text-foreground">
                          ETB {order.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-3">
                    <div className="sm:hidden text-xs text-muted-foreground flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                    <Link href={`/orders/${order.order_number}`}>
                      <Button variant="ghost" size="sm" className="gap-2 h-9">
                        Details
                        <ExternalLink size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
          <AlertCircle size={24} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-bold">Missing an order?</h4>
          <p className="text-sm text-muted-foreground">
            Wait up to 10 minutes for your order to appear, or contact support
            with your payment receipt.
          </p>
        </div>
        <Button variant="outline" className="whitespace-nowrap">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
