import Editor from 'utils/editor';

export interface EditorDriverConstructor {
    new (): EditorDriver;
}

/**
 * Base class from which all editor drivers must be derived
 */
export default abstract class EditorDriver extends Editor {
    /** Retrieve an array of every HTMLElement ID for all citations currently existing in the editor. */
    abstract get citationIds(): string[];

    /**
     * Retrieve a `Citeproc.CitationByIndex` object describing the order and
     * contents of all citations existing in the document.
     */
    abstract get citationsByIndex(): Citeproc.CitationByIndex;

    /**
     * Returns a `Citeproc.RelativeCitationPositions` describing citations
     * located before and after the current cursor location.
     */
    abstract get relativeCitationPositions(): Citeproc.RelativeCitationPositions;

    /** Retrive the currently selected content in the editor as a raw HTML string. */
    abstract get selection(): string;

    /**
     * If the editor has some form of alert or notifications system, override
     * this so the native notifications are used.
     * @param message Message to be alerted to the user.
     */
    alert(message: string): void {
        window.alert(message);
    }

    /**
     * Responsible for taking the data generated by the citation processor and
     * composing the citations in the editor.
     * @param clusters Array of `Citeproc.CitationCluster`
     * @param citationByIndex Array of `Citeproc.Citation` ordered by position in document
     * @param kind One of `note` or `in-text`
     */
    abstract composeCitations(
        clusters: Citeproc.CitationCluster[],
        citationByIndex: Citeproc.CitationByIndex,
        kind: Citeproc.CitationKind,
    ): void;

    /**
     * Called when the window is loaded. Should resolve when the editor is
     * available and ready.
     */
    abstract async init(): Promise<void>;

    /**
     * Responsible for finding and removing elements from the editor that have
     * the given HTML Element IDs.
     * @param idList Array of HTML element IDs to remove from the document
     */
    abstract removeItems(idList: string[]): void;

    /**
     * Find and remove all citations, footnotes, and bibliographies. Static
     * bibliographies should be maintained.
     */
    abstract reset(): void;

    /**
     * Receives a bibliography array and options as input and composes and
     * inserts a bibliography in the editor.
     * @param options Object containing the user's bibliography options
     * @param bibliography Either an array of ABT.Bibliograhy or `false` if the
     * user's current citation style does not support bibliographies
     * @param staticBib Is the bibliography a static biblography? (This should
     * default to false)
     */
    abstract setBibliography(
        options: ABT.BibOptions,
        bibliography: ABT.Bibliography | boolean,
        staticBib?: boolean,
    ): void;

    /**
     * If the editor supports a 'loading' state which shows a spinner or some
     * progress indicator, this should be implemented.
     *   - If `true` is passed as an arg, the editor's state should be loading.
     *   - If `false` is passed as an arg, the editor's state should be not loading.
     *   - If no args are passed, the editor's loading state should be toggled to
     *   the opposite of what it currently is.
     * @param _loading Optional argument to explicitly set the loading state
     */
    setLoadingState(_loading?: boolean): void {
        return;
    }

    /**
     * Should be used for binding all `EditorEvents` to the appropriate
     * handlers for the editor. Must be called internally (ideally should be
     * done directly before promise resolution in the `init()` method).
     * @emits Editor.EditorEvents
     */
    protected abstract bindEvents(): void;
}
