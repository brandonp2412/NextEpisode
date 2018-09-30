import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
        return this.http.post<IProgram>(this.resourceUrl, program, { observe: 'response' });
    }

    update(program: IProgram): Observable<EntityResponseType> {
        return this.http.put<IProgram>(this.resourceUrl, program, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProgram>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProgram[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProgram[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
