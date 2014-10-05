webprint
========

ArcGIS Web Map Printing

a) Deploy proxy in IIS using instructions  from Esri resource proxy from github. See link below

  https://github.com/Esri/resource-proxy
  
b) Copy files to your web server

c) Publish the map of Otjiwarongo supplied as map package. See link below

  http://resources.arcgis.com/en/help/main/10.2/index.html#/Tutorial_Publishing_additional_services_for_printing/0154000005n1000000/

d) After publishing custom layouts for publishing get the export web map url and replace my URL shown below with your URL in the webprint .js

  http://localhost:6080/arcgis/rest/services/ULIMSExportWebMap/GPServer/Export%20Web%20Map
  
e) Replace arcgis dynamic service with your url from ArcGIS for Server. Replace my url below with your URL

  http://localhost:6080/arcgis/rest/services/Otjiwarongo/MapServer

  
