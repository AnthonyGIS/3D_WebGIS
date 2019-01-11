require([
  "dojo/query",
  "dojo/on",
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/_base/connect",
  "dojo/has",
  "dojo/_base/event",
  "dojo/dom-style",
  "esri/domUtils",
  "esri/config",
  "esri/urlUtils",
  "esri/request",
  "sandbox-libs/beautify-html",
  "dojo/domReady!"
], function ($, on, dom, domConstruct, connect, has, event, domStyle, domUtils, esriConfig, urlUtils, esriRequest, beautify){

  // declare shared variables
  var editor, platform, sampleFolder, sandboxIsLoaded;
  var editorFontSize, editorDefaultFontSize = 14.11, editorFontLineHeightBreakpoint = 18;

  // cache DOM elements
  var $handle, $save, $toggleHTML, $toggleOutput, $update, $wrapper, $output, $code, $jsbin, $description;

  var keyboardShortcutsDict = {
        mac: [
          {command: "<code>Cmd</code> + <code>Enter</code>", description: "Refresh Output"},
          {command: "<code>Cmd</code> + <code>/</code>", description: "Comment lines / Uncomment lines"},
          {command: "<code>Cmd</code> + <code>1</code>", description: "Toggle HTML"},
          {command: "<code>Cmd</code> + <code>2</code>", description: "Toggle Output"},
          {command: "<code>Cmd</code> + <code>Shift</code> + <code>L</code>", description: "Beautify sandbox code"},
          {command: "<code>Cmd</code> + <code>K</code>", description: "Toggle vim, <code>:w</code> Refresh Output"},
          {command: "<code>Cmd</code> + <code>Shift</code> + <code>></code>", description: "Increase sandbox code font size"},
          {command: "<code>Cmd</code> + <code>Shift</code> + <code><</code>", description: "Decrease sandbox code font size"},
          {command: "<code>Cmd</code> + <code>0</code>", description: "Reset sandbox code font size"}
        ],
        win: [
          {command: "<code>Ctrl</code> + <code>Enter</code>", description: "Refresh Output"},
          {command: "<code>Ctrl</code> + <code>/</code>", description: "Comment lines / Uncomment lines"},
          {command: "<code>Ctrl</code> + <code>1</code>", description: "Toggle HTML"},
          {command: "<code>Ctrl</code> + <code>2</code>", description: "Toggle Output"},
          {command: "<code>Ctrl</code> + <code>Shift</code> + <code>L</code>", description: "Beautify sandbox code"},
          {command: "<code>Ctrl</code> + <code>K</code>", description: "Toggle vim, <code>:w</code> Refresh Output"},
          {command: "<code>Ctrl</code> + <code>Shift</code> + <code>></code>", description: "Increase sandbox code font size"},
          {command: "<code>Ctrl</code> + <code>Shift</code> + <code><</code>", description: "Decrease sandbox code font size"},
          {command: "<code>Ctrl</code> + <code>0</code>", description: "Reset sandbox code font size"}
        ]
      },
      keyboardShortcutArray,
      keyboardRandomShortcutIndex,
      $btnSandboxKeyboardShortcuts,
      $containerSandboxKeyboardShortcut,
      $containerSandboxKeyboardShortcutModal,
      $containerSandboxKeyboardShortcutModalContent,
      $btnSandboxKeyboardShortcutModalClose;

  // set to true to use log() for debugging
  var DEBUG = false;

  // add sample server address to esri config
  esriConfig.defaults.io.corsEnabledServers.push("https://developers.arcgis.com/javascript");

  // run all the things
  setSampleFolder();
  startEditor();
  bindEventHandlers();
  getSampleCode();
  initializeSandboxKeyboardShortcutDisplay();

  // get sample folder from querystring
  function setSampleFolder(){
    log("setSampleFolder");

    var urlObject = urlUtils.urlToObject(document.location.href);

    urlObject.query = urlObject.query || {};

    if (urlObject.query && urlObject.query.sample) {
      sampleFolder = urlObject.query.sample;
    }
    else {
      sampleFolder = "map_simple"; // default
    }
  }

  /**
   * Determines which keyboard data dictionary to use based upon the
   * data-platform (mac or windows) value injected from the script block
   * in sample-code/sandbox/index.html. Randomly displays a keyboard
   * shortcut upon initialization.
   */
  function initializeSandboxKeyboardShortcutDisplay(){
    platform = document.documentElement.getAttribute("data-platform");
    if (/mac/i.test(platform)) {
      keyboardShortcutArray = keyboardShortcutsDict.mac;
    }
    else {
      keyboardShortcutArray = keyboardShortcutsDict.win;
    }

    keyboardRandomShortcutIndex = getRandomIntInclusive(0, keyboardShortcutArray.length - 1);
    var keyboardShortcut = keyboardShortcutArray[keyboardRandomShortcutIndex];
    $containerSandboxKeyboardShortcut[0].innerHTML = "<span class=\"command\">" + keyboardShortcut.command + "</span><span class=\"action\">" + keyboardShortcut.description + "</span>";
  }

  // initialize ace editor
  function startEditor(){
    log("startEditor");

    ace.config.set("workerPath", "js");
    editor = ace.edit("editor");
    editor.$blockScrolling = Infinity;
    editor.setPrintMarginColumn(0);
    editor.setTheme("ace/theme/github");
    editor.getSession().setTabSize(2);
    editor.getSession().setUseSoftTabs(true);
    editor.getSession().setMode("ace/mode/html");
    editor.setOption("wrap", true);

    // --------------------------------------------------------------------
    // Setup logic for changing the font size of the code editor window
    // which is especially useful for presentation purposes.
    // --------------------------------------------------------------------
    editorFontSize = editorDefaultFontSize;

    if (localStorage) {
      if (!localStorage.sandboxFontSize) {
        localStorage.sandboxFontSize = editorFontSize;
      }
      else if (localStorage.sandboxFontSize) {
        editorFontSize = parseInt(localStorage.sandboxFontSize);
        editor.setFontSize(editorFontSize);
      }
    }

    // --------------------------------------------------------------------
    // Keyboard bindings for toggling between normal keyboard navigation
    // and vim keyboard mode.
    // --------------------------------------------------------------------
    var keybindings = {
      current: "ace",
      ace: null, // Null = use "default" keymapping
      vim: undefined // set after loading the vim module
    };
    // --------------------------------------------------------------------
    // Load the keybinding-vim module, define the vim write command to call
    // the sandboxSaveCommand.
    // --------------------------------------------------------------------
    ace.config.loadModule("ace/keyboard/vim", function (vimModule){
      keybindings.vim = vimModule.handler;
      var vimApi = vimModule.CodeMirror.Vim;
      // --------------------------------------------------------------------
      // Define the extensions to implement the write command in vim mode.
      // --------------------------------------------------------------------
      vimApi.defineEx("write", "w", function (cm, input){
        cm.ace.execCommand("sandboxSaveCommand");
      });
    });

    // --------------------------------------------------------------------
    // Add commands for saving and refreshing the sandbox output
    // --------------------------------------------------------------------
    editor.commands.addCommand({
      name: "sandboxSaveCommand",
      bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
      exec: function (editor){
        updateSandbox();
      }
    });

    // --------------------------------------------------------------------
    // Add command to toggle between vim keyboard input and normal
    // keyboard (default) input
    // --------------------------------------------------------------------
    editor.commands.addCommand({
      name: "sandboxKeybindingCommand",
      bindKey: {win: "Ctrl-K", mac: "Command-K"},
      exec: function (editor){
        if (keybindings.current === "ace") {
          editor.setKeyboardHandler(keybindings.vim);
          keybindings.current = "vim";
        }
        else {
          editor.setKeyboardHandler(keybindings.ace);
          keybindings.current = "ace";
        }
      }
    });
    // --------------------------------------------------------------------
    // Add command to toggle comments.
    // Given the currently selected range, this function either comments
    // all the lines, or uncomments all of them.
    // --------------------------------------------------------------------
    editor.commands.addCommand({
      name: "sandboxCommentLinesCommand",
      bindKey: {win: "Ctrl-/", mac: "Command-/"},
      exec: function (editor){
        editor.toggleCommentLines();
      }
    });
    // --------------------------------------------------------------------
    // Add command to beautify the sandbox code.
    // --------------------------------------------------------------------
    editor.commands.addCommand({
      name: "sandboxBeautifyCommand",
      bindKey: {win: "Ctrl-Shift-L", mac: "Command-Shift-L"},
      exec: function (editor){
        beautifySandboxCode();
      }
    });
    // --------------------------------------------------------------------
    // Add command to toggle HTML panel.
    // --------------------------------------------------------------------
    editor.commands.addCommand({
      name: "sandboxToogleHTMLCommand",
      bindKey: {win: "Ctrl-1", mac: "Command-1"},
      exec: function (editor){
        toggleHTML();
      }
    });
    // --------------------------------------------------------------------
    // Add command to toggle Output panel.
    // --------------------------------------------------------------------
    editor.commands.addCommand({
      name: "sandboxToogleOutputCommand",
      bindKey: {win: "Ctrl-2", mac: "Command-2"},
      exec: function (editor){
        toggleOutput();
      }
    });
    // --------------------------------------------------------------------
    // Add command to increase editor font size
    // --------------------------------------------------------------------
    editor.commands.addCommand({
      name: "sandboxIncreaseFontCommand",
      bindKey: {win: "Ctrl-Shift-.", mac: "Command-Shift-."},
      exec: function (editor){
        "use strict";
        editorFontSize++;
        editor.setFontSize(editorFontSize);
        localStorage.sandboxFontSize = editorFontSize;

        if (editorFontSize > editorFontLineHeightBreakpoint) {
          if (document.getElementById("editor").style.lineHeight === "") {
            document.getElementById("editor").style.lineHeight = 1.4;
          }
        }
      }
    });
    // --------------------------------------------------------------------
    // Add command to decrease editor font size
    // --------------------------------------------------------------------
    editor.commands.addCommand({
      name: "sandboxDecreaseFontCommand",
      bindKey: {win: "Ctrl-Shift-,", mac: "Command-Shift-,"},
      exec: function (editor){
        "use strict";
        editorFontSize--;
        editor.setFontSize(editorFontSize);
        localStorage.sandboxFontSize = editorFontSize;

        if (editorFontSize < editorFontLineHeightBreakpoint) {
          if (document.getElementById("editor").style.lineHeight !== ""){
            document.getElementById("editor").style.lineHeight = "";
          }
        }
      }
    });
    // --------------------------------------------------------------------
    // Add command to reset editor font size
    // --------------------------------------------------------------------
    editor.commands.addCommand({
      name: "sandboxResetFontCommand",
      bindKey: {win: "Ctrl-0", mac: "Command-0"},
      exec: function (editor){
        "use strict";
        editor.setFontSize(editorDefaultFontSize);
        editorFontSize = editorDefaultFontSize;
        if (localStorage) {
          delete localStorage["sandboxFontSize"];
        }
        document.getElementById("editor").style.lineHeight = "";
        document.getElementById("editor").style.fontSize = "";
      }
    });
  }

  // bind events to DOM elements
  function bindEventHandlers(){
    log("bindEventHandlers");

    $code = $("#code");
    $handle = $("#handle");
    $output = $("#output");
    $save = $(".js-btn-save-file");
    $toggleHTML = $(".toggle-html");
    $toggleOutput = $(".toggle-output");
    $update = $(".js-btn-update-sandbox");
    $wrapper = $("#wrapper");
    $jsbin = $(".js-btn-jsbin");
    $description = $(".js-btn-description");

    $handle.on("mousedown", resizePanes);
    $save.on("click", saveFile);
    $toggleHTML.on("click", toggleHTML);
    $toggleOutput.on("click", toggleOutput);
    $update
      .attr("disabled", "disabled")
      .on("click", updateSandbox);
    $jsbin
      .on("click", openJSBin);
    $description
      .on("click", function (){
        document.location = "../jssamples/" + sampleFolder + ".html";
      });

    $btnSandboxKeyboardShortcuts = $(".js-btn-sandbox-keyboard-shortcuts");
    $btnSandboxKeyboardShortcuts.on("click", showSandboxKeyboardShortcut);

    $btnSandboxKeyboardShortcutModalClose = $(".js-sandbox-keyboard-shortcuts-modal-close");
    $btnSandboxKeyboardShortcutModalClose.on("click", function (){
      $containerSandboxKeyboardShortcutModal.style("display", "none");
    });

    $containerSandboxKeyboardShortcut = $(".js-sandbox-keyboard-shortcut-container");
    $containerSandboxKeyboardShortcutModal = $(".js-sandbox-keyboard-shortcuts-modal");
    $containerSandboxKeyboardShortcutModalContent = $(".js-sandbox-keyboard-shortcuts-modal-content tbody");

    on(window, "resize", resetPanes);
  }

  // get sample code then delegate to handleSample()
  function getSampleCode(){
    log("getSampleCode");

    // get code sample from docs
    esriRequest({
      // "url": "https://developers.arcgis.com/javascript/3/samples/" + sampleFolder + "/index.html",
      "url": "../samples/" + sampleFolder + "/index.html",
      "handleAs": "text"
    }).then(handleSample, handleError);

    // show page after loading is complete
    $wrapper.style("visibility", "visible");

    // dump sample code into editor then update sandbox
    function handleSample(str){
      log("handleSample");

      editor.getSession().setValue(str); // add the content
      updateSandbox(); // load the sample into an iframe
    }

    // logs error if esri.request from getSample() fails
    function handleError(err){
      if (console && console.log) { // check for console first
        console.log("error getting code sample: ", err);
      }
    }
  }

  // helper functions

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // open sandbox editor contents in JS Bin
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  /**
   * Event handler function to allow opening the contents of the
   * js-sandbox-editor text area content in the online editor JS Bin.
   */
  function openJSBin(){
    /**
     * Creates a unique guid string such as
     * "f8ba92b3-9d8a-0f71-58a2-d0f8ce0674d1"
     *
     * @return {string}
     */
    function guid(){
      function gen(count){
        var out = "";
        for (var i = 0; i < count; i++) {
          out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return out;
      }

      return [gen(2), gen(1), gen(1), gen(1), gen(3)].join("-");
    }

    log("openJSBin");
    // --------------------------------------------------------------------
    // Create a unique tab name every single time so JS Bin always gets a
    // new unique window.
    // --------------------------------------------------------------------
    var win = window.open("about:blank", guid());
    var jsBinContent = editor.getSession().getValue();
    // --------------------------------------------------------------------
    // Update the sample code before it is sent to JS Bin so that anyone
    // shares a bin, they will know the original source came from the
    // ArcGIS API for JavaScript sample code.
    // --------------------------------------------------------------------
    var source = updateSampleCodeTitleForJSBin(jsBinContent);
    // skip sending the javascript and css sources
    var sources = ["html"];
    var form = win.document.createElement("form");
    var input;
    form.setAttribute("target", "_self");
    form.setAttribute("method", "post");
    form.setAttribute("action", "https://jsbin.com?html,output");
    form.style.display = "none";
    for (var i = 0; i < sources.length; i++) {
      input = win.document.createElement("input");
      form.appendChild(input);
      input.type = "hidden";
      input.name = sources[i];
      input.value = encodeURIComponent(source);
    }
    win.document.body.appendChild(form);
    form.submit();
  }

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // JS Bin code disclaimer
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  /**
   * Updates the current code in the js-sandbox-editor text area to
   * include a disclamer referencing the original source of the sample
   * code. This step is necessary before populating the bin on JS Bin
   * so users can find the original sample after a bin has been shared
   * and most likely lost its original link back to the developers
   * website.
   *
   * @param sourceCode The original sandbox source code.
   * @return string The updated sandbox sample containing the disclaimer.
   */
  function updateSampleCodeTitleForJSBin(sourceCode){
    var disclamerTemplate = "<!-- \n  ArcGIS API for JavaScript, https://js.arcgis.com\n  For more information about the {{ sample_name }} sample, read the original sample description at developers.arcgis.com.\n  {{ sample_url }}  \n  -->\n  ";
    var updatedSource = sourceCode;
    var titleElementRegEx = /<title>[^<]*<\/title>/im;
    var titleElementRegExMatch = sourceCode.match(titleElementRegEx);
    var titleElement = titleElementRegExMatch ? titleElementRegExMatch[0] : "";
    var jsBinDescription = titleElement.replace(/<\/?title>/gim, "");
    if (titleElement && titleElement !== "") {
      var sampleNameMatch = sampleFolder.match(/[-\w]*(?=\/index\.html)/im);
      var sampleName = sampleNameMatch ? sampleNameMatch[0] : sampleFolder;
      var sourceURL = "https://developers.arcgis.com/javascript/3/" + sampleName + "/index.html";
      var titleDisclaimer = "";
      titleDisclaimer += "<meta name=\"description\" content=\"[" + jsBinDescription + "]\">\n  ";
      titleDisclaimer += disclamerTemplate.replace(/{{\ssample_name\s}}/, sampleName).replace(/{{\ssample_url\s}}/, sourceURL) + titleElement;
      updatedSource = sourceCode.replace(titleElementRegEx, titleDisclaimer);
    }
    return updatedSource;
  }

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // Beautify sandbox
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  /**
   * Format the sandbox source code through the provided keyboard
   * shortcut (Shift-Ctrl/Cmd-L) using JS Beautify.
   */
  function beautifySandboxCode(){
    // --------------------------------------------------------------------
    // HTML Beautify Options
    //
    // https://www.npmjs.com/package/js-beautify
    // https://github.com/beautify-web/js-beautify
    //
    // The options are:
    //    indent_inner_html (default false)  — indent <head> and <body> sections,
    //    indent_size (default 4)          — indentation size,
    //    indent_char (default space)      — character to indent with,
    //    wrap_line_length (default 250)            -  maximum amount of characters per line (0 = disable)
    //    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "none"
    //            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style),
    //            or just put end braces on own line, or attempt to keep them where they are.
    //    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
    //    indent_scripts (default normal)  - "keep"|"separate"|"normal"
    //    preserve_newlines (default true) - whether existing line breaks before elements should be preserved
    //                                        Only works before elements, not inside tags or for text.
    //    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk
    //    indent_handlebars (default false) - format and indent {{#foo}} and {{/foo}}
    //    end_with_newline (false)          - end with a newline
    //    extra_liners (default [head,body,/html]) -List of tags that should have an extra newline before them.
    // --------------------------------------------------------------------
    var sampleCodeHtmlBeautifyOptions = {
      brace_style: "none",
      end_with_newline: false,
      extra_liners: "",
      indent_size: 2,
      max_preserve_newlines: 2,
      preserve_newlines: true,
      wrap_line_length: 80
    };

    var unformattedCode = editor.getSession().getValue();
    var formattedCode = beautify.html_beautify(unformattedCode, sampleCodeHtmlBeautifyOptions);
    editor.getSession().setValue(formattedCode);
  }

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // Show the next keyboard shortcut
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  /**
   * Displays the keyboard shortcut and action for the current platform
   * in a modal window.
   */
  function showSandboxKeyboardShortcut(){

    // --------------------------------------------------------------------
    // Show the modal window if the display property is not block.
    // --------------------------------------------------------------------
    if ($containerSandboxKeyboardShortcutModal && $containerSandboxKeyboardShortcutModal.style("display")[0] !== "block") {
      var modalContent = "";
      keyboardShortcutArray.forEach(function (keyboardShortcut){
        modalContent += "<tr><td><span class=\"command\">" + keyboardShortcut.command + "</span></td><td><span class=\"action\">" + keyboardShortcut.description + "</span></td></tr>";
      });
      $containerSandboxKeyboardShortcutModalContent[0].innerHTML = modalContent;

      $containerSandboxKeyboardShortcutModal.style("display", "block");
      // --------------------------------------------------------------------
      // Display and position the modal dialog window for the shortcuts
      // --------------------------------------------------------------------
      resizeSandboxModalWindow();
    }
  }

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // Position the modal dialog window for the shortcuts
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  /**
   * Positions the modal dialog window for the keyboard shortcuts by
   * calculating the width and height of the modal window and comparing
   * that to the viewport width and height. The top and left pixel
   * location is determined by comparing the two widths and heights.
   */
  function resizeSandboxModalWindow(){
    var modalWidth = $containerSandboxKeyboardShortcutModal[0].clientWidth;
    var modalHeight = $containerSandboxKeyboardShortcutModal[0].clientHeight;
    var modalWindowTop = (document.body.clientHeight - modalHeight) / 2 + "px";
    var modalWindowLeft = (document.body.clientWidth - modalWidth) / 2 + "px";
    $containerSandboxKeyboardShortcutModal.style("top", modalWindowTop);
    $containerSandboxKeyboardShortcutModal.style("left", modalWindowLeft);
  }

  /**
   * Returns a random integer between min (included) and max (included)
   * for determining a random keyboard shortcut.
   *
   * @param min The miniumum value
   * @param max The maximum value
   * @return integer The random number between min and max inclusive.
   */
  function getRandomIntInclusive(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // get code from editor and run inside iframe
  function updateSandbox(){
    log("updateSandbox");

    $update.attr("disabled", "disabled");
    $save.attr("disabled", "disabled");
    $jsbin.attr("disabled", "disabled");

    domUtils.show($(".loader")[0]); // Show a loading/updating icon

    var iframeName = "sandbox";

    // destroy the iframe, if it exists
    if (dom.byId(iframeName)) {
      domConstruct.destroy(iframeName);
    }

    // disconnect previous iframe onload handler
    if (sandboxIsLoaded) {
      connect.disconnect(sandboxIsLoaded);
    }

    // create an iframe
    var iframe = domConstruct.create("iframe", {"id": iframeName}, "output");

    sandboxIsLoaded = on(iframe, "load", function (){
      domUtils.hide($(".loader")[0]); // Hide the loading icon

      $update.attr("disabled", false);
      $save.attr("disabled", false);
      $jsbin.attr("disabled", false);
    });

    log("sandboxIsLoaded");

    var idoc = (iframe.contentWindow) ?
      iframe.contentWindow : (iframe.contentDocument.document) ?
        iframe.contentDocument.document : iframe.contentDocument;

    var content = editor.getSession().getValue();

    var relLinks = content.match(/href=".+?"/g);
    if (relLinks) {
      relLinks = relLinks.filter(function (url){
        return url.indexOf("//") === -1;
      }); // ignore absolute URLs
      relLinks = relLinks.concat(content.match(/src=".+?"/g).filter(function (url){
        return url.indexOf("//") === -1;
      }));
      relLinks.forEach(function (href){
        var path = href.split('"')[1];
        content = content.replace(path, "../samples/" + sampleFolder + "/" + path);
      });
    }

    relLinks = content.match(/src='.+?'/g);
    if (relLinks) {
      relLinks = relLinks.filter(function (url){
        return url.indexOf("//") === -1;
      }); // ignore absolute URLs
      relLinks.forEach(function (href){
        var path = href.split("'")[1];
        content = content.replace(path, "../samples/" + sampleFolder + "/" + path);
      });
    }

    // fix for graphics_add
    //      "images/mangrove.png",
    relLinks = content.match(/images\/mangrove.png/g);
    if (relLinks) {
      relLinks.forEach(function (href){
        content = content.replace(href, "../samples/" + sampleFolder + "/" + href);
      });
    }

    // fix for syntax used in data_gas_prices and styling_svg_css_transitions
    //      url: "fallback-gas-price-data.json",
    //      url: "county_population.csv"
    relLinks = content.match(/url: ".+?"/g);
    if (relLinks) {
      relLinks = relLinks.filter(function (url){
        return url.indexOf("//") === -1;
      }); // ignore absolute URLs
      relLinks.forEach(function (href){
        var file = href.split('"')[1];
        content = content.replace(file, "../samples/" + sampleFolder + "/" + file);
      });
    }

    // fix for syntax used in fl_featureCollection
    //      "url": "images/flickr.png",
    relLinks = content.match(/"url": ".+?"/g);
    if (relLinks) {
      relLinks = relLinks.filter(function (url){
        return url.indexOf("//") === -1;
      }); // ignore absolute URLs
      relLinks.forEach(function (href){
        var file = href.split('"')[3]; // more "s than in fix above
        content = content.replace(file, "../samples/" + sampleFolder + "/" + file);
      });
    }

    // fix for syntax used in ed_undoRedo, graphics_undoRedo and gp_clipasync
    //      .undoIcon { background-image:url(images/undo.png); width:16px; height:16px; }
    // also fix for search_customized sample (space and quote)
    //      background-image: url("finding.png");
    relLinks = content.match(/background-image: *?url\("?.+?\.png/g);
    if (relLinks) {
      relLinks.forEach(function (href){
        var file = href.split('(')[1];
        if (file.startsWith('"') ) { // is there a leading quote?
          file = file.replace('"',''); // remove leading quote
        }
        content = content.replace(file, "../samples/" + sampleFolder + "/" + file);
      });
    }

    // fix for syntax used in smartmapping_bycolor sample
    //      imageUrl: "images/busy-indicator.gif",
    relLinks = content.match(/imageUrl: ".+?"/g);
    if (relLinks) {
      relLinks = relLinks.filter(function (url){
        return url.indexOf("//") === -1
      }); // ignore absolute URLs
      relLinks.forEach(function (href){
        var file = href.split('"')[1];
        content = content.replace(file, "../samples/" + sampleFolder + "/" + file);
      });
    }

    var jsLinks = content.match(/location.pathname.+\"/g);
    if (jsLinks) {
      jsLinks.forEach(function (href){
        content = content.replace(/""\)/, "\"/../samples/" + sampleFolder + "/\")");
        content = content.replace(/''\)/, "\'/../samples/" + sampleFolder + "/\')");
      });
    }

    if (has("ie")) {
      // http://sparecycles.wordpress.com/2012/03/08/inject-content-into-a-new-iframe/
      // this workaround was causing issues in Firefox - may be able to get it to
      // work cross-browser need to test more. But for now this "split" approach works.
      idoc.contents = content;
      iframe.src = "javascript:window[\"contents\"]";
    }
    else {
      idoc.document.open();
      idoc.document.write(content);
      idoc.document.close();
      // set the iframe"s src attribute
      // otherwise, no referrer is sent when making requests from the iframe
      // which breaks samples which use the /sproxy on developers.arcgis.com
      // TODO temporary fix (Chris), need to go back and check what this is doing
      //iframe.src = "../samples/" + sampleFolder + "/index.html";
    }
  }

  // save contents of editor to html file
  function saveFile(){
    log("saveFile");

    var builder = new BlobBuilder();
    builder.append(editor.getSession().getValue());

    var blob = builder.getBlob("text/plain;charset=" + document.characterSet);
    saveAs(blob, sampleFolder + ".html");
  }

  // toggle display of editor pane
  function toggleHTML(){
    $toggleHTML.toggleClass("btn-clear");
    $toggleHTML.toggleClass("icon-window-close");
    $toggleHTML.toggleClass("icon-window-lines");
    $wrapper.toggleClass("minimized-html");
    resetPanes();
    editor.resize(true);
  }

  // toggle display of editor pane
  function toggleOutput(){
    $toggleOutput.toggleClass("btn-clear");
    $toggleOutput.toggleClass("icon-window-close");
    $toggleOutput.toggleClass("icon-window-lines");
    $wrapper.toggleClass("minimized-output");
    resetPanes();
    editor.resize(true);
  }

  // resize content panes when handle is dragged
  function resizePanes(e){
    event.stop(e);
    $wrapper.addClass("resizing");
    var min = 50;
    var max = 70;
    var width = domStyle.get("wrapper", "width");

    var dragHandle = on(window, "mousemove", function (e){
      event.stop(e);
      if (e.pageX > min && (e.pageX + max) < width) {
        setHandlePosition(e.pageX + 8, width);
        editor.resize(true);
      }
    });

    on.once(parent.document, "mouseup", function (e){
      $wrapper.removeClass("resizing");
      connect.disconnect(dragHandle);
    });

    function setHandlePosition(pos, width){
      // vanilla JS is a *lot* faster than dojo :/
      $code[0].style.right = (width - pos) + "px";
      $output[0].style.left = pos + "px";
    }
  }

  function resetPanes(){
    $output.removeAttr("style");
    $code.removeAttr("style");
    // --------------------------------------------------------------------
    // re-position the modal dialog window for the shortcuts
    // --------------------------------------------------------------------
    resizeSandboxModalWindow();
  }

  // log function for debugging
  function log(str){
    if (DEBUG && console && console.log) { // check for console first
      console.log(Array.prototype.slice.call(arguments));
    }
  }
});
