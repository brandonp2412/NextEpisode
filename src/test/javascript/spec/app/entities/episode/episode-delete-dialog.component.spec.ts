/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { NextEpisodeTestModule } from '../../../test.module';
import { EpisodeDeleteDialogComponent } from 'app/entities/episode/episode-delete-dialog.component';
import { EpisodeService } from 'app/entities/episode/episode.service';

describe('Component Tests', () => {
    describe('Episode Management Delete Component', () => {
        let comp: EpisodeDeleteDialogComponent;
        let fixture: ComponentFixture<EpisodeDeleteDialogComponent>;
        let service: EpisodeService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NextEpisodeTestModule],
                declarations: [EpisodeDeleteDialogComponent]
            })
                .overrideTemplate(EpisodeDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(EpisodeDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EpisodeService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
