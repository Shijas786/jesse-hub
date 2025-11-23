'use client';

import Image from 'next/image';
import { useEnsAvatar, useEnsName } from 'wagmi';
import { FarcasterProfile } from '@/types';
import { formatAddress } from '@/utils/format';

interface IdentityPillProps {
    address: `0x${string}`;
    farcaster?: Partial<FarcasterProfile> | null;
}

export function IdentityPill({ address, farcaster }: IdentityPillProps) {
    const { data: ensName } = useEnsName({
        chainId: 1,
        address,
    });
    const { data: ensAvatar } = useEnsAvatar({
        chainId: 1,
        name: ensName ?? undefined,
    });

    const displayName = farcaster?.displayName ?? ensName ?? formatAddress(address);
    const avatar = farcaster?.avatar ?? ensAvatar ?? '/images/avatar-fallback.svg';

    return (
        <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-black bg-white/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                <Image
                    src={avatar}
                    alt={displayName}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    loader={() => avatar}
                    unoptimized
                />
            </div>
            <div className="overflow-hidden">
                <p className="font-black truncate leading-tight">{displayName}</p>
                <p className="text-xs text-white/60 font-bold truncate">
                    {farcaster?.username ? `@${farcaster.username}` : ensName ?? formatAddress(address)}
                </p>
            </div>
        </div>
    );
}

