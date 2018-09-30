import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEpisode } from 'app/shared/model/episode.model';

type EntityResponseType = HttpResponse<IEpisode>;
type EntityArrayResponseType = HttpResponse<IEpisode[]>;

@Injectable({ providedIn: 'root' })
export class EpisodeService {
    private resourceUrl = SERVER_API_URL + 'api/episodes';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/episodes';

    constructor(private http: HttpClient) {}

    create(episode: IEpisode): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(episode);
        return this.http
            .post<IEpisode>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(episode: IEpisode): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(episode);
        return this.http
            .put<IEpisode>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IEpisode>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEpisode[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEpisode[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    private convertDateFromClient(episode: IEpisode): IEpisode {
        const copy: IEpisode = Object.assign({}, episode, {
            releaseDate: episode.releaseDate != null && episode.releaseDate.isValid() ? episode.releaseDate.format(DATE_FORMAT) : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.releaseDate = res.body.releaseDate != null ? moment(res.body.releaseDate) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((episode: IEpisode) => {
            episode.releaseDate = episode.releaseDate != null ? moment(episode.releaseDate) : null;
        });
        return res;
    }
}
