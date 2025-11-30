import React from "react";

/**
 * Table header component for notes list view
 * Provides consistent column headers
 */
export default function NotesTableHeader() {
    return (
        <thead className="border-b border-light-border">
            <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase">
                    Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase">
                    Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase">
                    Modified
                </th>
                <th className="px-4 py-3"></th>
            </tr>
        </thead>
    );
}
