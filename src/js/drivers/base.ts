export interface BibOptions {
    /** Heading options */
    heading: string;
    /** HTML Heading element preferred for heading */
    headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /** Should the heading be toggleable? */
    style: 'fixed' | 'toggle';
}

export interface RelativeCitationPositions {
    /** The zero-based index of the HTMLSpanElement being inserted */
    currentIndex: number;
    /** Enum describing the citations located before [0] and after [1] the cursor */
    locations: [Citeproc.CitationsPrePost, Citeproc.CitationsPrePost];
}

enum EditorEvents {
    /**
     * Emit this any time the editor becomes available again after being
     * unavailable (excluding the initial initialization).
     */
    AVAILABLE = 'EDITOR_AVAILABLE',
    /**
     * Emit this any time the editor goes unavailable or becomes hidden.
     */
    UNAVAILABLE = 'EDITOR_UNAVAILABLE',
}

/**
 * Base class from which all editor drivers must be derived
 */
export default abstract class EditorDriver {
    public static readonly events = EditorEvents;

    protected readonly citationClass = 'abt-citation';
    protected readonly bibliographyId = 'abt-bibliography';
    protected readonly staticBibClass = 'abt-static-bib';
    protected readonly footnoteId = 'abt-footnote';
    protected readonly brokenPrefix = top.ABT_i18n.errors.broken;

    /** Retrieve an array of every citationId currently existing in the editor. */
    public abstract get citationIds(): string[];

    /** Retrive the currently selected content in the editor as a raw HTML string. */
    public abstract get selection(): string;

    /**
     * Called when the window is loaded. Should resolve when the editor is
     * available and ready.
     */
    public abstract init(): Promise<{}>;

    /**
     * Responsible for taking the data generated by the citation processor and
     * composing the citations in the editor.
     * @param clusters Array of `Citeproc.CitationCluster`
     * @param citationByIndex Array of `Citeproc.Citation` ordered by position in document
     * @param kind One of `note` or `in-text`
     */
    public abstract composeCitations(
        clusters: Citeproc.CitationCluster[],
        citationByIndex: Citeproc.CitationByIndex,
        kind: Citeproc.CitationKind
    ): void;

    /**
     * Receives a bibliography array and options as input and composes and
     * inserts a bibliography in the editor.
     * @param options Object containing the user's bibliography options
     * @param bibliography Either an array of ABT.Bibliograhy or `false` if the
     * user's current citation style does not support bibliographies
     * @param staticBib Is the bibliography a static biblography? (This should
     * default to false)
     */
    public abstract setBibliography(
        options: BibOptions,
        bibliography: ABT.Bibliography | boolean,
        staticBib?: boolean
    ): void;

    /**
     * Find and remove all citations, footnotes, and bibliographies. Static
     * bibliographies should be maintained.
     */
    public abstract reset(): void;

    /**
     * Returns an enum of `Citeproc.CitationsPrePost` describing citations
     * located before and after the current cursor location.
     * @param validIds Array of valid citation IDs that the processor is
     * currently aware of. (necessary for instances where the user deletes a
     * citation without "refreshing" the document)
     */
    public abstract getRelativeCitationPositions(validIds: string[]): RelativeCitationPositions;

    /**
     * Responsible for finding and removing elements from the editor that have
     * the given HTML Element IDs.
     * @param idList Array of HTML element IDs to remove from the document
     */
    public abstract removeItems(idList: string[]): void;

    /**
     * If the editor supports a 'loading' state which shows a spinner or some
     * progress indicator, this should be implemented.
     *   - If `true` is passed as an arg, the editor's state should be loading.
     *   - If `false` is passed as an arg, the editor's state should be not loading.
     *   - If no args are passed, the editor's loading state should be toggled to
     *   the opposite of what it currently is.
     * @param _loading Optional argument to explicitly set the loading state
     */
    public setLoadingState(_loading?: boolean): void {
        return;
    }

    /**
     * If the editor has some form of alert or notifications system, override
     * this so the native notifications are used.
     * @param message Message to be alerted to the user.
     */
    public alert(message: string): void {
        window.alert(message);
    }

    /**
     * Should be used for binding all `EditorEvents` to the appropriate
     * handlers for the editor. Must be called internally (ideally should be
     * done directly before promise resolution in the `init()` method).
     * @emits EditorEvents
     */
    protected abstract bindEvents(): void;
}