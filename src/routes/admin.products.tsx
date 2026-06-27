import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShop, type AdminProduct } from "@/lib/store";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const emptyForm: AdminProduct = {
  id: "",
  name: "",
  category: "beef",
  group: "meat",
  subcategory: "",
  price: 0,
  unit: "lb",
  image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80",
  description: "",
  stock: 10,
};

function AdminProducts() {
  const products = useShop((s) => s.adminProducts);
  const addProduct = useShop((s) => s.addProduct);
  const updateProduct = useShop((s) => s.updateProduct);
  const deleteProduct = useShop((s) => s.deleteProduct);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "meat" | "grocery">("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit"; data: AdminProduct } | null>(null);

  const filtered = products.filter((p) => {
    const matchQ =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());
    const matchG = filter === "all" || p.group === filter;
    return matchQ && matchG;
  });

  const openAdd = () =>
    setModal({ mode: "add", data: { ...emptyForm, id: `p-${Date.now()}` } });
  const openEdit = (p: AdminProduct) => setModal({ mode: "edit", data: p });

  const save = () => {
    if (!modal) return;
    const d = modal.data;
    if (!d.name.trim() || d.price <= 0) {
      toast.error("Name and price are required");
      return;
    }
    if (modal.mode === "add") {
      addProduct(d);
      toast.success(`Added ${d.name}`);
    } else {
      updateProduct(d.id, d);
      toast.success(`Updated ${d.name}`);
    }
    setModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your meat cuts, grocery items, and stock levels.
          </p>
        </div>
        <Button onClick={openAdd} className="bg-meat text-white hover:bg-meat-dark">
          <Plus className="mr-1.5 h-4 w-4" /> Add product
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className="w-64 pl-9 focus-visible:ring-meat"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1">
          {(["all", "meat", "grocery"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === g ? "bg-meat text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No products found. Add your first one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-12 w-12 shrink-0 rounded-md object-cover"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-ink">{p.name}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {p.subcategory}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-700">{p.category}</td>
                    <td className="px-4 py-3 font-bold text-meat">
                      ${p.price.toFixed(2)}
                      <span className="ml-1 text-xs font-medium text-muted-foreground">
                        /{p.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          p.stock <= 5
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-meat"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${p.name}?`)) {
                              deleteProduct(p.id);
                              toast.success(`Deleted ${p.name}`);
                            }
                          }}
                          className="rounded-md p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-bold text-ink">
                {modal.mode === "add" ? "Add new product" : "Edit product"}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Name</Label>
                <Input
                  value={modal.data.name}
                  onChange={(e) =>
                    setModal({ ...modal, data: { ...modal.data, name: e.target.value } })
                  }
                  className="mt-1.5 focus-visible:ring-meat"
                />
              </div>
              <div>
                <Label>Group</Label>
                <select
                  value={modal.data.group}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      data: { ...modal.data, group: e.target.value as "meat" | "grocery" },
                    })
                  }
                  className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-meat"
                >
                  <option value="meat">Meat</option>
                  <option value="grocery">Grocery</option>
                </select>
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={modal.data.category}
                  onChange={(e) =>
                    setModal({ ...modal, data: { ...modal.data, category: e.target.value } })
                  }
                  className="mt-1.5 focus-visible:ring-meat"
                />
              </div>
              <div>
                <Label>Subcategory</Label>
                <Input
                  value={modal.data.subcategory}
                  onChange={(e) =>
                    setModal({ ...modal, data: { ...modal.data, subcategory: e.target.value } })
                  }
                  className="mt-1.5 focus-visible:ring-meat"
                />
              </div>
              <div>
                <Label>Unit (e.g. lb, item)</Label>
                <Input
                  value={modal.data.unit}
                  onChange={(e) =>
                    setModal({ ...modal, data: { ...modal.data, unit: e.target.value } })
                  }
                  className="mt-1.5 focus-visible:ring-meat"
                />
              </div>
              <div>
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={modal.data.price}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      data: { ...modal.data, price: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="mt-1.5 focus-visible:ring-meat"
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={modal.data.stock}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      data: { ...modal.data, stock: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="mt-1.5 focus-visible:ring-meat"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Image URL</Label>
                <Input
                  value={modal.data.image}
                  onChange={(e) =>
                    setModal({ ...modal, data: { ...modal.data, image: e.target.value } })
                  }
                  className="mt-1.5 focus-visible:ring-meat"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <textarea
                  value={modal.data.description}
                  onChange={(e) =>
                    setModal({ ...modal, data: { ...modal.data, description: e.target.value } })
                  }
                  rows={3}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-meat"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
              <Button variant="outline" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button onClick={save} className="bg-meat text-white hover:bg-meat-dark">
                {modal.mode === "add" ? "Add product" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
