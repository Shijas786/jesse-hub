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
            <div className="h-12 w-12 rounded-full overflow-hidden border border-white/10 relative">
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
            <div>
                <p className="font-semibold">{displayName}</p>
                <p className="text-xs text-white/60">
                    {farcaster?.username ? `@${farcaster.username}` : ensName ?? formatAddress(address)}
                </p>
            </div>
        </div>
    );
}

