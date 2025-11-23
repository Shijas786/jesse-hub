import { GmEventItem } from '@/lib/covalent';

const normalize = (address: string) => address.toLowerCase() as `0x${string}`;

export interface GmStreak {
    streak: number;
    lastTimestamp: string;
}

export function buildGmStreakMap(events: GmEventItem[]) {
    const map = new Map<`0x${string}`, GmStreak>();

    events.forEach((event) => {
        // Events now have log_events array - iterate through them
        if (!event.log_events || !Array.isArray(event.log_events)) {
            return;
        }

        for (const logEvent of event.log_events) {
            if (logEvent.decoded?.name !== 'GMed') {
                continue;
            }

            const userParam = logEvent.decoded.params.find((param) => param.name === 'user');
            const streakParam = logEvent.decoded.params.find((param) => param.name === 'streak');
            if (!userParam || !streakParam) {
                continue;
            }

            const address = normalize(userParam.value);
            const streakValue = Number(streakParam.value);
            if (!Number.isFinite(streakValue)) {
                continue;
            }

            const existing = map.get(address);
            if (!existing || new Date(event.block_signed_at) > new Date(existing.lastTimestamp)) {
                map.set(address, { streak: streakValue, lastTimestamp: event.block_signed_at });
            }
        }
    });

    return map;
}

