export interface ProductMaterial {
  id: number;
  rawMaterialId: number;
  rawMaterialName: string;
  requiredQuantity: number;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  price: string;
  materials?: ProductMaterial[];
}