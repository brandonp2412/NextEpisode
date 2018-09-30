/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { NextEpisodeTestModule } from '../../../test.module';
import { ProgramComponent } from 'app/entities/program/program.component';
import { ProgramService } from 'app/entities/program/program.service';
import { Program } from 'app/shared/model/program.model';

describe('Component Tests', () => {
    describe('Program Management Component', () => {
        let comp: ProgramComponent;
        let fixture: ComponentFixture<ProgramComponent>;
        let service: ProgramService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NextEpisodeTestModule],
                declarations: [ProgramComponent],
                providers: []
            })
                .overrideTemplate(ProgramComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProgramComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProgramService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Program(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.programs[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
