import BasePageObject from './BasePageObject';

const PASSWORD_BUTTON_TEST_ID = 'lobby.enterPasswordButton';

/**
 * Page object for the PreMeeting screen, common stuff between pre-join and lobby screens.
 */
export default abstract class PreMeetingScreen extends BasePageObject {
    /**
     * Waits for pre join or lobby screen to load.
     */
    abstract waitForLoading(): Promise<void>;

    /**
     * Returns the display name input element.
     */
    abstract getDisplayNameInput(): WebdriverIO.Element;

    /**
     * Returns the join button element.
     */
    abstract getJoinButton(): WebdriverIO.Element;

    /**
     * Interacts with the view to enter a display name.
     */
    async enterDisplayName(displayName: string) {
        console.log("inside enterDisplayName function");
        const displayNameInput = this.getDisplayNameInput();

        await displayNameInput.click();

        // element.clear does not always work, make sure we delete the content
        await displayNameInput.clearValue();

        await this.participant.driver.keys(displayName);
    }

    /**
     * Checks internally whether lobby room is joined.
     *
     * @returns {Promise<boolean>}
     */
    waitToJoinLobby(): Promise<boolean> {
        console.log("inside waitToJoinLobby function");
        return this.participant.driver.waitUntil(
            () => this.isLobbyRoomJoined(),
            {
                timeout: 15_000, // 15 seconds
                timeoutMsg: `Timeout waiting to join lobby for ${this.participant.name}`
            }
        );
    }

    /**
     * Checks internally whether lobby room is joined.
     */
    isLobbyRoomJoined() {
        console.log("inside isLobbyRoomJoined function");
        return this.participant.execute(
            () => APP?.conference?._room?.room?.getLobby()?.lobbyRoom?.joined === true);
    }

    /**
     * Returns the password button element.
     */
    getPasswordButton() {
        return this.participant.driver.$(`[data-testid="${PASSWORD_BUTTON_TEST_ID}"]`);
    }

    /**
     * Interacts with the view to enter a password.
     */
    async enterPassword(password: string) {
        console.log("inside enterPassword function");
        const passwordButton = this.getPasswordButton();

        await passwordButton.moveTo();
        await passwordButton.click();

        const passwordInput = this.participant.driver.$('[data-testid="lobby.password"]');

        await passwordInput.waitForDisplayed();
        await passwordInput.click();
        await passwordInput.clearValue();

        await this.participant.driver.keys(password);

        const joinButton = this.participant.driver.$('[data-testid="lobby.passwordJoinButton"]');

        await joinButton.waitForDisplayed();
        await joinButton.click();
    }
}
