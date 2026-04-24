/**
 * Weighted Random Selection
 * Thuật toán: Cumulative Probability (xác suất tích lũy)
 * 
 * Ví dụ items: [{weight: 8}, {weight: 2}, {weight: 5}]
 * Tổng weight: 15
 * Khoảng xác suất: [0-8) → item 0, [8-10) → item 1, [10-15) → item 2
 * Random số trong [0, 15) → tìm khoảng chứa số đó → chọn item tương ứng
 * 
 * Ưu điểm so với "expand array":
 * - O(n) thay vì O(total_weight) memory
 * - Không bị giới hạn bởi weight là số nguyên lớn
 */

export type WeightedItem<T> = T & { weight: number };

export function weightedRandom<T>(items: WeightedItem<T>[]): WeightedItem<T> | null {
  if (!items || items.length === 0) return null;
  if (items.length === 1) return items[0];

  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  const rand = Math.random() * totalWeight;

  let cumulative = 0;
  for (const item of items) {
    cumulative += item.weight || 1;
    if (rand < cumulative) return item;
  }

  // Fallback (do floating point) → trả về item cuối
  return items[items.length - 1];
}
