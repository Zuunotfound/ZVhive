"use client";
export function AdSlot({ placement }: { placement: string }) {
  return (
    <div className="bg-muted border border-white/10 rounded p-4 text-center text-xs text-muted">
      Ad placement: {placement}
    </div>
  );
}

