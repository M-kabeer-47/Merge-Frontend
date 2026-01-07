import { useState } from "react";
import { MoreVertical, Edit, Calendar, Trash2 } from "lucide-react";
import DropdownMenu from "@/components/ui/Dropdown";

interface AssignmentCardMenuProps {
  assignmentId: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AssignmentCardMenu({
  assignmentId,
  onEdit,
  onDelete,
}: AssignmentCardMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  const menuOptions = [
    {
      title: "Edit Assignment",
      icon: <Edit className="w-4 h-4" />,
      action: () => onEdit?.(assignmentId),
    },
    {
      title: "Change Due Date",
      icon: <Calendar className="w-4 h-4" />,
      action: () => {
        console.log("Change due date for:", assignmentId);
      },
    },
    {
      title: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      action: () => onDelete?.(assignmentId),
      destructive: true,
    },
  ];

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors text-para-muted"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-8 z-10">
          <DropdownMenu
            options={menuOptions}
            onClose={() => setShowMenu(false)}
            align="right"
          />
        </div>
      )}
    </div>
  );
}
