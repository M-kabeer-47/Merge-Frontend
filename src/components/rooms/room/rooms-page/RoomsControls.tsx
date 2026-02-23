import SearchBar from "@/components/ui/SearchBar";
import Tabs from "@/components/ui/Tabs";
import { motion } from "motion/react";
interface ControlsProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  searchTerm: string;
  handleSearch: (value: string) => void;
  tabOptions: { key: string; label: string }[];
}
export default function Controls({
  activeTab,
  handleTabChange,
  searchTerm,
  handleSearch,
  tabOptions,
}: ControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between"
    >
      <div className="w-full flex-1 lg:max-w-lg">
        <Tabs
          options={tabOptions}
          activeKey={activeTab}
          onChange={handleTabChange}
        />
      </div>
      <div className="lg:w-80">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search rooms..."
          defaultValue={searchTerm}
        />
      </div>
    </motion.div>
  );
}
