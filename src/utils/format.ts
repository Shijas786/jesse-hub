export const formatNumber = (value: number, decimals = 0) =>
    Intl.NumberFormat('en-US', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
    }).format(value);

export const formatUsd = (value: number, decimals = 2) =>
    Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
    }).format(value);

export const formatPercentage = (value: number, decimals = 2) =>
    `${value.toFixed(decimals)}%`;

export const formatAddress = (address: string) =>
    `${address.slice(0, 6)}…${address.slice(-4)}`;

export const daysBetween = (start: string, end: Date = new Date()) => {
    const diff = end.getTime() - new Date(start).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

export const timeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

