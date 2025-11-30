import { motion } from "motion/react";
import NoteGridItem from "@/components/notes/NoteGridItem";
import type { NoteOrFolder } from "@/types/note";

interface NotesGridViewProps {
    items: NoteOrFolder[];
    onItemClick: (id: string) => void;
    getItemMenuOptions: (id: string) => Array<{ title: string; action: () => void }>;
}

export default function NotesGridView({
    items,
    onItemClick,
    getItemMenuOptions,
}: NotesGridViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
            {items.map((item) => (
                <NoteGridItem
                    key={item.id}
                    item={item}
                    onClick={onItemClick}
                    menuOptions={getItemMenuOptions(item.id)}
                />
            ))}
        </motion.div>
    );
}