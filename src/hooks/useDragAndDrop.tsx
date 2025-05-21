import { useState } from 'react';

type withId = { id?: string | number };

export type UseDragAndDropReturn<T extends withId> = {
    draggedItem: T | null;
    onDragStart: (item: T) => React.DragEventHandler;
    onDragOver: React.DragEventHandler;
    onDrop: (targetItem: T, onDropItem: (from: T, to: T) => void) => React.DragEventHandler;
    reorderItems: (items: T[], from: T, to: T) => T[];
};

export function useDragAndDrop<T extends withId>(): UseDragAndDropReturn<T> {
    const [draggedItem, setDraggedItem] = useState<T | null>(null);

    const onDragStart = (item: T) => () => {
        setDraggedItem(item);
    };

    const onDragOver: React.DragEventHandler = (e) => {
        e.preventDefault();
    };

    const onDrop = (targetItem: T, onDropItem: (from: T, to: T) => void) => () => {
        if (draggedItem && draggedItem !== targetItem) {
        onDropItem(draggedItem, targetItem);
        }
        setDraggedItem(null);
    };
    
    const reorderItems = (items: T[], from: T, to: T): T[] => {
        const fromIndex = items.findIndex(i => i.id === from.id);
        const toIndex = items.findIndex(i => i.id === to.id);
        const updated = [...items];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        return updated.map((item, index) => ({
            ...item,
            order: index,
        }));
    }

    return { draggedItem, onDragStart, onDragOver, onDrop, reorderItems };
}
