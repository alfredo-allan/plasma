import { Tag } from "lucide-react";

export function CouponTag({ code }: { code: string }) {
  return (
    <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
      <Tag className="size-3.5" />
      Cupom: <span className="font-bold">{code}</span>
    </div>
  );
}
