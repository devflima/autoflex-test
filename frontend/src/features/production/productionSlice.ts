import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type {
  ProductionSuggestionResponse,
} from "../../types/ProductionSuggestion";

export interface ProductionState {
  suggestions: ProductionSuggestionResponse | null;
  loading: boolean;
}

const initialState: ProductionState = {
  suggestions: null,
  loading: false,
};

export const fetchProductionSuggestions = createAsyncThunk(
  "production/fetchSuggestions",
  async () => {
    const response = await api.get("/products/suggestions");
    return response.data;
  }
);

const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductionSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductionSuggestions.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productionSlice.reducer;