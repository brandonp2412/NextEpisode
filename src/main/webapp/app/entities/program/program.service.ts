import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProgram } from 'app/shared/model/program.model';

type EntityResponseType = HttpResponse<IProgram>;
type EntityArrayResponseType = HttpResponse<IProgram[]>;

@Injectable({ providedIn: 'root' })
export class ProgramService {
    private resourceUrl = SERVER_API_URL + 'api/programs';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/programs';

    constructor(private http: HttpClient) {}

    create(program: IProgram): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(program);
        return this.http
            .post<IProgram>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(program: IProgram): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(program);
        return this.http
            .put<IProgram>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IProgram>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IProgram[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IProgram[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    private convertDateFromClient(program: IProgram): IProgram {
        const copy: IProgram = Object.assign({}, program, {
            episodeDate: program.episodeDate != null && program.episodeDate.isValid() ? program.episodeDate.format(DATE_FORMAT) : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.episodeDate = res.body.episodeDate != null ? moment(res.body.episodeDate) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((program: IProgram) => {
            program.episodeDate = program.episodeDate != null ? moment(program.episodeDate) : null;
        });
        return res;
    }
}
