import { useState } from 'react';
import { UUID } from '../types/fields';

type withUUID = { uuid?: UUID };

export type UseDragAndDropReturn<T extends withUUID> = {
    draggedItem: T | null;
    overItem: T | null;
    onDragStart: (item: T) => React.DragEventHandler;
    onDragOver: (item: T) => React.DragEventHandler;
    onDragEnd: React.DragEventHandler;
    onDrop: (targetItem: T, onDropItem: (from: T, to: T) => void) => React.DragEventHandler;
    reorderItems: (items: T[], from: T, to: T) => T[];
};

export function useDragAndDrop<T extends withUUID>(): UseDragAndDropReturn<T> {
    const [draggedItem, setDraggedItem] = useState<T | null>(null);
    const [overItem, setOverItem] = useState<T | null>(null);

    const onDragStart = (item: T) => () => {
        setDraggedItem(item);
    };

    const onDragOver = (item: T) => (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setOverItem(item);
    };

    const onDragEnd: React.DragEventHandler = () => {
        setDraggedItem(null);
    };

    const onDrop = (targetItem: T, onDropItem: (from: T, to: T) => void) => () => {
        if (draggedItem && draggedItem !== targetItem) {
        onDropItem(draggedItem, targetItem);
        }
        setDraggedItem(null);
    };
    
    const reorderItems = (items: T[], from: T, to: T): T[] => {
        const fromIndex = items.findIndex(i => i.uuid === from.uuid);
        const toIndex = items.findIndex(i => i.uuid === to.uuid);
        const updated = [...items];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        return updated.map((item, index) => ({
            ...item,
            order: index,
        }));
    }

    return { draggedItem, overItem, onDragStart, onDragOver, onDragEnd, onDrop, reorderItems };
}
