function tokenReplace(string) {
  var returnValue = string;

  var args = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < args.length; i++) {
    var token = "%" + i + "%";
    returnValue = returnValue.replace(token, args[i]);
  }

  return returnValue;
}; 