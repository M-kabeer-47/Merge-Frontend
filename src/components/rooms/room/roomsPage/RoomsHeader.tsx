import { Button } from "@/components/ui/Button";
import { IconPlus } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Link } from "lucide-react";

interface RoomsHeaderProps {
  title: string;
  activeTab: string;
  setIsJoinModalOpen: (value: boolean) => void;
  setIsCreateModalOpen: (value: boolean) => void;
}
export default function RoomsHeader({
  title,
  activeTab,
  setIsJoinModalOpen,
  setIsCreateModalOpen,
}: RoomsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 className="text-3xl font-raleway font-bold text-heading">
          {title}
        </h1>
        <p className="text-para-muted mt-2">
          {activeTab === "all" &&
            "Discover and join collaborative learning rooms"}
          {activeTab === "joined" && "Rooms you're currently participating in"}
          {activeTab === "my-rooms" && "Rooms you've created and manage"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          variant="outline"
          onClick={() => setIsJoinModalOpen(true)}
        >
          <Link className="h-4 w-4" />
          Join Room
        </Button>
        <Button
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <IconPlus className="h-4 w-4" />
          Create Room
        </Button>
      </div>
    </motion.div>
  );
}
