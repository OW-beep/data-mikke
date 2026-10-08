"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Google AdSenseのディスプレイ広告ユニット（手動配置）。
 *
 * - clientId / slotId のどちらかが未設定なら何も描画しない（審査前・未設定でも壊れない）。
 * - 広告ユニットIDは AdSense管理画面の「広告 > 広告ユニットごと」で作成して、
 *   Vercelの環境変数（NEXT_PUBLIC_ADSENSE_SLOT_*）に設定する。
 * - 本文との区別のため「広告」ラベルを必ず表示する。
 */
export function AdSlot({ slotId, clientId }: { slotId?: string; clientId?: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!slotId || !clientId || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 広告ブロッカー等で失敗してもページ表示には影響させない
    }
  }, [slotId, clientId]);

  if (!slotId || !clientId) return null;

  return (
    <aside className="dm-ad" aria-label="広告">
      <p className="dm-ad-label">広告</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
