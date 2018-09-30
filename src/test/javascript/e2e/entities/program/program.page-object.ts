import { element, by, ElementFinder } from 'protractor';

export class ProgramComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-program div table .btn-danger'));
    title = element.all(by.css('jhi-program div h2#page-heading span')).first();

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

export class ProgramUpdatePage {
    pageTitle = element(by.id('jhi-program-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    nameInput = element(by.id('field_name'));
    imageInput = element(by.id('file_image'));
    episodeNumberInput = element(by.id('field_episodeNumber'));
    episodeSeasonInput = element(by.id('field_episodeSeason'));
    episodeDateInput = element(by.id('field_episodeDate'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
    }

    async setImageInput(image) {
        await this.imageInput.sendKeys(image);
    }

    async getImageInput() {
        return this.imageInput.getAttribute('value');
    }

    async setEpisodeNumberInput(episodeNumber) {
        await this.episodeNumberInput.sendKeys(episodeNumber);
    }

    async getEpisodeNumberInput() {
        return this.episodeNumberInput.getAttribute('value');
    }

    async setEpisodeSeasonInput(episodeSeason) {
        await this.episodeSeasonInput.sendKeys(episodeSeason);
    }

    async getEpisodeSeasonInput() {
        return this.episodeSeasonInput.getAttribute('value');
    }

    async setEpisodeDateInput(episodeDate) {
        await this.episodeDateInput.sendKeys(episodeDate);
    }

    async getEpisodeDateInput() {
        return this.episodeDateInput.getAttribute('value');
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

export class ProgramDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-program-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-program'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
