import { useEffect, useState } from "react";
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItemById,
} from "../../api/menuItemApi";
import { Trash2, Plus, Pencil, Check, X } from "lucide-react";

const SECTIONS = ["FOOD", "DRINK", "COCKTAIL", "BEER", "WINE"] as const;
type SectionType = (typeof SECTIONS)[number];

interface MenuItem {
  id: number;
  name: string;
  price: number;
  section: SectionType;
  createdAt: string;
}

export function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSection, setNewSection] = useState<SectionType>("FOOD");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editError, setEditError] = useState("");

  const fetchItems = () => {
    setIsLoading(true);
    getAllMenuItems()
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Failed to load menu items", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!newPrice || parseFloat(newPrice) <= 0) {
      setFormError("A price is required and must be greater than 0");
      return;
    }

    const isDuplicate = items.some(
      (item) => item.name.toLowerCase() === newName.trim().toLowerCase(),
    );
    if (isDuplicate) {
      setFormError(`"${newName}" already exists`);
      return;
    }

    try {
      setAdding(true);
      await createMenuItem(newName.trim(), parseFloat(newPrice), newSection);
      setNewName("");
      setNewPrice("");
      setNewSection("FOOD");
      setShowForm(false);
      setFormError("");
      fetchItems();
    } catch (err) {
      console.error("Failed to create menu item", err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMenuItemById(id);
      fetchItems();
    } catch (err) {
      console.error("Failed to delete menu item", err);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price.toString());
    setEditError("");
  };

  const handleConfirmEdit = async (id: number) => {
    if (!editName.trim()) {
      setEditError("Name is required");
      return;
    }
    if (!editPrice || parseFloat(editPrice) <= 0) {
      setEditError("A price is required and must be greater than 0");
      return;
    }

    try {
      await updateMenuItem(id, {
        name: editName.trim(),
        price: parseFloat(editPrice),
      });
      handleCancelEdit();
      fetchItems();
    } catch (err) {
      console.error("Failed to update menu item", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading menu items...
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Menu Items</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 bg-[#0C2B4E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0a2340]"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {showForm && (
        <div className="mb-6 flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
          <input
            type="text"
            placeholder="Item name e.g. Pornstar Martini"
            value={newName}
            onChange={(e) => {
              setFormError("");
              setNewName(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
          />
          <input
            type="text"
            placeholder="Price e.g. 7.99"
            value={newPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value && !/^\d*\.?\d*$/.test(value)) {
                setFormError("Only numbers are allowed for pricing");
              } else {
                setFormError("");
                setNewPrice(value);
              }
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
          />
          <select
            value={newSection}
            onChange={(e) => setNewSection(e.target.value as SectionType)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
          >
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-[#0C2B4E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0a2340]"
          >
            {adding ? "Adding..." : "Confirm"}
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setFormError("");
            }}
            className="text-gray-400 text-sm hover:text-gray-600"
          >
            Cancel
          </button>
          {formError && (
            <p className="text-red-500 text-sm ml-1">{formError}</p>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-gray-400">No items yet. Add one above.</p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
            >
              {editingId === item.id ? (
                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => {
                      setEditError("");
                      setEditName(e.target.value);
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
                  />
                  <input
                    type="text"
                    value={editPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value && !/^\d*\.?\d*$/.test(value)) {
                        setEditError("Only numbers are allowed for pricing");
                      } else {
                        setEditError("");
                        setEditPrice(value);
                      }
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
                  />
                  {editError && (
                    <p className="text-red-500 text-sm ml-1">{editError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmEdit(item.id)}
                      className="text-green-500 hover:text-green-700 transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="font-semibold text-gray-800">
                    {item.name}
                  </span>
                  <span className="text-gray-500">€{item.price}</span>
                  <span className="text-gray-400">{item.section}</span>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-gray-400 hover:text-[#0C2B4E] transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
