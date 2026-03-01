import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchProductWithMaterials,
  createProduct,
  deleteProduct,
  updateProduct,
} from "./productSlice";
import {
  createProductMaterial,
  updateProductMaterial,
  deleteProductMaterial,
} from "../productMaterials/productMaterialSlice";
import { fetchMaterials } from "../materials/materialSlice";

import type { RootState, AppDispatch } from "../../app/store";
import type { Product } from "../../types/Product";
import Modal from "../../components/ui/Modal";
import { TbEdit, TbTrash } from "react-icons/tb";

export default function ProductPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { items, selectedProduct, loading } = useSelector(
    (state: RootState) => state.products
  );

  const { items: materials } = useSelector(
    (state: RootState) => state.materials
  );

  const emptyProduct: Product = {
    id: 0,
    code: "",
    name: "",
    price: "",
  };

  const [form, setForm] = useState<Product>(emptyProduct);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
  const [newMaterialId, setNewMaterialId] = useState<number>(0);
  const [requiredQuantity, setRequiredQuantity] = useState<number>(0);

  useEffect(() => {
    if (selectedProduct) setForm(selectedProduct);
    dispatch(fetchProducts());
    dispatch(fetchMaterials());
  }, [selectedProduct, dispatch]);

  const resetAssociationForm = () => {
    setEditingMaterialId(null);
    setNewMaterialId(0);
    setRequiredQuantity(0);
  };

  const openCreateModal = () => {
    setForm(emptyProduct);
    setIsEditing(false);
    resetAssociationForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditing(true);
    resetAssociationForm();
    dispatch(fetchProductWithMaterials(product.id));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const payload = {
          code: form.code,
          name: form.name,
          price:
            typeof form.price === "number" ? form.price : String(form.price),
        };

        await dispatch(
          updateProduct({
            id: form.id,
            ...payload,
          } as any)
        ).unwrap();

        await dispatch(fetchProductWithMaterials(form.id)).unwrap();
      } else {
        await dispatch(
          createProduct({
            code: form.code,
            name: form.name,
            price:
              typeof form.price === "number" ? form.price : String(form.price),
          } as any)
        ).unwrap();
      }

      setIsModalOpen(false);
      setForm(emptyProduct);
      resetAssociationForm();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      alert("Não foi possível salvar o produto. Veja o console.");
    }
  };

  const handleSaveMaterial = async () => {
    if (!form.id || !newMaterialId || !requiredQuantity) return;

    try {
      if (editingMaterialId) {
        await dispatch(
          updateProductMaterial({
            id: editingMaterialId,
            product: form.id,
            rawMaterial: newMaterialId,
            requiredQuantity,
          })
        ).unwrap();
      } else {
        await dispatch(
          createProductMaterial({
            product: form.id,
            rawMaterial: newMaterialId,
            requiredQuantity,
          })
        ).unwrap();
      }

      await dispatch(fetchProductWithMaterials(form.id)).unwrap();
      resetAssociationForm();
    } catch (err) {
      console.error("Erro ao salvar associação:", err);
      alert("Não foi possível salvar a associação. Veja o console.");
    }
  };

  const startEditAssociation = (material: any) => {
    setEditingMaterialId(material.id);
    setRequiredQuantity(material.requiredQuantity);
    setNewMaterialId(material.rawMaterialId);
  };

  const handleDeleteAssociation = async (id: number) => {
    if (!form.id) return;

    try {
      await dispatch(deleteProductMaterial(id)).unwrap();
      await dispatch(fetchProductWithMaterials(form.id)).unwrap();

      if (editingMaterialId === id) resetAssociationForm();
    } catch (err) {
      console.error("Erro ao remover associação:", err);
      alert("Não foi possível remover a associação. Veja o console.");
    }
  };

  return (
    <div className="p-8 space-y-10" data-cy="products-page">
      {/* Header */}
      <div
        className="flex justify-between items-center border-b border-slate-700 pb-6"
        data-cy="products-header"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight" data-cy="products-title">
            Produtos
          </h1>
          <p className="text-slate-400 mt-2" data-cy="products-subtitle">
            Gerencie seus produtos e suas composições
          </p>
        </div>

        <button
          data-cy="btn-new-product"
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-500 transition px-5 py-3 rounded-xl font-medium shadow-lg"
          type="button"
        >
          Novo Produto
        </button>
      </div>

      {loading && (
        <p className="text-slate-400" data-cy="products-loading">
          Carregando...
        </p>
      )}

      {/* Tabela */}
      <div
        className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-10"
        data-cy="products-table-wrapper"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-cy="products-table">
            <thead className="text-slate-400 text-sm uppercase tracking-wide border-b border-slate-700">
              <tr>
                <th className="py-4" data-cy="th-code">
                  Código
                </th>
                <th className="py-4" data-cy="th-name">
                  Nome
                </th>
                <th className="py-4" data-cy="th-price">
                  Preço
                </th>
                <th className="py-4 text-right" data-cy="th-actions">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700" data-cy="products-tbody">
              {items.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-700/40 transition"
                  data-cy={`product-row-${product.id}`}
                >
                  <td className="py-5 font-medium" data-cy="product-code">
                    {product.code}
                  </td>
                  <td data-cy="product-name">{product.name}</td>
                  <td className="text-emerald-400 font-semibold" data-cy="product-price">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(product.price))}
                  </td>

                  <td className="text-right space-x-3" data-cy="product-actions">
                    <button
                      data-cy="btn-edit-product"
                      onClick={() => openEditModal(product)}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-blue-600/20 transition group"
                      type="button"
                      aria-label={`Editar produto ${product.code}`}
                    >
                      <TbEdit className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                    </button>

                    <button
                      data-cy="btn-delete-product"
                      onClick={() => dispatch(deleteProduct(product.id))}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-red-600/20 transition group"
                      type="button"
                      aria-label={`Excluir produto ${product.code}`}
                    >
                      <TbTrash className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && !loading && (
                <tr data-cy="products-empty">
                  <td className="py-6 text-slate-400" colSpan={4}>
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-6" data-cy="modal-product">
          <h2 className="text-2xl font-bold" data-cy="modal-title">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </h2>

          {/* Form do produto */}
          <form onSubmit={handleSubmit} className="space-y-4" data-cy="product-form">
            <input
              data-cy="input-code"
              className="bg-slate-700 border border-slate-600 p-3 w-full rounded-lg"
              placeholder="Código"
              value={form.code}
              disabled={isEditing}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />

            <input
              data-cy="input-name"
              className="bg-slate-700 border border-slate-600 p-3 w-full rounded-lg"
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              data-cy="input-price"
              type="text"
              inputMode="decimal"
              className="bg-slate-700 border border-slate-600 p-3 w-full rounded-lg"
              placeholder="Preço"
              value={form.price}
              onChange={(e) => {
                setForm({ ...form, price: e.target.value })
              }}
            />

            <button
              data-cy="btn-submit-product"
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 transition w-full py-3 rounded-xl font-medium"
            >
              {isEditing ? "Atualizar Produto" : "Salvar Produto"}
            </button>
          </form>

          {/* Associação */}
          {isEditing && (
            <div
              className="space-y-6 pt-6 border-t border-slate-700"
              data-cy="association-section"
            >
              <h3 className="text-lg font-semibold" data-cy="association-title">
                Matérias-Primas Associadas
              </h3>

              <div className="flex gap-3" data-cy="association-form">
                <select
                  data-cy="select-material"
                  className="bg-slate-700 border border-slate-600 p-3 rounded-lg flex-1"
                  value={newMaterialId}
                  onChange={(e) => setNewMaterialId(Number(e.target.value))}
                  disabled={!!editingMaterialId}
                >
                  <option value={0}>Selecione</option>
                  {materials.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.name}
                    </option>
                  ))}
                </select>

                <input
                  data-cy="input-required-quantity"
                  type="number"
                  placeholder="Quantidade"
                  className="bg-slate-700 border border-slate-600 p-3 rounded-lg w-32"
                  value={requiredQuantity}
                  onChange={(e) => setRequiredQuantity(Number(e.target.value))}
                />

                <button
                  data-cy="btn-save-association"
                  type="button"
                  onClick={handleSaveMaterial}
                  className={`px-4 rounded-lg transition ${
                    editingMaterialId
                      ? "bg-blue-600 hover:bg-blue-500"
                      : "bg-emerald-600 hover:bg-emerald-500"
                  }`}
                >
                  {editingMaterialId ? "Atualizar" : "Adicionar"}
                </button>

                {editingMaterialId && (
                  <button
                    data-cy="btn-cancel-association"
                    type="button"
                    onClick={resetAssociationForm}
                    className="px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <ul className="space-y-3" data-cy="association-list">
                {selectedProduct?.materials?.map((material: any) => (
                  <li
                    key={material.id}
                    className="bg-slate-700/60 border border-slate-600 rounded-xl p-4 flex justify-between items-center"
                    data-cy={`assoc-item-${material.id}`}
                  >
                    <span data-cy="assoc-text">
                      {material.rawMaterialName} | Qtde: {material.requiredQuantity}
                    </span>

                    <div className="space-x-3" data-cy="assoc-actions">
                      <button
                        data-cy="btn-edit-assoc"
                        type="button"
                        onClick={() => startEditAssociation(material)}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-blue-600/20 transition group"
                        aria-label={`Editar associação ${material.id}`}
                      >
                        <TbEdit className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      </button>

                      <button
                        data-cy="btn-delete-assoc"
                        type="button"
                        onClick={() => handleDeleteAssociation(material.id)}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-red-600/20 transition group"
                        aria-label={`Excluir associação ${material.id}`}
                      >
                        <TbTrash className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                      </button>
                    </div>
                  </li>
                ))}

                {(!selectedProduct?.materials || selectedProduct.materials.length === 0) && (
                  <li className="text-slate-400" data-cy="association-empty">
                    Nenhuma matéria-prima associada.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}