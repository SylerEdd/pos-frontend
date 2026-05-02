import { Users } from "lucide-react";

interface TableCardProps {
  id: number;
  tableNumber: string;
  tableStatus: string;
  openedAt: string;
  isSelected: boolean;
  onClick: () => void;
}

export function TableCard({
  tableNumber,
  tableStatus,
  openedAt,
  // isSelected is for adding ring outside the card so user will know which one is sleected
  isSelected,
  onClick,
}: TableCardProps) {
  const isOccupied = tableStatus === "occupied";

  const bgColor = isOccupied ? "bg-[#C9A8D5]" : "bg-[#A8D5A2]";
  const ringColor = isSelected ? "ring-4 ring-[#0C2B4E]" : "";

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString("en-IE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={onClick}
      className={`${bgColor} ${ringColor} rounded-xl p-3 cursor-pointer transition-all hover:opacity-90 flex flex-col justify-between h-24`}
    >
      {/* Table number */}
      <p className="text-sm font-bold text-gray-800"> Table #{tableNumber}</p>

      {/* Time opened */}
      {openedAt && (
        <p className="text-xs text-gray-600">{formatTime(openedAt)}</p>
      )}

      {/* Status*/}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Users size={14} className="text-gray-700" />
          <span className="text-xs text-gray-700">
            {isOccupied ? "occupied" : "free"}
          </span>
        </div>
      </div>
    </div>
  );
}
