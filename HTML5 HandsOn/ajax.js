var xmlHttpReq = false;

function xmlhttpPost(queryString, callbackSuccess) {
    log("xmlhttpPost is called");

    var self = this;    
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }

    self.xmlHttpReq.open('POST', 'http://localhost/OrdersService/OrdersService.asmx/PlaceOrder', true);
    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //self.xmlHttpReq.setRequestHeader('Content-Length', queryString.length);

    self.xmlHttpReq.onreadystatechange = function() {
        log("onreadystatechange:" + self.xmlHttpReq.readyState + ", " + self.xmlHttpReq.status + ", "
            + self.xmlHttpReq.responseText+ ", " + self.xmlHttpReq.responseXML);
        
        if (self.xmlHttpReq.readyState == 4 && (self.xmlHttpReq.status == 200 || self.xmlHttpReq.status == 0)) {
            callbackSuccess(self.xmlHttpReq.responseXML);
        }
    };

    self.xmlHttpReq.send(queryString);
    log("xmlhttpPost ends");
}

function getquerystring(formName) {
    var form = document.forms[formName];
    var queryString = "";

    function GetElemValue(name, value) {
        queryString += (queryString.length > 0 ? "&" : "")
            + escape(name).replace(/\+/g, "%2B") + "="
            + escape(value ? value : "").replace(/\+/g, "%2B");
    }

    var elemArray = form.elements;
    for (var i = 0; i < elemArray.length; i++) {
        var element = elemArray[i];
        var elemType = ""; 
        if(element.type)
        {
            elemType = element.type.toUpperCase();    
        }
        var elemName = element.name;
        if (elemName) {
            if (elemType == "TEXT"
                    || elemType == "TEXTAREA"
                    || elemType == "PASSWORD"
                    || elemType == "BUTTON"
                    || elemType == "RESET"
                    || elemType == "SUBMIT"
                    || elemType == "FILE"
                    || elemType == "IMAGE"
                    || elemType == "HIDDEN"
                    || elemType == "EMAIL"
                    || elemType == "URL"
                    || elemType == "TEL"
                    || elemType == "RANGE"
                    || elemType == "DATE"
                    )
            GetElemValue(elemName, element.value);
            else if (elemType == "CHECKBOX" && element.checked)
                GetElemValue(elemName, element.value ? element.value : "On");
            else if (elemType == "RADIO" && element.checked)
                GetElemValue(elemName, element.value);
            else if (elemType.indexOf("SELECT") != -1)
                for (var j = 0; j < element.options.length; j++) {
                    var option = element.options[j];
                    if (option.selected)
                        GetElemValue(elemName,
                            option.value ? option.value : option.text);
                }
        }
    }
    return queryString;
}


/*
function ajaxServiceReq()
{
    log("ajaxServiceReq called");
    
    $.ajax({
        type: "POST",
        url: "http://localhost/OrdersService/OrdersService.asmx/PlaceOrder",
        data: "{'inputName':'dave','inputEmail':'e@mail','inputWebsite':'url','inputPhone':'+91','inputQuantity':'1','inputDeliveryDate':'2012-01-26','inputShippingAddress':'address'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(msg) {
            log("AJAX Called successfully" + msg)
        }
    });
    
    log("ajaxServiceReq ends");
}
*/
