

var confirmarSubmit = function(msg,form_name) {

   if (confirm(msg)) {
      document.all[form_name].submit();
   }
   return false;
}

var submitForm = function(form_name) {
   document.all[form_name].submit();
   return false;
}



