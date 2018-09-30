/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { NextEpisodeTestModule } from '../../../test.module';
import { NextEpisodeUpdateComponent } from 'app/entities/next-episode/next-episode-update.component';
import { NextEpisodeService } from 'app/entities/next-episode/next-episode.service';
import { NextEpisode } from 'app/shared/model/next-episode.model';

describe('Component Tests', () => {
    describe('NextEpisode Management Update Component', () => {
        let comp: NextEpisodeUpdateComponent;
        let fixture: ComponentFixture<NextEpisodeUpdateComponent>;
        let service: NextEpisodeService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NextEpisodeTestModule],
                declarations: [NextEpisodeUpdateComponent]
            })
                .overrideTemplate(NextEpisodeUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(NextEpisodeUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(NextEpisodeService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new NextEpisode(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.nextEpisode = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new NextEpisode();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.nextEpisode = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
