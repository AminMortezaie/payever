export interface ReportItem {
  sku: string;
  totalQty: number;
}

export interface SalesReport {
  totalSales: number;
  items: ReportItem[];
}
