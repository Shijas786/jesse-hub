type Value = string | null;

const store = new Map<string, string>();

async function getItem(key: string): Promise<Value> {
    return store.get(key) ?? null;
}

async function setItem(key: string, value: string): Promise<void> {
    store.set(key, value);
}

async function removeItem(key: string): Promise<void> {
    store.delete(key);
}

async function clear(): Promise<void> {
    store.clear();
}

export const AsyncStorage = {
    getItem,
    setItem,
    removeItem,
    clear,
};

export default AsyncStorage;

