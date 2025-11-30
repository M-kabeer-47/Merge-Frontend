import { motion } from "motion/react";
import NoteListRow from "@/components/notes/NoteListRow";
import NotesTableHeader from "@/components/notes/NotesTableHeader";
import type { NoteOrFolder } from "@/types/note";

interface NotesListViewProps {
    items: NoteOrFolder[];
    onItemClick: (id: string) => void;
    getItemMenuOptions: (id: string) => Array<{ title: string; action: () => void }>;
}

export default function NotesListView({
    items,
    onItemClick,
    getItemMenuOptions,
}: NotesListViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="border border-light-border rounded-lg overflow-hidden bg-main-background"
        >
            <table className="w-full">
                <NotesTableHeader />
                <tbody>
                    {items.map((item) => (
                        <NoteListRow
                            key={item.id}
                            item={item}
                            onClick={onItemClick}
                            menuOptions={getItemMenuOptions(item.id)}
                        />
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
}
