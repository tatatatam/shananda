var url_dev = "http://localhost:8080/node/shananda/sh-4";
var url_prod = "http://119.59.127.34:8080/node/shananda/sh-4";
var trigger = 1;
if (location.hostname == "localhost") trigger = 0;
var url = trigger === 0 ? url_dev : url_prod;
