var url_dev = "http://localhost:3000/node/shananda/sh-4";
var url_prod_window = "http://119.59.127.34:8080/node/shananda/sh-4";
var url_prod_linux ="http://35.240.149.115:8080/node/shananda/sh-4"
var trigger =2 ;
if (location.hostname == "119.59.127.34") {
  url = url_prod_window
} 
else if (location.hostname == "http://35.240.149.115"){
  url = url_prod_linux
} else {
  url = url_dev
}
