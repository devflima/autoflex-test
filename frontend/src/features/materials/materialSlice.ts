import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { RawMaterial } from "../../types/RawMaterial";

export interface MaterialState {
  items: RawMaterial[];
  loading: boolean;
}

const initialState: MaterialState = {
  items: [],
  loading: false,
};

export const fetchMaterials = createAsyncThunk(
  "materials/fetchAll",
  async () => {
    const response = await api.get<RawMaterial[]>("/raw-materials");
    return response.data;
  }
);

export const createMaterial = createAsyncThunk(
  "materials/create",
  async (material: Omit<RawMaterial, "id">) => {
    const response = await api.post<RawMaterial>(
      "/raw-materials",
      material
    );
    return response.data;
  }
);

export const updateMaterial = createAsyncThunk(
  "materials/update",
  async (material: RawMaterial) => {
    const response = await api.put<RawMaterial>(
      `/raw-materials/${material.id}`,
      material
    );
    return response.data;
  }
);

export const deleteMaterial = createAsyncThunk(
  "materials/delete",
  async (id: number) => {
    await api.delete(`/raw-materials/${id}`);
    return id;
  }
);

const materialSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (m) => m.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (m) => m.id !== action.payload
        );
      });
  },
});

export default materialSlice.reducer;