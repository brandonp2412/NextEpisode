import { Moment } from 'moment';

export interface INextEpisode {
    id?: number;
    name?: string;
    imageContentType?: string;
    image?: any;
    episodeNumber?: number;
    episodeSeason?: number;
    episodeDate?: Moment;
    daysLeft?: number;
    alreadyOut?: boolean;
}

export class NextEpisode implements INextEpisode {
    constructor(
        public id?: number,
        public name?: string,
        public imageContentType?: string,
        public image?: any,
        public episodeNumber?: number,
        public episodeSeason?: number,
        public episodeDate?: Moment,
        public daysLeft?: number,
        public alreadyOut?: boolean
    ) {}
}
