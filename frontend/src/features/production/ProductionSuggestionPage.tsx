import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductionSuggestions } from "./productionSlice";
import type { RootState, AppDispatch } from "../../app/store";

export default function ProductionSuggestionPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { suggestions, loading } = useSelector(
    (state: RootState) => state.production
  );

  useEffect(() => {
    dispatch(fetchProductionSuggestions());
  }, [dispatch]);

  return (
    <div className="p-8 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-700 pb-6 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Sugestão de Produção
        </h1>
        <p className="text-slate-400">
          Capacidade de produção baseada no estoque atual
        </p>
      </div>

      {loading && (
        <p className="text-slate-400">Carregando...</p>
      )}

      {!loading && suggestions && (
        <div className="space-y-10">

          {/* Cards */}
          <div className="grid gap-8 md:grid-cols-2">
            
            <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition">
              <p className="text-slate-400 text-sm">
                Produtos Produzíveis
              </p>
              <p className="text-4xl font-bold mt-3">
                {suggestions.suggestions.length}
              </p>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition">
              <p className="text-slate-400 text-sm">
                Valor Total Potencial
              </p>
              <p className="text-4xl font-bold text-emerald-400 tracking-tight mt-3">
                R$ {suggestions.totalProductionValue.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Potencial de produção atual
              </p>
            </div>

          </div>

          {/* Table */}
          <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-10 space-y-8">
            
            <h2 className="text-xl font-semibold">
              Produtos Produzíveis
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                
                <thead className="text-slate-400 text-sm uppercase tracking-wide border-b border-slate-700">
                  <tr>
                    <th className="py-4">Produto</th>
                    <th className="py-4">Quantidade</th>
                    <th className="py-4 text-right">Valor Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-700">
                  {suggestions.suggestions.map((item) => (
                    <tr
                      key={item.productId}
                      className="hover:bg-slate-700/40 transition-colors"
                    >
                      <td className="py-5 font-medium">
                        {item.productName}
                      </td>
                      <td>{item.quantity}</td>
                      <td className="text-emerald-400 font-semibold text-right">
                        R$ {item.totalValue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-700">
              <span className="text-lg font-semibold text-emerald-400">
                Valor Total: R$ {suggestions.totalProductionValue.toFixed(2)}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}