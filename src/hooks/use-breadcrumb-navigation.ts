import { useState, useEffect } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface BreadcrumbItem {
    id: string;
    name: string;
}

interface UseBreadcrumbNavigationParams {
    router: AppRouterInstance;
    currentId: string | null;
    storageKey: string;
    basePath: string; // e.g., '/notes' or '/rooms'
}

/**
 * Reusable hook for managing breadcrumb navigation with localStorage persistence
 * Can be used for notes, rooms, or any hierarchical navigation
 */
export function useBreadcrumbNavigation({
    router,
    currentId,
    storageKey,
    basePath,
}: UseBreadcrumbNavigationParams) {
    const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([]);

    // Load breadcrumb path from localStorage on mount
    useEffect(() => {
        const savedPath = sessionStorage.getItem(storageKey);
        if (savedPath) {
            try {
                setBreadcrumbPath(JSON.parse(savedPath));
            } catch (e) {
                setBreadcrumbPath([]);
            }
        }
    }, [storageKey]);

    // Update breadcrumb path when currentId changes
    useEffect(() => {
        if (!currentId) {
            // At root, clear path
            setBreadcrumbPath([]);
            sessionStorage.removeItem(storageKey);
        }
    }, [currentId, storageKey]);

    /**
     * Navigate to a specific breadcrumb
     */
    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            // Home - clear path
            setBreadcrumbPath([]);
            sessionStorage.removeItem(storageKey);
            router.push(basePath);
        } else {
            // Navigate to specific folder and trim path
            const newPath = breadcrumbPath.slice(0, index + 1);
            setBreadcrumbPath(newPath);
            sessionStorage.setItem(storageKey, JSON.stringify(newPath));
            router.push(`${basePath}?folderId=${breadcrumbPath[index].id}`);
        }
    };

    /**
     * Navigate into a folder
     */
    const handleFolderNavigation = (folderId: string, folderName: string) => {
        const newPath = [...breadcrumbPath, { id: folderId, name: folderName }];
        setBreadcrumbPath(newPath);
        sessionStorage.setItem(storageKey, JSON.stringify(newPath));
        router.push(`${basePath}?folderId=${folderId}`);
    };

    /**
     * Navigate back to parent folder
     */
    const handleBackNavigation = () => {
        // Remove last item from breadcrumb path
        const newPath = breadcrumbPath.slice(0, -1);
        setBreadcrumbPath(newPath);

        // Navigate based on new path
        if (newPath.length > 0) {
            // Go to the last folder in the new path
            const parentFolder = newPath[newPath.length - 1];
            sessionStorage.setItem(storageKey, JSON.stringify(newPath));
            router.push(`${basePath}?folderId=${parentFolder.id}`);
        } else {
            // Go to root
            sessionStorage.removeItem(storageKey);
            router.push(basePath);
        }
    };

    return {
        breadcrumbs: breadcrumbPath,
        handleBreadcrumbClick,
        handleFolderNavigation,
        handleBackNavigation,
    };
}
