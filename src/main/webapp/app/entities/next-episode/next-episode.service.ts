import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { INextEpisode } from 'app/shared/model/next-episode.model';

type EntityResponseType = HttpResponse<INextEpisode>;
type EntityArrayResponseType = HttpResponse<INextEpisode[]>;

@Injectable({ providedIn: 'root' })
export class NextEpisodeService {
    private resourceUrl = SERVER_API_URL + 'api/next-episodes';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/next-episodes';

    constructor(private http: HttpClient) {}

    create(nextEpisode: INextEpisode): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(nextEpisode);
        return this.http
            .post<INextEpisode>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(nextEpisode: INextEpisode): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(nextEpisode);
        return this.http
            .put<INextEpisode>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<INextEpisode>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<INextEpisode[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<INextEpisode[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    private convertDateFromClient(nextEpisode: INextEpisode): INextEpisode {
        const copy: INextEpisode = Object.assign({}, nextEpisode, {
            episodeDate:
                nextEpisode.episodeDate != null && nextEpisode.episodeDate.isValid() ? nextEpisode.episodeDate.format(DATE_FORMAT) : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.episodeDate = res.body.episodeDate != null ? moment(res.body.episodeDate) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((nextEpisode: INextEpisode) => {
            nextEpisode.episodeDate = nextEpisode.episodeDate != null ? moment(nextEpisode.episodeDate) : null;
        });
        return res;
    }
}
