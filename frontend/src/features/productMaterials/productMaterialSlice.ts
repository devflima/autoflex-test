import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { ProductMaterial } from "../../types/ProductMaterial";

export interface ProductMaterialState {
  items: ProductMaterial[];
}

const initialState: ProductMaterialState = {
  items: [],
};

export const fetchProductMaterials = createAsyncThunk(
  "productMaterials/fetchByProduct",
  async (productId: number) => {
    const response = await api.get<ProductMaterial[]>(
      `/product-materials/${productId}`
    );
    return response.data;
  }
);

export const createProductMaterial = createAsyncThunk(
  "productMaterials/create",
  async (data: Omit<ProductMaterial, "id">) => {
    const response = await api.post<ProductMaterial>(
      "/product-materials",
      data
    );
    return response.data;
  }
);

export const updateProductMaterial = createAsyncThunk(
  "productMaterials/update",
  async (data: ProductMaterial) => {
    const response = await api.put<ProductMaterial>(
      `/product-materials/${data.id}`,
      data
    );
    return response.data;
  }
);

export const deleteProductMaterial = createAsyncThunk(
  "productMaterials/delete",
  async (id: number) => {
    await api.delete(`/product-materials/${id}`);
    return id;
  }
);

const slice = createSlice({
  name: "productMaterials",
  initialState,
  reducers: {
    clearProductMaterials: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductMaterials.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createProductMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteProductMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const { clearProductMaterials } = slice.actions;
export default slice.reducer;