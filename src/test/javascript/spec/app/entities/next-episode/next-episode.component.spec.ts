/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { NextEpisodeTestModule } from '../../../test.module';
import { NextEpisodeComponent } from 'app/entities/next-episode/next-episode.component';
import { NextEpisodeService } from 'app/entities/next-episode/next-episode.service';
import { NextEpisode } from 'app/shared/model/next-episode.model';

describe('Component Tests', () => {
    describe('NextEpisode Management Component', () => {
        let comp: NextEpisodeComponent;
        let fixture: ComponentFixture<NextEpisodeComponent>;
        let service: NextEpisodeService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NextEpisodeTestModule],
                declarations: [NextEpisodeComponent],
                providers: []
            })
                .overrideTemplate(NextEpisodeComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(NextEpisodeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(NextEpisodeService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new NextEpisode(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.nextEpisodes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
