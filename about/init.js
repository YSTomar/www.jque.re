function loadCDN() {
    var xmlhttp;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("cdn-files").innerHTML = xmlhttp.responseText;
            document.getElementById('cdn-files').innerHTML = linkify(document.getElementById('cdn-files').innerHTML);
        }
    }

    xmlhttp.open("GET", "https://www.jque.re/about/cdn.html", true);
    xmlhttp.send();
}

document.getElementById("loadCDN").addEventListener("click", function(e) {
	loadCDN();
	e.preventDefault();
});

document.addEventListener("DOMContentLoaded", function() {

});