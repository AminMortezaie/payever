export class ReportDto {
    totalSales: number;
    items: {sku:string, totalQty:number}[];
}