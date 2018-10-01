import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IProgram {
    id?: number;
    name?: string;
    imageContentType?: string;
    image?: any;
    episodeNumber?: number;
    episodeSeason?: number;
    episodeDate?: Moment;
    user?: IUser;
}

export class Program implements IProgram {
    constructor(
        public id?: number,
        public name?: string,
        public imageContentType?: string,
        public image?: any,
        public episodeNumber?: number,
        public episodeSeason?: number,
        public episodeDate?: Moment,
        public user?: IUser
    ) {}
}
