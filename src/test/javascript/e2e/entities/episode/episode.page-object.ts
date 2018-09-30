import { element, by, ElementFinder } from 'protractor';

export class EpisodeComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-episode div table .btn-danger'));
    title = element.all(by.css('jhi-episode div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getText();
    }
}

export class EpisodeUpdatePage {
    pageTitle = element(by.id('jhi-episode-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    numberInput = element(by.id('field_number'));
    seasonInput = element(by.id('field_season'));
    releaseDateInput = element(by.id('field_releaseDate'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setNumberInput(number) {
        await this.numberInput.sendKeys(number);
    }

    async getNumberInput() {
        return this.numberInput.getAttribute('value');
    }

    async setSeasonInput(season) {
        await this.seasonInput.sendKeys(season);
    }

    async getSeasonInput() {
        return this.seasonInput.getAttribute('value');
    }

    async setReleaseDateInput(releaseDate) {
        await this.releaseDateInput.sendKeys(releaseDate);
    }

    async getReleaseDateInput() {
        return this.releaseDateInput.getAttribute('value');
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class EpisodeDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-episode-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-episode'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
