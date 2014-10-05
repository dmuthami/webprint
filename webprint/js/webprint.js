var app = {};
require([
  "esri/map", "esri/layers/FeatureLayer",
  "esri/dijit/Print", "esri/tasks/PrintTemplate",

  "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer",

  "esri/request", "esri/config",
  "dojo/_base/array", "dojo/dom", "dojo/parser",

  "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"
], function (
  Map, FeatureLayer,
  Print, PrintTemplate,
  ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer,
  esriRequest, esriConfig,
  arrayUtils, dom, parser
) {
    parser.parse();

    app.printUrl = "http://localhost:6080/arcgis/rest/services/ULIMSExportWebMap/GPServer/Export%20Web%20Map";

    esriConfig.defaults.io.proxyUrl = "http://localhost/proxy/proxy.ashx";
    esriConfig.defaults.io.corsDetection = false;

    app.map = new esri.Map("map", {
        basemap: "hybrid",
        //center: [-117.447, 33.906],
        center: [16.653, -20.464],
        zoom: 17,
        slider: false
    });

    // add graphics for pools with permits
    var permitUrl = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/PoolPermits/MapServer/1";
    var poolFeatureLayer = new FeatureLayer(permitUrl, {
        "mode": FeatureLayer.MODE_SNAPSHOT
    });
    //app.map.addLayer(poolFeatureLayer);

    //Map of otjiwarongo goes here
    var layer = new ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/Otjiwarongo/MapServer", {
        id: "Otjiwarongo",
        opacity: 0.5
    });

    //add operational layer
    app.map.addLayer(layer);

    // get print templates from the export web map task
    var printInfo = esriRequest({
        "url": app.printUrl,
        "content": { "f": "json" }
    });
    printInfo.then(handlePrintInfo, handleError);

    function handlePrintInfo(resp) {
        var layoutTemplate, templateNames, mapOnlyIndex, templates;

        layoutTemplate = arrayUtils.filter(resp.parameters, function (param, idx) {
            return param.name === "Layout_Template";
        });

        if (layoutTemplate.length == 0) {
            console.log("print service parameters name for templates must be \"Layout_Template\"");
            return;
        }
        templateNames = layoutTemplate[0].choiceList;

        // remove the MAP_ONLY template then add it to the end of the list of templates
        mapOnlyIndex = arrayUtils.indexOf(templateNames, "MAP_ONLY");
        if (mapOnlyIndex > -1) {
            var mapOnly = templateNames.splice(mapOnlyIndex, mapOnlyIndex + 1)[0];
            templateNames.push(mapOnly);
        }

        // create a print template for each choice
        templates = arrayUtils.map(templateNames, function (ch) {
            var plate = new PrintTemplate();
            plate.layout = plate.label = ch;
            plate.format = "PDF";
            plate.layoutOptions = {
                "authorText": "Made by:  Esri's JS API Team",
                "copyrightText": "<copyright info here>",
                "legendLayers": [],
                "titleText": "Pool Permits",
                "scalebarUnit": "Miles"
            };
            return plate;
        });

        // create the print dijit
        app.printer = new Print({
            "map": app.map,
            "templates": templates,
            url: app.printUrl
        }, dom.byId("print_button"));
        app.printer.startup();
    }

    function handleError(err) {
        console.log("Something broke: ", err);
    }
});