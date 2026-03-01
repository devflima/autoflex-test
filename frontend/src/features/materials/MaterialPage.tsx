import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "./materialSlice";
import type { RootState, AppDispatch } from "../../app/store";
import type { RawMaterial } from "../../types/RawMaterial";
import Modal from "../../components/ui/Modal";
import { TbEdit, TbTrash } from "react-icons/tb";

export default function MaterialPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector(
    (state: RootState) => state.materials
  );

  const emptyMaterial: RawMaterial = {
    id: 0,
    code: "",
    name: "",
    stockQuantity: 0,
  };

  const [form, setForm] = useState(emptyMaterial);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const openCreate = () => {
    setForm(emptyMaterial);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEdit = (material: RawMaterial) => {
    setForm(material);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      dispatch(updateMaterial(form));
    } else {
      dispatch(
        createMaterial({
          code: form.code,
          name: form.name,
          stockQuantity: form.stockQuantity,
        })
      );
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-10">

      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-700 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Matérias-Primas
          </h1>
          <p className="text-slate-400 mt-2">
            Gerencie o estoque de insumos
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-emerald-600 hover:bg-emerald-500 transition px-5 py-3 rounded-xl font-medium shadow-lg"
        >
          Nova Matéria-Prima
        </button>
      </div>

      {loading && <p className="text-slate-400">Carregando...</p>}

      {/* Tabela */}
      <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="text-slate-400 text-sm uppercase tracking-wide border-b border-slate-700">
              <tr>
                <th className="py-4">Código</th>
                <th className="py-4">Nome</th>
                <th className="py-4">Quantidade</th>
                <th className="py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {items.map((material) => (
                <tr
                  key={material.id}
                  className="hover:bg-slate-700/40 transition"
                >
                  <td className="py-5 font-medium">{material.code}</td>
                  <td>{material.name}</td>

                  <td
                    className={`font-semibold ${
                      material.stockQuantity <= 5
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {material.stockQuantity}
                  </td>

                  {/* AÇÕES */}
                  <td className="py-5">
                    <div className="flex justify-end gap-3">
                      
                      <button
                        onClick={() => openEdit(material)}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-blue-600/20 transition group"
                      >
                        <TbEdit
                          className="w-5 h-5 text-blue-400 group-hover:text-blue-300"
                        />
                      </button>

                      <button
                        onClick={() =>
                          dispatch(deleteMaterial(material.id))
                        }
                        className="p-2 rounded-lg bg-slate-700 hover:bg-red-600/20 transition group"
                      >
                        <TbTrash
                          className="w-5 h-5 text-red-400 group-hover:text-red-300"
                        />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-6">

          <h2 className="text-2xl font-bold">
            {isEditing ? "Editar Matéria-Prima" : "Nova Matéria-Prima"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="bg-slate-700 border border-slate-600 p-3 w-full rounded-lg"
              placeholder="Código"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
            />

            <input
              className="bg-slate-700 border border-slate-600 p-3 w-full rounded-lg"
              placeholder="Nome"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="number"
              className="bg-slate-700 border border-slate-600 p-3 w-full rounded-lg"
              placeholder="Quantidade"
              value={form.stockQuantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  stockQuantity: Number(e.target.value),
                })
              }
            />

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 transition w-full py-3 rounded-xl font-medium"
            >
              {isEditing ? "Atualizar" : "Salvar"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}