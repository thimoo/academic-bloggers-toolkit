/// <reference path="./ABT.d.ts"/>
import Dispatcher from './utils/Dispatcher.ts';

declare var tinyMCE, ABT_locationInfo


tinyMCE.PluginManager.add('abt_main_menu', (editor, url: string) => {

  //==================================================
  //                 MAIN BUTTON
  //==================================================

  let ABT_Button: TinyMCEPluginButton = {
    type: 'menubutton',
    image: url + '/../images/book.png',
    title: 'Academic Blogger\'s Toolkit',
    icon: true,
    menu: [],
  };

  //==================================================
  //               BUTTON FUNCTIONS
  //==================================================

  let openInlineCitationWindow = () => {
    editor.windowManager.open(<TinyMCEWindowMangerObject>{
      title: 'Inline Citation',
      url: ABT_locationInfo.tinymceViewsURL + 'inline-citation/inline-citation.html',
      width: 400,
      height: 85,
      onClose: (e) => {
        if (!e.target.params.data) { return; }
        editor.insertContent(
          '[cite num=&quot;' + e.target.params.data + '&quot;]'
        );
      }
    });
  }

  let openFormattedReferenceWindow = () => {
    editor.windowManager.open(<TinyMCEWindowMangerObject>{
      title: 'Insert Formatted Reference',
      url: ABT_locationInfo.tinymceViewsURL + 'formatted-reference/formatted-reference.html',
      width: 600,
      height: 100,
      params: {
        baseUrl: ABT_locationInfo.tinymceViewsURL,
      },
      onclose: (e: any) => {

        // If the user presses the exit button, return.
        if (Object.keys(e.target.params).length === 0) {
          return;
        }
        editor.setProgressState(1);
        let payload: ReferenceFormData = e.target.params.data;
        let refparser = new Dispatcher(payload, editor);

        if (payload.hasOwnProperty('manual-type-selection')) {
          refparser.fromManualInput(payload);
          editor.setProgressState(0);
          return;
        }

        // do pmid parsing
        refparser.fromPMID();

      },
    });
  };

  let generateSmartBib = function() {
    let dom: HTMLDocument = editor.dom.doc;
    let existingSmartBib: HTMLOListElement = <HTMLOListElement>dom.getElementById('abt-smart-bib');

    if (!existingSmartBib) {
      let smartBib: HTMLOListElement = <HTMLOListElement>dom.createElement('OL');
      let horizontalRule: HTMLHRElement = <HTMLHRElement>dom.createElement('HR');
      smartBib.id = 'abt-smart-bib';
      horizontalRule.className = 'abt_editor-only';
      let comment = dom.createComment(`Smart Bibliography Generated By Academic Blogger's Toolkit`);
      dom.body.appendChild(comment);
      dom.body.appendChild(horizontalRule);
      dom.body.appendChild(smartBib);
      this.state.set('disabled', true);
    }

    return;
  }




  //==================================================
  //                 MENU ITEMS
  //==================================================

  let separator: TinyMCEMenuItem = { text: '-' };


  let bibToolsMenu: TinyMCEMenuItem = {
    text: 'Other Tools',
    menu: [],
  };


  let inlineCitation: TinyMCEMenuItem = {
    text: 'Inline Citation',
    onclick: openInlineCitationWindow,
  }
  editor.addShortcut('meta+alt+c', 'Insert Inline Citation', openInlineCitationWindow);


  let formattedReference: TinyMCEMenuItem = {
    text: 'Formatted Reference',
    onclick: openFormattedReferenceWindow,
  }
  editor.addShortcut('meta+alt+r', 'Insert Formatted Reference', openFormattedReferenceWindow);


  let smartBib: TinyMCEMenuItem = {
    text: 'Generate Smart Bibliography',
    id: 'smartbib',
    onclick: generateSmartBib,
    disabled: false,
  }


  let trackedLink: TinyMCEMenuItem = {
    text: 'Tracked Link',
    onclick: () => {

      let user_selection = tinyMCE.activeEditor.selection.getContent({format: 'text'});

      /** TODO: Fix this so it doesn't suck */
      editor.windowManager.open({
        title: 'Insert Tracked Link',
        width: 600,
        height: 160,
        buttons: [{
          text: 'Insert',
          onclick: 'submit'
        }],
        body: [
          {
            type: 'textbox',
            name: 'tracked_url',
            label: 'URL',
            value: ''
          },
          {
            type: 'textbox',
            name: 'tracked_title',
            label: 'Link Text',
            value: user_selection
          },
          {
            type: 'textbox',
            name: 'tracked_tag',
            label: 'Custom Tag ID',
            tooltip: 'Don\'t forget to create matching tag in Google Tag Manager!',
            value: ''
          },
          {
            type: 'checkbox',
            name: 'tracked_new_window',
            label: 'Open link in a new window/tab'
          },
        ],
        onsubmit: (e) => {
          let trackedUrl = e.data.tracked_url;
          let trackedTitle = e.data.tracked_title;
          let trackedTag = e.data.tracked_tag;
          let trackedLink = `<a href="${trackedUrl}" id="${trackedTag}" ` +
            `${e.data.tracked_new_window ? 'target="_blank"' : ''}>${trackedTitle}</a>`;

          editor.execCommand('mceInsertContent', false, trackedLink);

        }
      });
    }
  }
  // End Tracked Link Menu Item

  let requestTools: TinyMCEMenuItem = {
    text: 'Request More Tools',
    onclick: () => {
      editor.windowManager.open({
        title: 'Request More Tools',
        body: [{
          type: 'container',
          html:
            `<div style="text-align: center;">` +
              `Have a feature or tool in mind that isn't available?<br>` +
              `<a ` +
              `href="https://github.com/dsifford/academic-bloggers-toolkit/issues" ` +
              `style="color: #00a0d2;" ` +
              `target="_blank">Open an issue</a> on the GitHub repository and let me know!` +
            `</div>`,
        }],
        buttons: [],
      });
    }
  }

  setTimeout(() => {
    let dom: HTMLDocument = editor.dom.doc;
    let existingSmartBib: HTMLOListElement = <HTMLOListElement>dom.getElementById('abt-smart-bib');
    if (existingSmartBib) {
      smartBib.disabled = true;
      smartBib.text = 'Smart Bibliography Generated!';
    }
  }, 500);

  bibToolsMenu.menu.push(trackedLink, separator, requestTools);
  ABT_Button.menu.push(smartBib, inlineCitation, formattedReference, bibToolsMenu);

  editor.addButton('abt_main_menu', ABT_Button);



});
