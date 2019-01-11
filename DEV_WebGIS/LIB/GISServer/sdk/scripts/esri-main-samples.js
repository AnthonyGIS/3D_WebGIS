require([
  "dojo/_base/array",
  "dojo/_base/connect",
  "dojo/_base/event",
  "dojo/dom",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-geometry",
  "dojo/dom-style",
  "dojo/on",
  "dojo/query",
  "dojo/string",
  "dojo/window",
  "esri/config",
  "js/esri-samples-search",
  "js/esri-samples-ui",
  "js/esri-toc",
  "dojo/domReady!"
], function (arr, conn, evt, dom, domAttr, domClass, domGeom, domStyle, on, domQuery, string, win, esriConfig, sampleSearch, sampleUI,
  sampleToc){
  esriConfig.defaults.io.proxyUrl = "/proxy";
  var path = window.location.pathname;
  var pathPieces = path.split("/");
  // look for index.html in the url or, if after splitting on /
  // the last piece of pathname is an empty string
  // isIndexPage is used to decided whether or not to display sample
  // thumbnails when clicking on a category
  //
  // show thumbnails when on the index page but not when on a specific sample page
  var isIndexPage = (path.indexOf("index.html") > -1) || (pathPieces[pathPieces.length - 1] === "");

  // specify whether to use dev or production
  // used by esri-samples-search and esri-samples-ui
  // var subDomain = "devext";
  var subDomain = "www";//"www";
  // var groupId = "5ee54ab665164db29ea9cfd0bafb89ed"; // devext
  var groupId = "b99ada9698614e97a4859e9fc160169d";//"b99ada9698614e97a4859e9fc160169d"; // production

  // class to search samples or retrieve samples from a category
  var samples = new sampleSearch({
    subDomain: subDomain,
    groupId: groupId
  });

  // if search form exists, hook up search
  var searchForm = domQuery(".site-search-form");
  if (searchForm.length) {
    // enable the search term field
    var searchBox = domQuery("input[type=search]")[0];
    domAttr.set(searchBox, "disabled", false);

    // search samples or display samples in a category
    // show thumbnails for sample categories if not on the index.html
    var thumbnails = new sampleUI({
      loading: "samplesLoading",
      rootCategories: "wh_footer",
      rootSamples: "samplePane",
      showCategoryThumbnails: isIndexPage,
      subDomain: subDomain,
      groupId: groupId
    });

    // wire up the search form
    if (isSamplesDebug) {
      console.log("search form: ", searchForm, evt);
    }
    conn.connect(searchForm[0], "submit", function (e){
      evt.stop(e);
      var term = searchBox.value;
      search(e);
      // add the search term to the url
      // go to /index.html if not currently on that page
      if (window.location.pathname.indexOf(".html") > -1) {
        // remove file name from the path
        var path = window.location.pathname.replace(/\/[a-zA-Z_]*\.html/, "/");
        if (isSamplesDebug) {
          console.log("new path:  ", path);
        }
        window.location = path + "#search/" + term;
      }
      else {
        if (isSamplesDebug) {
          console.log("no .html in pathname", window.location.pathname);
        }
        window.location.hash = "#search/" + term;
      }
    });

    // load sample thumbnails is there's a category name in the URL hash
    var hash = window.location.hash;
    if (hash.length < 2) {
      // load thumbnails for each category
      if (thumbnails.loaded) {
        thumbnails.showCategories();
      }
      else {
        var thumbnailsLoad = conn.connect(thumbnails, "onLoad", function (){
          conn.disconnect(thumbnailsLoad);
          thumbnails.showCategories();
        });
      }
    }
    else {
      if (isSamplesDebug) {
        console.log("got a hash...!");
      }
      // --------------------------------------------------------------------
      // If we match #search/ in the hash, then it was a search initiated
      // by the search input box
      // --------------------------------------------------------------------
      var searchMatch = hash.match(/#\w+\//m);
      if (searchMatch) {
        // load sample thumbnails that match a search term
        if (isSamplesDebug) {
          console.log("Load sample thumbnails that match a search term");
        }

        var term = hash.split("search/");
        if (term.length === 2) {
          term = unescape(term[1]);
          if (isSamplesDebug) {
            console.log("search term from hash: ", term);
          }
          domAttr.set(searchBox, "value", term);
          search(term);
        }
      }
      else {
        // need to expand category and load samples thumbnails for that category
        var category = hash.split("#")[1].toLowerCase();
        var categoryNodes = domQuery("span.category", dom.byId("samplesToc"));
        if (isSamplesDebug) {
          console.log("expand category and load samples thumbnails for that category", category, categoryNodes);
        }
        var node = arr.filter(categoryNodes, function (n){
          if (isSamplesDebug) {
            console.log("compare: ", formatCategory(n.innerHTML), category, formatCategory(n.innerHTML) === category);
          }
          return formatCategory(n.innerHTML) === category;
        }, this);
        if (node[0]) {
          // expand the TOC
          // expandCollapse and clickAnchor are defined in tree.js
          expandCollapse(node[0]);
          clickAnchor(node[0]);

          // scroll the catgory of interst into view and display thumbnails
          node[0].scrollIntoView();
          if (isSamplesDebug) {
            console.log("about to display samples for: ", string.trim(node[0].innerHTML));
          }
          displayCategory(category, string.trim(node[0].innerHTML));
        }
      }
    }
  }

  // listen to TOC clicks, expand/collapse as necessary and load thumbnails
  on(dom.byId("samplesToc"), "click", function (e){
    if (isSamplesDebug) {
      console.log("category click: ", e);
    }
    // check that a category name or an arrow
    // next to a category name was clicked
    var isCategory = domClass.contains(e.target, "category");
    var isCategoryIcon = domClass.contains(e.target, "treeLinkImage");
    if (!isCategory && !isCategoryIcon) {
      return;
    }

    if (isCategoryIcon) {
      // clicked an icon, find the closest span.category
      // and set that to the event's target
      var catNode = domQuery("span.category", e.target.parentNode)[0];
      delete e.target;
      e.target = catNode;
    }

    // only change the URL when on index.html and a new category is clicked
    if (isIndexPage) {
      var category = formatCategory(e.target.innerHTML);
      if (isSamplesDebug) {
        console.log("used toc to format category", category);
      }
      var current = window.location.hash;
      var next = "#" + category;
      if (isSamplesDebug) {
        console.log("cur and next: ", current, next, current !== next);
      }
      // only update the UI if a new category was clicked
      if (current !== next) {
        thumbnails.empty();
        thumbnails.showLoading();
        window.location.hash = next;
        if (isSamplesDebug) {
          console.log("updated hash to: ", next);
          console.log("sample toc click: ", category);
        }
        displayCategory(category, e.target.innerHTML);
      }
    }
  });

  // manage TOC state
  var toc = new sampleToc({
    defaultContent: ".",
    node: dom.byId("toggleToc")
  });
  toc.highlightTopic();

  prettyPrint();

  // tailcoat, handles "drawer" on narrow screens and
  // expanding/shrinking of the search box
  T.init();

  function search(e){
    if (isSamplesDebug) {
      console.log("search", e);
    }
    thumbnails.empty();
    thumbnails.showLoading();
    // check if the class to query samples is loaded
    if (samples.loaded) {
      _search(e);
    }
    else {
      var loadConnect = conn.connect(samples, "onLoad", function (){
        conn.disconnect(loadConnect);
        _search(e);
      });
    }
  }

  function _search(e){
    if (isSamplesDebug) {
      console.log("into _search", e);
    }
    var term = (typeof e === "string") ? e : domQuery("input[type=search]", e.target)[0].value;
    // console.log("term: ", term);
    // var searchResult = samples.byKeyword(unescape(e.params.term));
    var searchResult = samples.byKeyword(unescape(term));
    searchResult.then(function (response){
      if (isSamplesDebug) {
        console.log("search results: ", response);
      }
      thumbnails.showSamples(response);
      if (isSamplesDebug) {
        console.log("called thumbnails.showSamples");
      }
      // ds.set("spinner", "visibility", "hidden");
      // ds.set("searchButton", "disabled", "false");
    }, function (error){
      // ds.set("spinner", "visibility", "hidden");
      // ds.set("searchButton", "disabled", "false");
      if (isSamplesDebug) {
        console.log("search error: ", error);
      }
    });
  }

  function displayCategory(category, displayName){
    if (isSamplesDebug) {
      console.log("category handler: ", category);
    }
    if (samples.loaded) {
      _displayCategory(category, displayName);
    }
    else {
      var loadConnect = conn.connect(samples, "onLoad", function (){
        conn.disconnect(loadConnect);
        _displayCategory(category, displayName);
      });
    }
  }

  function _displayCategory(category, displayName){
    var results = samples.byCategory(category);
    results.then(function (response){
      if (isSamplesDebug) {
        console.log("byCat results: ", response);
      }
      // clear out any previous content
      // domConstruct.empty("samplePane");
      // display sample thumbnails
      thumbnails.showSamples(response, displayName);
    }, function (error){
      console.log("error from display category: ", error);
      // ds.set("spinner", "visibility", "hidden");
    });
  }

  // set toc and content area heights so that each is independently scrollable
  setContentHeight();

  // resize as the window resizes
  on(window, "resize", setContentHeight);

  function setContentHeight(){
    if (isSamplesDebug) {
      console.log("setContentHeight");
    }
    // resize the toc and content areas
    var contentHeight = calcContentHeight();
    var tocNode = domQuery(".grid_3.contentWrapper")[0];
    // topic node could be .grid_9.contentWrapper or .grid_12.contentWrapper
    // dependning on whether or not the TOC is visible
    var topicNode = domQuery(".grid_9.contentWrapper").length ?
      domQuery(".grid_9.contentWrapper")[0] :
      domQuery(".grid_12.contentWrapper")[0];
    domStyle.set(tocNode, {height: contentHeight, overflow: "auto"});
    domStyle.set(topicNode, {height: contentHeight, overflow: "auto"});
  }

  function calcContentHeight(){
    if (isSamplesDebug) {
      console.log("calcContentHeight");
    }
    // figure out how big each pane should be
    var winHeight = win.getBox().h;
    var headerHeight = domGeom.getMarginBox(domQuery("header.header")[0]).h +
      domGeom.getMarginBox(domQuery("div.navigation-bar")[0]).h;
    // console.log("win, header: ", winHeight, headerHeight);
    var tocNode = domQuery(".grid_3.contentWrapper")[0];
    var topMargin = domStyle.get(tocNode, "marginTop");
    var height = (winHeight - headerHeight - topMargin) + "px";
    return height;
  }

  // remove leading and trailing whitespace
  // replace all spaces between words with underscores
  // string is dojo/string
  function formatCategory(c){
    var formatted = string.trim(c).toLowerCase().replace(/ /g, "_").replace(/\./g, "_");
    if (isSamplesDebug) {
      console.log("formatCategory", c, formatted);
    }
    return formatted;
  }

  // --------------------------------------------------------------------
  // JSBin
  // --------------------------------------------------------------------
  function jsBinEventHandler(event){

    var sampleNameFromUrlRegEx = /[-\w]*(?=\/index\.html)/im;

    function httpGetAsync(theUrl, callback){

      var sampleNameMatch = theUrl.match(sampleNameFromUrlRegEx);
      var jsbinWindowName = sampleNameMatch ? sampleNameMatch[0] : (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

      var jsbinTab = window.open("about:blank", jsbinWindowName);
      var xhr = new XMLHttpRequest();

      xhr.open("GET", theUrl, true); // true for asynchronous
      xhr.onreadystatechange = function (event){
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          var modifiedSource = updateSampleCodeTitleForJSBin(xhr.responseText, theUrl);
          callback(jsbinTab, modifiedSource);
        }
        else if (xhr.status === 404) {
          console.log("Unable to locate url %s", event.currentTarget.responseURL);
        }
      };
      xhr.onerror = function (event){
        console.log("An error occurred while fetching url %s", event.currentTarget.responseURL);
      };
      xhr.send();
    }

    function updateSampleCodeTitleForJSBin(sourceCode, refURL){
      var disclamerTemplate = "<!-- \n  ArcGIS API for JavaScript, https://js.arcgis.com\n  For more information about the {{ sample_name }} sample, read the original sample description at developers.arcgis.com.\n  {{ sample_url }}  \n  -->\n  ";
      var updatedSource = sourceCode;
      var titleElementRegEx = /<title>[^<]*<\/title>/im;
      var titleElementRegExMatch = sourceCode.match(titleElementRegEx);
      var titleElement = titleElementRegExMatch ? titleElementRegExMatch[0] : "";
      var jsBinDescription = titleElement.replace(/<\/?title>/gim, "");
      if (titleElement && titleElement !== "") {
        var sampleNameMatch = refURL.match(sampleNameFromUrlRegEx);
        var sampleName = sampleNameMatch ? sampleNameMatch[0] : "sample";
        var sourceURL = "https://developers.arcgis.com/javascript/3/jssamples/" + sampleName + ".html";
        var titleDisclamer = "";
        titleDisclamer += '<meta name="description" content="[' + jsBinDescription + ']">\n  ';
        titleDisclamer += disclamerTemplate.replace(/{{\ssample_name\s}}/, sampleName).replace(/{{\ssample_url\s}}/, sourceURL) + titleElement;
        updatedSource = sourceCode.replace(titleElementRegEx, titleDisclamer);
      }
      return updatedSource;
    }

    function openInJSBin(win, source){

      var sources = ["html", "css", "js"];
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
        if (sources[i] === "html") {
          input.value = encodeURIComponent(source);
        }
        else {
          input.value = "";
        }
      }
      win.document.body.appendChild(form);
      form.submit();
    }

    var jsbinButtonNodeUrl = event.target.getAttribute("data-jsbin-url") || "";

    if (jsbinButtonNodeUrl && jsbinButtonNodeUrl !== "") {
      httpGetAsync(jsbinButtonNodeUrl, openInJSBin);
    }
    else {
      console.log("Unable to retrieve sample code source for %s", jsbinButtonNodeUrl);
    }
  }

  var jsBtnJSBin = domQuery(".js-btn-jsbin");
  if (jsBtnJSBin.length) {
    on(jsBtnJSBin[0], "click", jsBinEventHandler);
  }
});
