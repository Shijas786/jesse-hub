import { GmEventItem } from '@/lib/covalent';

const normalize = (address: string) => address.toLowerCase() as `0x${string}`;

export interface GmStreak {
    streak: number;
    lastTimestamp: string;
}

export function buildGmStreakMap(events: GmEventItem[]) {
    const map = new Map<`0x${string}`, GmStreak>();

    events.forEach((event) => {
        if (event.decoded?.name !== 'GMed') {
            return;
        }

        const userParam = event.decoded.params.find((param) => param.name === 'user');
        const streakParam = event.decoded.params.find((param) => param.name === 'streak');
        if (!userParam || !streakParam) {
            return;
        }

        const address = normalize(userParam.value);
        const streakValue = Number(streakParam.value);
        if (!Number.isFinite(streakValue)) {
            return;
        }

        const existing = map.get(address);
        if (!existing || new Date(event.block_signed_at) > new Date(existing.lastTimestamp)) {
            map.set(address, { streak: streakValue, lastTimestamp: event.block_signed_at });
        }
    });

    return map;
}

