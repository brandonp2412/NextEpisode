import { Moment } from 'moment';

export interface IEpisode {
    id?: number;
    number?: number;
    season?: number;
    releaseDate?: Moment;
}

export class Episode implements IEpisode {
    constructor(public id?: number, public number?: number, public season?: number, public releaseDate?: Moment) {}
}
