import { Card } from "@/components/ui/card";
import { MapPin, Truck, MessageSquare, Clock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrderWithItems } from "@/types/database";

interface OrderFulfillmentInfoProps {
  order: OrderWithItems;
}

export function OrderFulfillmentInfo({ order }: OrderFulfillmentInfoProps) {
  return (
    <Card className="border-border/40 shadow-sm rounded-2xl p-8 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Truck size={80} />
      </div>

      <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
        <MapPin size={14} /> Logistics Command
      </h5>

      <div className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 gap-6">
          {/* Production Flow */}
          <div className="p-5 rounded-2xl border flex items-center justify-between transition-all shadow-sm bg-background border-border/40">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg bg-muted text-muted-foreground">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none mb-1">Production Flow</p>
                <p className="text-sm font-black uppercase tracking-tight text-foreground">
                  Standard Queue
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-background border border-border/40 shadow-sm group/loc">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <Truck size={12} className="text-primary" /> Delivery Destination
              </p>
              <p className="text-sm font-bold text-foreground/80 leading-relaxed font-mono bg-muted/30 p-4 rounded-xl border border-border/10">
                {order.delivery_address || `Pickup at Pana HQ • Bole, Addis Ababa`}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge
                  variant="outline"
                  className="text-[9px] font-bold uppercase tracking-widest bg-primary/5 border-primary/20 text-primary px-3 py-1.5 rounded-lg"
                >
                  {order.delivery_city || "Addis Ababa"}
                </Badge>
                {order.delivery_sub_city && (
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold uppercase tracking-widest bg-muted/50 border-border/40 text-muted-foreground px-3 py-1.5 rounded-lg"
                  >
                    {order.delivery_sub_city}
                  </Badge>
                )}
              </div>
            </div>

            {/* Special Instructions */}
            {order.special_instructions && (
              <div className="p-5 rounded-2xl bg-indigo-50/30 border border-indigo-100 shadow-sm">
                <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MessageSquare size={12} /> Fulfillment Notes
                </p>
                <p className="text-xs font-semibold text-indigo-900 italic leading-relaxed">
                  &quot;{order.special_instructions}&quot;
                </p>
              </div>
            )}
          </div>

          {order.payment_method && (
            <div className="pt-2">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 px-1">Fiscal Clearance</p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="h-6 w-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                  <CreditCard size={12} />
                </div>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                  {order.payment_method.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
