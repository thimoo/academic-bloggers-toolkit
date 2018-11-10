interface WP_info {
    abt_url: string;
    home_url: string;
    plugins_url: string;
    wp_upload_dir: {
        /* /folder-of-wp-installation/wp-content/uploads */
        basedir: string;
        /* http(s)://siteurl.com/wp-content/uploads */
        baseurl: string;
        error: boolean;
        /* /folder-of-wp-installation/wp-content/uploads/2016/08 */
        path: string;
        /* /2016/08 */
        subdir: string;
        /* http(s)://siteurl.com/wp-content/uploads/2016/08 */
        url: string;
    };
    info: {
        site: {
            language: string;
            name: string;
            plugins: string[];
            theme: string;
            url: string;
        };
        versions: {
            abt: string;
            php: string;
            wordpress: string;
        };
    };
}

interface IRollbar {
    log(msg: string, e?: any): void;
    debug(msg: string, e?: any): void;
    info(msg: string, e?: any): void;
    warning(msg: string, e?: any): void;
    error(msg: string, e?: any): void;
    critical(msg: string, e?: any): void;
}

declare const DocumentTouch: any;
declare const Rollbar: IRollbar;

interface Window {
    _babelPolyfill: boolean;
    ABT: ABT.Globals;
    DocumentTouch?: any;
    Rollbar: IRollbar;
    ajaxurl: string;
    tinyMCE: TinyMCE.MCE;
}
