import React from 'react';
import { CachedPromise, createCachedPromise } from '../util/ExPromise';

export type TodoItem<T = undefined> = {
    id: string;
    Icon: React.FC<TodoItemIconProps<T>>;
    category?: string;
    categoryHref?: string;
    title: string;
    titleHref?: string;
    actions: TodoItemAction<T>[];
    dueDate?: Date;
    data: T;
};

export type TodoItemAction<T> = {
    Icon: React.FC<TodoItemActionIconProps<T>>;
    title: string;
    onAction: (item: TodoItem) => TodoItemActionReturn | undefined;
    divider?: boolean /* trueなら下に<Divider />を挟む */;
};

export type TodoItemActionReturn = {
    closePopup?: boolean;
    refreshList?: boolean;
};

export type TodoItemIconProps<T> = {
    item: TodoItem<T>;
};

export type TodoItemActionIconProps<T> = {
    item: TodoItem<T>;
    action: TodoItemAction<T>;
};

export function getTodoItems(): CachedPromise<TodoItem[]> {
    return createCachedPromise(async (resolveCache) => {
        resolveCache([]);
        return [];
    });
}
