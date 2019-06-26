export interface AggregatedVoteForRing {
    ring: string;
    count: number; // number of votes got by a certain ring on a certain Technology and Ring
    votesForEvent: Array<{
        eventName: string;
        count: number; // number of votes got by a certain ring on a certain Technology, Ring and Event
    }>;
}
export interface AggregatedVote {
    technology: string;
    quadrant: string;
    isnew: boolean;
    count: number; // number of votes got by a certain ring on a certain Technology
    votesForRing: Array<AggregatedVoteForRing>;
}
