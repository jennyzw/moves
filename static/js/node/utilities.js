/* method to get the day of the week from iso format
   then use getDay to get the day number (0-6)*/
function isoStringToDate(s) {
  var b = s.split(/\D/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3]||0, b[4]||0, b[5]||0, b[6]||0));
}
// Date functions used: getDay, getHours
// iso date format: "2013-09-10T22:57:31.000Z"

// jQuery for select all button in html
$(function () {
    $('.checkall').on('click', function () { 
        $(this).closest('fieldset').find(':checkbox').prop('checked', this.checked);
    });
});