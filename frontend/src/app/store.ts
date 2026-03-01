import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import materiaslReducer from "../features/materials/materialSlice";
import productMaterialReducer from "../features/productMaterials/productMaterialSlice";
import productionReducer from "../features/production/productionSlice"

export const setupStore = () =>
  configureStore({
    reducer: {
      products: productReducer,
      materials: materiaslReducer,
      productMaterials: productMaterialReducer,
      production: productionReducer,
    },
  })
  
export type AppStore = ReturnType<typeof setupStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

export const store: AppStore = setupStore()