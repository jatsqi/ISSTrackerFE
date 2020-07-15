// function that handles click on country 
var setCountryPopUp = false;
var country;
function onCountry(countryName, destination){
    toggleLoading(false,false,true);
    country = countryName;
    changeCursor('wait');
    if(!setCountryPopUp){
    removePopUps();
    setCountryPopUp = true; 
    callCountryBackEnd(countryName, destination);
    }
}

// call to Backend for info
function callCountryBackEnd(countryName, destination){    
    var oData = {};
    oData.e = {'destination': destination,
               'countryName': countryName
            };
    oData.call = "ISSCountryPasses";
    oData.data =        "<requestName>ISSCountryPasses</requestName>" + 
                            "<params>" +
                            "<startTime>" + getCurrentTime(720) +"</startTime>" +
                            "<endTime>" + getCurrentTime() +"</endTime>" +
                            "<country>" + countryName + "</country>" +
                            "</params>";                        
    oData.callback = countryCallBack;
    oData.type = "POST";
    ajaxCall(oData);
}

// creation of html DOM
function countryCallBack(oData, e){
    var xmlDoc = oData;
if( xmlDoc.childNodes[1].childNodes[1].childNodes[1].childNodes.length){
    for (var i = 0; i < xmlDoc.childNodes[1].childNodes[1].childNodes[1].childNodes.length; i++)
    {
       if(xmlDoc.childNodes[1].childNodes[1].childNodes[1].childNodes[i].childNodes[0].innerHTML != "")
        xmlDoc.childNodes[1].childNodes[1].childNodes[1].childNodes[i].childNodes[0].innerHTML = parse2localTime(xmlDoc.childNodes[1].childNodes[1].childNodes[1].childNodes[i].childNodes[0].innerHTML);
      if(xmlDoc.childNodes[1].childNodes[1].childNodes[1].childNodes[i].childNodes[1].innerHTML != "")
        xmlDoc.childNodes[1].childNodes[1].childNodes[1].childNodes[i].childNodes[1].innerHTML = parse2localTime(xmlDoc.childNodes[1].childNodes[1].childNodes[1].childNodes[i].childNodes[1].innerHTML);
    }
}
    if (!e.destination){
        document.getElementById("countryPasses").innerHTML = "";
        transform2(xmlDoc, 'xsl/countryflyby.xsl', "countryPasses");
    } else {
        document.getElementById("passContainer").innerHTML = '<div id="countrypassesSidebar"><div id="countryHeader"></div><div id="countryContent"></div></div>';
        document.getElementById("countryHeader").innerHTML = "<h2>Flyby over " + e.countryName + "</h2>";
        transform2(xmlDoc, 'xsl/countryflyby_sidebar.xsl', "countryContent");
    }


    toggleLoading(true);
    setCountryPopUp = false;
    bGeoCodingInProgress = false;
}