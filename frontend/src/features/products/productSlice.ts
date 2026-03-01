import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { Product } from "../../types/Product";

export interface ProductState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  loading: false,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async () => {
    const response = await api.get<Product[]>("/products");
    return response.data;
  }
);

export const fetchProductWithMaterials = createAsyncThunk(
  "products/fetchWithMaterials",
  async (id: number) => {
    const response = await api.get(`/products/materials/${id}`);
    return response.data;
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (product: Product) => {
    const response = await api.post<Product>("/products", product);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (product: Product) => {
    const payload = {
      code: product.code,
      name: product.name,
      price: product.price,
    };

    const normalizedPayload = {
      ...payload,
      price:
        typeof payload.price === "number"
          ? payload.price
          : payload.price,
    };

    const response = await api.put<Product>(
      `/products/${product.id}`,
      normalizedPayload
    );

    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number) => {
    await api.delete(`/products/${id}`);
    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchProductWithMaterials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductWithMaterials.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductWithMaterials.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }

        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = {
            ...state.selectedProduct,
            ...action.payload,
            materials: state.selectedProduct.materials,
          };
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => p.id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;