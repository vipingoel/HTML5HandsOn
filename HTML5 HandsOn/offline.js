var html5Work = {};
html5Work.webdb = {};
html5Work.webdb.db = null;

html5Work.webdb.open = function() {
    
  var dbSize = 5 * 1024 * 1024; // 5MB
  html5Work.webdb.db = openDatabase("orders_db", "1.0", "place orders", dbSize);
}

html5Work.webdb.dropTable = function() {

  var db = html5Work.webdb.db;
  db.transaction(function(tx) {
    log("drop table query called");
    
    tx.executeSql('DROP TABLE orders',
                    [],
                    html5Work.webdb.onSuccess,
                    html5Work.webdb.onError);
    
    log("drop table query ended");
    });
}

html5Work.webdb.createTable = function() {
    
  var db = html5Work.webdb.db;
  db.transaction(function(tx) {
    log("create table query called");
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS '
                  + 'orders(id INTEGER PRIMARY KEY ASC, user_name text,email text,url text,phone text'
                  + ',quantity integer ,delivery_date datetime ,shipping_address text ,created_on datetime, query_string text)',
                    [],
                    html5Work.webdb.onSuccess,
                    html5Work.webdb.onError);
    
    log("create table query ended");
    });
}

html5Work.webdb.addOrder = function(user_name, email, url, phone, quantity, delivery_date, shipping_address, queryString) {
    
  var db = html5Work.webdb.db;
  db.transaction(function(tx){
        
        log("Insert table query called");
    
        var addedOn = new Date();
    tx.executeSql("INSERT INTO orders( [user_name],[email],[url],[phone],[quantity],[delivery_date],[shipping_address],[created_on], [query_string]) VALUES (?,?,?,?,?,?,?,?,?)",
        [user_name, email, url, phone, quantity, delivery_date, shipping_address, addedOn, queryString],
        html5Work.webdb.onSuccess,
        html5Work.webdb.onError);
    
        log("Insert table query end");
    });
}

html5Work.webdb.onError = function(tx, e) {
  log("There has been an error while doing database operation:" + e.message);
}

html5Work.webdb.onSuccess = function(tx, r) {
    log("success");
}

html5Work.webdb.getAllOrders = function(renderFunc) {
    
  var db = html5Work.webdb.db;
  db.transaction(function(tx) {
    log(" select query called");
    
    tx.executeSql("SELECT * FROM orders", [], renderFunc,
        html5Work.webdb.onError);
    
    log(" select query ends");
  });
}

html5Work.webdb.deleteOrder = function(id) {
  var db = html5Work.webdb.db;
  db.transaction(function(tx){
     log("delete query called");
    
    tx.executeSql("DELETE FROM orders WHERE id=?", [id],
        html5Work.webdb.onSuccess,
        html5Work.webdb.onError);
    
    log("delete query ends");
    
    });
}

function log(logMessage)
{
    var today = new Date();
    responseDiv.innerHTML = today.toTimeString() + ": " + logMessage + "</br>" + responseDiv.innerHTML
}

function loadOrderItems(tx, selectResult) {
    log("load Orders Called, no of results:" +  selectResult.rows.length);
    
    var rowOutput = "";
    var savedOrdersList = document.getElementById("savedOrdersList");
  
    for (var i=0; i < selectResult.rows.length; i++) {
      rowOutput = renderOrder(selectResult.rows.item(i)) + rowOutput;
    }
    savedOrdersList.innerHTML = rowOutput;
    
    showHideOnlineButton();
    log("load Orders end");
}

function renderOrder(row) {
  var result = "<li class='savedItem'>"
  + "<b>Local request ID:</b>" + row.id
  + "</br> <b>Name:</b>" + row.user_name
  + "</br> <b>Email:</b>" + row.email
  + "</br> <b>Website:</b>" + row.url
  + "</br> <b>Phone:</b>" + row.phone
  + "</br> <b>Quantity:</b>" + row.quantity
  + "</br> <b>Delivery:</b>" + row.delivery_date
  + "</br> <b>Shipping Address:</b>" + row.shipping_address
  + "</br> <b>Created on:</b>" + row.created_on
  + "</br> [<a href='javascript:void(0);' onclick='html5Work.webdb.deleteOrder(" + row.id +"); html5Work.webdb.getAllOrders(loadOrderItems);'>Cancel Request</a>]"
  + " <span class='linkPlaceSavedOrderOnline'>[<a class='linkPlaceSavedOrderOnline' href='javascript:void(0);' onclick='placeSavedOrderOnline(" + row.id + ", \"" + row.query_string + "\");'>Place Saved Order Online</a>]</span></li>";  
  return result;
}


function placeSavedOrderOnline(rowID, queryString)
{
    selectedRowID = rowID;
    log("<b>Place saved Order Online is called and request is submitted Asynchronously</b>");
      
      xmlhttpPost(queryString, function(responseXML){
                            var result = responseXML.firstChild.textContent;
                            if(result == "success")
                            {
                                debugger;
                                log("<b>Successfully submitted saved record online</b>");
                                html5Work.webdb.deleteOrder(selectedRowID);
                                html5Work.webdb.getAllOrders(loadOrderItems);
                               // alert("Successfully submitted saved record online");
                            }
                               else {
                                log("<b>Some issue occurred while processing your request. Please try again later.</br>" + result + "</b>");
                                alert("Some issue occurred while processing your request. Please try again later.</br>" + result);
                            }
        });
}

function addNewOrder(queryString) {
  
  html5Work.webdb.addOrder(
            document.getElementsByName("inputName")[0].value,
            document.getElementsByName("inputEmail")[0].value,
            document.getElementsByName("inputWebsite")[0].value,
            document.getElementsByName("inputPhone")[0].value,
            document.getElementsByName("inputQuantity")[0].value,
            document.getElementsByName("inputDeliveryDate")[0].value,
            document.getElementsByName("inputShippingAddress")[0].value,
            queryString);
}


var responseDiv;

function init() {
    responseDiv = document.getElementById("responseDiv");
    log("init called");
    
    html5Work.webdb.open();
    //html5Work.webdb.dropTable();
    html5Work.webdb.createTable();
    html5Work.webdb.getAllOrders(loadOrderItems);
    
    showHideOnlineButton();
    window.onoffline = showHideOnlineButton;
    window.ononline = showHideOnlineButton;
    
    //add submit event
    $('#formOrder').submit(function(event){
        // cancels the form submission
        event.preventDefault();
        
        var queryString = getquerystring("formPlaceOrder");
        log("queryString:" + queryString);
        
        //Check which button was clicked
        if(submitButton=='placeorder')
        {
            log("<b>" + "place order submit request" + "</b>");
            
            xmlhttpPost(queryString, function(responseXML){
                debugger;
                            var result = responseXML.firstChild.textContent;
                            if(result == "success")
                            {
                                $("#formOrder")[0].reset();
                                log("<b>Successfully submitted order online</b>");
                                //alert("Successfully submitted order online");
                            }
                            else {
                                log("<b>Some issue occurred while processing your request. Please try again later. Error:" + result + "</b>");
                                //alert("Some issue occurred while processing your request. Please try again later.</br>" + result);
                            }
                    });
        }
        else
        {
            log("<b>" + "save for later submit request" + "</b>");
            addNewOrder(queryString);
            html5Work.webdb.getAllOrders(loadOrderItems);
            $("#formOrder")[0].reset();
        }
    });
}

function showHideOnlineButton()
{
    if(!navigator.onLine)
    {
        debugger;
        $("#placeOrder").hide();
        $(".linkPlaceSavedOrderOnline").hide();
    }
    else
    {
        $("#placeOrder").show();
        $(".linkPlaceSavedOrderOnline").show();
    }
}