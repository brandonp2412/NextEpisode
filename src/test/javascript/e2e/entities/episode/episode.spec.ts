/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { EpisodeComponentsPage, EpisodeDeleteDialog, EpisodeUpdatePage } from './episode.page-object';

const expect = chai.expect;

describe('Episode e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let episodeUpdatePage: EpisodeUpdatePage;
    let episodeComponentsPage: EpisodeComponentsPage;
    let episodeDeleteDialog: EpisodeDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Episodes', async () => {
        await navBarPage.goToEntity('episode');
        episodeComponentsPage = new EpisodeComponentsPage();
        expect(await episodeComponentsPage.getTitle()).to.eq('Episodes');
    });

    it('should load create Episode page', async () => {
        await episodeComponentsPage.clickOnCreateButton();
        episodeUpdatePage = new EpisodeUpdatePage();
        expect(await episodeUpdatePage.getPageTitle()).to.eq('Create or edit a Episode');
        await episodeUpdatePage.cancel();
    });

    it('should create and save Episodes', async () => {
        const nbButtonsBeforeCreate = await episodeComponentsPage.countDeleteButtons();

        await episodeComponentsPage.clickOnCreateButton();
        await episodeUpdatePage.setNumberInput('5');
        expect(await episodeUpdatePage.getNumberInput()).to.eq('5');
        await episodeUpdatePage.setSeasonInput('5');
        expect(await episodeUpdatePage.getSeasonInput()).to.eq('5');
        await episodeUpdatePage.setReleaseDateInput('2000-12-31');
        expect(await episodeUpdatePage.getReleaseDateInput()).to.eq('2000-12-31');
        await episodeUpdatePage.save();
        expect(await episodeUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await episodeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Episode', async () => {
        const nbButtonsBeforeDelete = await episodeComponentsPage.countDeleteButtons();
        await episodeComponentsPage.clickOnLastDeleteButton();

        episodeDeleteDialog = new EpisodeDeleteDialog();
        expect(await episodeDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Episode?');
        await episodeDeleteDialog.clickOnConfirmButton();

        expect(await episodeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
