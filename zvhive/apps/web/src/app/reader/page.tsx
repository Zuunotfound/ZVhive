"use client";
import { AdSlot } from "../../components/AdSlot";
import { useAccount } from "../../hooks/useAccount";

export default function ReaderPage() {
  const { account } = useAccount();
  const showAds = !account?.adsDisabled;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reader</h1>
      {showAds && <AdSlot placement="chapter-top" />}
      <div className="h-64 bg-muted rounded" />
      {showAds && <AdSlot placement="chapter-bottom" />}
    </div>
  );
}

