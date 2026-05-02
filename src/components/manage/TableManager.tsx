import { useEffect, useState } from "react";
import { getAllTabs, createTab, deleteTabById } from "../../api/tabApi";
import { Trash2, Plus } from "lucide-react";

interface Tab {
    id: number;
    tableNumber: string;
    tableStatus: string;
    createdAt: string;
}

export function TableManager() {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTableNumber, setNewTableNumber] = useState("");
    const [adding, setAdding] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState("");

    const fetchTabs = () => {
    setIsLoading(true);
    getAllTabs()
        .then((res) => setTabs(res.data))
        .catch((err) => console.error("Failed to load tables", err))
        .finally(() => setIsLoading(false));
    };

    useEffect(() => {
    fetchTabs();
    }, []);

    const handleAdd = async () => {
    //First check if empty
    if (!newTableNumber.trim()) return;

    //Loop through tabs and checking for duplicates
    const isDuplicate = tabs.some((tab) => tab.tableNumber === newTableNumber);
    if (isDuplicate) {
        setFormError(`Table #${newTableNumber} already exists`);
        return;
    }

    //Handles table creation by calling createTab from API
    try {
        setAdding(true);
        await createTab(newTableNumber);
        setNewTableNumber("");
        setShowForm(false);
        fetchTabs(); 
    } catch (err) {
        console.error("Failed to create table", err);
    } finally {
        setAdding(false);
    }
    };

    //Handles table deletion by calling deleteTabById from API
    const handleDelete = async (id: number) => {
    try {
        await deleteTabById(id);
        fetchTabs(); 
    } catch (err) {
        console.error("Failed to delete table", err);
    }
    };

    if (isLoading) return (
    <div className="flex items-center justify-center h-full text-gray-400">
        Loading tables...
    </div>
    );

    return (
    <div className="p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Manage Tables</h2>
            <button
                onClick={() => setShowForm((prev) => !prev)}
                className="flex items-center gap-2 bg-[#0C2B4E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0a2340]"
            >
                <Plus size={16} />
                Add Table
            </button>
        </div>

        {showForm && (
        <div className="mb-6 flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
                {/* Form will immediatly display error message if something other than a number is typed, as well as */}
                <input
                    type="text"
                    placeholder="Table number e.g. 5"
                    value={newTableNumber}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value && !/^\d+$/.test(value)) {
                            setFormError("Only numbers are allowed");
                        } else {
                            setFormError("");
                            setNewTableNumber(e.target.value);
                        }
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
                />
                <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="bg-[#0C2B4E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0a2340]"
                >
                    {adding ? "Adding..." : "Confirm"}
                </button>
                <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 text-sm hover:text-gray-600"
                >
                    Cancel
                </button>
            </div>
            {formError && <p className="text-red-500 text-sm ml-1">{formError}</p>}
        </div>
        )}

        {tabs.length === 0 ? (
        <p className="text-gray-400">No tables yet. Add one above.</p>
        ) : (

        <div className="grid grid-cols-4 gap-3">
            {/* Showing all existing tables */}
            {tabs.map((tab) => (
            <div
                key={tab.id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
            >
                <span className="font-semibold text-gray-800">
                Table #{tab.tableNumber}
                </span>
                {/* Delete button */}
                <button
                onClick={() => handleDelete(tab.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                >
                <Trash2 size={16} />
                </button>
            </div>
            ))}
        </div>
        )}
    </div>
    );
}