import { ShoppingCart, Package, Users, TrendingUp, Sparkles, Clock, Layers } from "lucide-react";
import { CMSStatsCard } from "@/components/cms/shared/CMSStatsCard";
import { RecentOrders } from "@/components/cms/dashboard/RecentOrders";
import { QuickActions } from "@/components/cms/dashboard/QuickActions";
import Image from "next/image";
import { getDashboardStats, getRecentOrdersSnippet } from "@/lib/queries";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

export const dynamic = "force-dynamic";

export default async function CMSDashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRecentOrdersSnippet(10) // Fetch top 10 for the snippet
  ]);

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Area with Logo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50 backdrop-blur-sm border border-border/40 p-8 rounded-4xl shadow-sm relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Sparkles size={14} className="animate-pulse" /> System Console
          </div>
          <h1 className="text-4xl font-semibold tracking-tighter text-foreground">
            Overview Dashboard
          </h1>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-sm">
            Monitor real-time performance and manage system-wide printing operations.
          </p>
        </div>
        <div className="relative w-56 h-24 opacity-[0.08] filter grayscale contrast-125 select-none pointer-events-none">
          <Image 
            src="/nav-logo.png" 
            alt="Pana Design" 
            fill 
            className="object-contain"
          />
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -mr-40 -mt-40"></div>
      </div>

      {/* Stats Grid - Revamped for Enterprise Grade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <CMSStatsCard
          title="Total Revenue"
          value={<PriceDisplay amount={stats.totalRevenue} showCurrencySymbol={false} className="text-inherit" />}
          delta="Current Month"
          icon={TrendingUp}
          color="text-emerald-500"
          bgColor="bg-emerald-500/10"
          trend="up"
        />
        <CMSStatsCard
          title="Total Orders"
          value={stats.totalOrders}
          delta="+8% vs avg"
          icon={ShoppingCart}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
          trend="up"
        />
        <CMSStatsCard
          title="Pending"
          value={stats.pendingOrders}
          delta="Needs Action"
          icon={Clock}
          color="text-amber-500"
          bgColor="bg-amber-500/10"
          trend="neutral"
        />
        <CMSStatsCard
          title="Products"
          value={stats.totalProducts}
          delta="Live Catalog"
          icon={Package}
          color="text-indigo-500"
          bgColor="bg-indigo-500/10"
          trend="neutral"
        />
        <CMSStatsCard
          title="Customers"
          value={stats.activeCustomers}
          delta="+3 today"
          icon={Users}
          color="text-purple-500"
          bgColor="bg-purple-500/10"
          trend="up"
        />
        <CMSStatsCard
          title="Categories"
          value={stats.totalCategories}
          delta="Segments"
          icon={Layers}
          color="text-slate-500"
          bgColor="bg-slate-500/10"
          trend="neutral"
        />
      </div>

      {/* Main Grid: Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-8">
          <RecentOrders orders={recentOrders} />
        </div>
        <div className="space-y-8">
          <QuickActions />
          
          {/* System Health / Pro Tip Card */}
          <div className="bg-linear-to-br from-primary/10 to-transparent border border-primary/20 rounded-4xl p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-3">System Intelligence</h4>
              <p className="text-sm font-medium text-foreground/80 leading-relaxed mb-4">
                Optimization: Your top-selling category this week is <span className="text-primary font-bold">Paper Prints</span>. Consider restocking inventory.
              </p>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[75%] rounded-full group-hover:w-[85%] transition-all duration-1000"></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
