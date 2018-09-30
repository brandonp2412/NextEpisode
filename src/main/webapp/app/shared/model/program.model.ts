import { IEpisode } from 'app/shared/model//episode.model';

export interface IProgram {
    id?: number;
    name?: string;
    imageContentType?: string;
    image?: any;
    lastEpisode?: IEpisode;
}

export class Program implements IProgram {
    constructor(
        public id?: number,
        public name?: string,
        public imageContentType?: string,
        public image?: any,
        public lastEpisode?: IEpisode
    ) {}
}
