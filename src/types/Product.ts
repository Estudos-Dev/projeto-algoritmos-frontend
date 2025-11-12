export type Product = {
    id: number;
    name: string;
    price: number;
}

export const products: Product[] = [
    { id: 1, name: "Product A", price: 29.99 },
    { id: 2, name: "Product B", price: 49.99 },
    { id: 3, name: "Product C", price: 19.99 },
];