/**
 * Thread-SSE client library
 * 
 * If your browser doesn't support EventSource, please use available polyfills
 * 
 * (c) Copyright 2020-present Richard Li <richard.li@w3plan.net>
 * License: MIT
 */

(function(){
"use strict";

/**
 * The object for log messages
 * @private
 */
var clib = {
  name: "Thread-SSE Client",
  description: "Thread-SSE client library",
  version: "Version 1.0.1",
  supportError: "Your browser doesn't support Thread-SSE.",
  clientOff: "Thread-SSE client isn't running, no submittal was sent.",
  msgOpen: "Thread-SSE client is connected.",
  msgError: "Server connection failed.",
  dataError: "Thread-SSE data error.",
  dataTypeError: "Invalid Thread-SSE data.",
  tsseActionError: "No tsseAction function was defined.",
  tsseConnectionError: "Error when request Thread-SSE connection.",
  renewMsg: "Thread-SSE connection is renewed.",
  ict: "Invalid customVali to ",
  isd: "Invalid shared data id: ",
  fcsd: "Failed to create Thread-SSE shared data.",
  fssd: "Failed to send Thread-SSE shared data.",
  itsd: "Invalid Thread-SSE shared data.",
  msg8990: "Thread-SSE client is closed."
};

var uriPattern = /^(ftp:|ftps:|ws:|wss:|http:|https:|file:)?(\/\/)(?:\S+(?::\S*)@)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+=]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
var emailPattern = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
var relativeUriPattern = /^((\.\.\/)*|(\/)?)([-a-z\d%_.~+=]+)(\/[-a-z\d%_.~+=]*)+(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
var ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i;
var countryPattern = "AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW";

/**
 * The object for data validation
 *
 * Library
 * @private
 */
var nvali = {};

nvali.isString = function(val) {
  return typeof val === "string";
};

nvali.isNumberString = function(val) {
  return typeof val === "string" &&
         !isNaN(val) && 
         val == +val;
};

nvali.isFloatString = function(val) {
  return typeof val === "string" &&
         nvali.isFloat(+val);
};

nvali.isFractionString = function(val) {
  return typeof val === "string" &&
         /^[1-9][0-9]*\/[1-9][0-9]*$/.test(val);
};

nvali.isIntegerString = function(val) {
  return typeof val === "string" &&
         nvali.isInteger(+val);
};

nvali.isNonEmptyString = function(val) {
  return typeof val === "string" &&
         val.length > 0;
};

nvali.isEmptyString = function(val) {
return typeof val === "string" &&
       val.length == 0;
};

nvali.isHexString = function(val) {
  return typeof val === "string" &&
         /^-?0x[0-9a-f]+$/i.test(val);
};

nvali.isOctalString = function(val) {
  return typeof val === "string" &&
         /^(-?0[0-7]+ ?)+$/.test(val);
};

nvali.isBinaryString = function(val) {
  if (typeof val === "string") {
    for (var i = 0; i < val.length; i++) {
      if (val[i] !== "0" && val[i] !== "1") return false;
    }
    return true;
  }
  return false;
};

nvali.isUri = function(val) {
  return typeof val === "string" && uriPattern.test(val);
};

nvali.isRelativeUri = function(val) {
  return typeof val === "string" && relativeUriPattern.test(val);
};

nvali.isUriProtocol = function(val) {
  var pattern = /^(ftp|ftps|ws|wss|http|https|file|mailto|data|irc)$/i;
  return typeof val === "string" && pattern.test(val);
};

nvali.isDomain = function(val) {
  var pattern = /^(([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})$/i;
  return typeof val === "string" && pattern.test(val);
};

nvali.isIpv4 = function(val) {
  return typeof val === "string" && ipv4Pattern.test(val);
};

nvali.isIpv6 = function(val) {
  var pattern = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
  return typeof val === "string" && pattern.test(val);
};

nvali.isPort = function(val) {
  var pattern = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/i;
  return typeof val === "string" && pattern.test(val);
};

nvali.isUserinfo = function(val) {
  var pattern = /^(?:\S+(?::\S*)?)$/i;
  return typeof val === "string" && pattern.test(val);
};

nvali.isPath = function(val) {
  var pattern = /^(\/?[-a-z\d%_.~+=]*)*$/i;
  return typeof val === "string" && pattern.test(val);
};

nvali.isQuery = function(val) {
  var pattern = /^(\?[;&a-z\d%_.~+=-]*)?$/i;
  return typeof val === "string" && pattern.test(val);
};

nvali.isFragment = function(val) {
  var pattern = /^(\#[-a-z\d_]*)?$/i;
  return typeof val === "string" && pattern.test(val);
};

nvali.isEmail = function(val) {
  return typeof val === "string" && emailPattern.test(val);
};

nvali.isLocalPart = function(val) {
  var pattern = /^(?=.{1,64}$)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*$/;
  return typeof val === "string" && pattern.test(val);
};

nvali.isLanguage = function(val) {
  return typeof val === "string" &&
         /^[a-z]{2,3}(?:-[A-Z]{2,3}(?:-[a-zA-Z]{4})?)?$/.test(val);
};

nvali.isCountry = function(val) {
  return typeof val === "string" && countryPattern.split("|").indexOf(val.trim().toUpperCase()) !== -1;
};

nvali.isRegExp = function(val) {
  return val instanceof RegExp &&
         Object.prototype.toString.call(val).slice(8, -1) === 'RegExp';
};

nvali.isRegExpString = function(val) {
  return typeof val === "string" && 
         nvali.isRegExp(new RegExp(val));
};

nvali.isUuid = function(val) {
  var pattern = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$/;
  return typeof val === "string" && pattern.test(val);
};

nvali.isAsciiString = function(val) {
  return typeof val === "string" && /^[\x00-\xFF]+$/.test(val);
};

nvali.isUnicodeString = function(val) {
  return typeof val === "string" && /^[\u0000-\u10FFFF]+$/.test(val);
};

nvali.isDateTime = function(val) {
  return typeof val === "string" &&
         /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([0-1][0-9]|2[0-4]):([0-5][0-9]):[0-5][0-9](\.\d{3})?Z$/i.test(val);
};

nvali.isDate = function(val) {
  return typeof val === "string" &&
         /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(val);
};

nvali.isTime = function(val) {
  return typeof val === "string" &&
         /^([0-1][0-9]|2[0-4]):([0-5][0-9]):[0-5][0-9](.\d{3})?$/.test(val);
};

nvali.isYear = function(val) {
  return typeof val === "string" &&
         /^[012]\d{3}$/.test(val);
};

nvali.isMonth = function(val) {
  return typeof val === "string" &&
         /^(0[1-9]|1[012])$/.test(val);
};

nvali.isDay = function(val) {
  return typeof val === "string" &&
         /^(0[1-9]|[12][0-9]|3[01])$/.test(val);
};

nvali.isHour = function(val) {
  return typeof val === "string" &&
         /^(0[1-9]|1[0-9]|2[01234])$/.test(val);
};

nvali.isMinute = function(val) {
  return typeof val === "string" &&
         /^([0-5][0-9])$/.test(val);
};

nvali.isSecond = function(val) {
  return typeof val === "string" &&
         /^([0-5][0-9](\.\d{3})?)$/.test(val);
};

nvali.isMillisecond = function(val) {
  return typeof val === "string" && 
         +val > 0;
};

nvali.isCssString = function(val) {
  return typeof val === "string" && 
         /^(?:\s*[\S ]+\s*{[^}]*})+$/.test(val);
};

nvali.isCssSelector = function(val) {
  return typeof val === "string" && 
         /^\s*[\S ]+\s*$/.test(val);
};

nvali.isCssDeclaration = function(val) {
  return typeof val === "string" &&
         /^\{[^}]+}$/.test(val);
};

nvali.isWebColor = function(val) {
  return typeof val === "string" && 
         /^(#([a-f0-9]{3}){1,2})|(rgb(a)?\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\))$/i.test(val);
};

nvali.isNumber = function(val) {
  return typeof val === "number" && 
         !isNaN(val);
};

nvali.isPositiveNumber = function(val) {
  return typeof val === "number" &&
         val > 0;
};

nvali.isNegativeNumber = function(val) {
  return typeof val === "number" &&
         val < 0;
}

nvali.isFloat = function(val) {
  return typeof val === "number" &&
         val % 1 !== 0;
};

nvali.isPositiveFloat = function(val) {
  return typeof val === "number" &&
         val % 1 !== 0 &&
         val > 0;
};

nvali.isNegativeFloat = function(val) {
  return typeof val === "number" &&
         val % 1 !== 0 &&
         val < 0;
};

nvali.isInteger = function(val) {
  return typeof val === "number" &&
         Number.isInteger(val);
};

nvali.isPositiveInteger = function(val) {
  return typeof val === "number" &&
         Number.isInteger(val) &&
         val > 0;
};

nvali.isNegativeInteger = function(val) {
  return typeof val === "number" &&
         Number.isInteger(val) &&
         val < 0;
}

nvali.isZero = function(val) {
  return typeof val === "number" &&
         Number.isInteger(val) &&
         val === 0;
};

nvali.isTrue = function(val) {
  return typeof val === "boolean" &&
         val === true;
};

nvali.isFalse = function(val) {
  return typeof val === "boolean" &&
         val === false;
};

nvali.isNull = function(val) {
  return val === null;
};

nvali.isArray = function(val, tag) {
return Array.isArray(val) && 
       typeof tag === "string";
};

nvali.isStringArray = function(val, tag) {
  return Array.isArray(val) && 
         val.every( function (i) { return typeof i === "string"; } ) &&
         typeof tag === "string";
};

nvali.isNumberArray = function(val, tag) {
  return Array.isArray(val) && 
         val.every( function (i) { return nvali.isNumber(i); } ) &&
         typeof tag === "string";
};

nvali.isIntegerArray = function(val, tag) {
  return Array.isArray(val) && 
         val.every( function(i) { return nvali.isInteger(i); } ) &&
         typeof tag === "string";
};

nvali.isIntegerRangeArray = function(val, tag) {
  return nvali.isIntegerArray(val, tag);
};

nvali.isEmptyArray = function(val, tag) {
  return Array.isArray(val) && 
         val.length === 0 && 
         typeof tag === "string";
};

nvali.isJsonObject = function (val, tag) {
  return nvali.isJson(val) && typeof tag === "string";
};

nvali.isEmptyObject = function(val, tag) {
  if ( nvali.isObject(val) && typeof tag === "string" ) {
    for (var key in val) {
      if (val.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }    
  return false;
};

nvali.isSerializedOthers = function(val, tag) {
  return typeof val === "string" &&
         val.length > 0 &&
         typeof tag === "string" &&
         tag.length > 0;
}

nvali.isOthers = function(val) {
  if ( nvali.isString(val) || 
       nvali.isNumber(val) || 
       Array.isArray(val) || 
       val === true || 
       val === false ||
       val === null || 
       nvali.isObject(val) ) 
  {
    return false;
  }
  return true;
};

nvali.isTrace = function(val, tag) {
  return typeof val === "string" && 
         val.length > 0 &&
         typeof tag === "string";
};

nvali.isDebug = function(val, tag) {
  return typeof val === "string" && 
         val.length > 0 &&
         typeof tag === "string";
};

nvali.isNotice = function(val, tag) {
  return typeof val === "string" && 
         val.length > 0 &&
         typeof tag === "string";
};

nvali.isWarn = function(val, tag) {
  return typeof val === "string" && 
         val.length > 0 &&
         typeof tag === "string";
};

nvali.isError = function(val, tag) {
  return typeof val === "string" && 
         val.length > 0 &&
         typeof tag === "string";
};

nvali.isFatal = function(val, tag) {
  return typeof val === "string" && 
         val.length > 0 &&
         typeof tag === "string"; 
};

nvali.isAlert = function(val, tag) {
  return typeof val === "string" && 
         val.length > 0 &&
         typeof tag === "string";
};

nvali.isEmerg = function(val, tag) {
  return typeof val === "string" && 
         val.length > 0 &&
         typeof tag === "string";
};

nvali.isNormalizedString = function(val, tag) {
  return typeof val === "string" &&
         val.replace(/[\t\r\n]/g, "") == val &&
         typeof tag === "string";
};

nvali.isText = function(val, tag) {
  return typeof val === "string" && 
         val.length > 64000 &&
         typeof tag === "string";
};

nvali.isBlob = function(val, tag) {
  return typeof val === "string" && 
         val.length > 64000 &&
         typeof tag === "string";
};

nvali.isDataUrl = function(val, tag) {
  return typeof val === "string" && 
         /^\s*data:\S*(;base64)?,\S+$/i.test(val) &&
         typeof tag === "string";
};

nvali.isSimpePassword = function(val, tag) {
  var pattern = /^(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/;
  return typeof val === "string" && 
         pattern.test(val) &&
         typeof tag === "string";
};

nvali.isComplicatedPassword = function(val, tag) {
  var pattern = /^(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}$/;

  return typeof val === "string" && 
         pattern.test(val) &&
         typeof tag === "string";
};

nvali.isPattern = function(val, tag) {
  //var pattern = new RegExp(val);
  var pattern = new Function('return ' + val)();
  return typeof val === "string" && 
         typeof tag === "string" &&
         pattern.test(tag);
};

nvali.isEncoding = function(val, tag) {
  return typeof val === "string" && 
         val.length > 0 &&
         typeof tag === "string";
};

nvali.isEncryption = function(val, tag) {
  return nvali.isEncoding(val, tag);
};

nvali.isHash = function(val, tag) {
  return nvali.isEncoding(val, tag);
};

nvali.isSalt = function(val, tag) {
  return nvali.isEncoding(val, tag);
};

nvali.is8000 = function(val, tag) {
  return typeof val === "string" && val.length > 0 && tag === '';
};

nvali.is8010 = function(val, tag) {
  return typeof val === "string" && val.length > 0 && tag === '';
};

nvali.is8020 = function(val, tag) {
  return typeof val === "string" && val.length > 0 && typeof val === "string";
};

nvali.is8030 = function(val, tag) {
  return typeof val === "string" && val.length > 0 && typeof val === "string";
};

nvali.is8060 = function(val, tag) {
  return typeof val === "string" && val.length > 0 && typeof tag === "string";
};

nvali.is8070 = function(val, tag) {
  return typeof val === "string" && val.length > 0 && typeof tag === "string" && tag.length > 0;
};

nvali.is8080 = function(val, tag) {
  return val === '' && tag === '';
};

nvali.is8100 = function(val, tag) {
  return val === '' && tag === '';
};

nvali.is8110 = function(val, tag) {
  return val === '' && tag === '';
};

nvali.is8120 = function(val, tag) {
  return val === '' && tag === '';
};

nvali.is8130 = function(val, tag) {
  return nvali.isPositiveInteger(val) &&
         nvali.isPositiveInteger(tag);
};

nvali.is8140 = function(val, tag) {
    return nvali.is8130(val, tag);
};

nvali.is8200 = function(val, tag) {
  var pattern = /^(id|classname|name|tagname|tagnamens)$/i;
  return typeof val === "string" && 
         pattern.test(val.split('=')[0].trim()) && 
         typeof tag === "string" &&
         tag.length > 0;
};

nvali.is8210 = function(val, tag) {
  return nvali.is8200(val, tag);
};

nvali.is8220 = function(val, tag) {
  return nvali.is8200(val, tag);
};

nvali.is8230 = function(val, tag) {
  return nvali.is8200(val, tag);
};

nvali.is8240 = function(val, tag) {
  return nvali.is8200(val, tag);
};

nvali.is8280 = function(val, tag) {
  return nvali.is8200(val, tag);
};

nvali.is8300 = function(val, tag) {
  if ( typeof val === "string" && ( tag === '' || nvali.isJson(tag) ) ) {
    var vals = val.replace(/[\s]+/g, '').split(';');
    
    return vals.every( function(i) { return (uriPattern.test(i) || relativeUriPattern.test(i)); } );
  }
  return false;
};

nvali.is8310 = function(val, tag) {
  if (typeof val === "string" && tag === '') {
    var vals = val.replace(/[\s]+/g, '').split(';');
    
    return vals.every( function(i) { return (uriPattern.test(i) || relativeUriPattern.test(i)); } );
  }
  return false;
};

nvali.is8320 = function(val, tag) {
  return nvali.is8300(val, tag);
};

nvali.is8330 = function(val, tag) {
  return nvali.is8310(val, tag);
};

nvali.is8340 = function(val, tag) {
  if (typeof val === "string" && typeof tag === "string") {
    var vals = val.replace(/[\s]+/g, '').split(';');
    var tags = tag.replace(/[\s]+/g, '').split(';');
    var urls = vals.concat(tags);
    
    return urls.every( function(i) { return (uriPattern.test(i) || relativeUriPattern.test(i)); } );
  }
  return false;
};

nvali.is8350 = function(val, tag) {
  return nvali.is8340(val, tag);
};

nvali.is8400 = function(val, tag) {
  return val === '' && tag === '';
};

nvali.is8410 = function(val, tag) {
  return nvali.is8310(val, tag);
};

nvali.is8420 = function(val, tag) {
  return nvali.is8310(val, tag);
};

nvali.is8430 = function(val, tag) {
  return typeof val === "string" && 
         (uriPattern.test(val) || relativeUriPattern.test(val)) &&
         /^([\w\.\+%~-]+=[\w\.\+%~-]+&?)+$/g.test(tag);
};

nvali.is8440 = function(val, tag) {
  return nvali.is8430(val, tag);
};

nvali.is8950 = function(val, tag) {
  return (val === '' || typeof +val === "number" && Number.isInteger(+val) && +val > 0) && tag === '';
};

nvali.is8990 = function(val, tag) {
  return val === '' && tag === '';
};

nvali.isObject = function(val) {
  return typeof val === 'object' && 
         Object.prototype.toString.call(val).slice(8, -1) === 'Object';
};

nvali.isJson = function(val) {
  if ( nvali.isObject(val) ) {
    try {
      JSON.stringify(val);
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
};

/**
 * The object that maps tsseData id to the validation function
 * @private
 */
var idToVali = {
  1000 : nvali.isString,
  1002 : nvali.isNonEmptyString,
  1004 : nvali.isEmptyString,
  1006 : nvali.isNumberString,
  1008 : nvali.isIntegerString,
  1010 : nvali.isFloatString,
  1012 : nvali.isFractionString,
  1014 : nvali.isHexString,
  1016 : nvali.isOctalString,
  1018 : nvali.isBinaryString,
  1020 : nvali.isUri,
  1022 : nvali.isRelativeUri,
  1024 : nvali.isUriProtocol,
  1026 : nvali.isUserinfo,
  1028 : nvali.isDomain,
  1030 : nvali.isIpv4,
  1032 : nvali.isIpv6,
  1034 : nvali.isPort,
  1036 : nvali.isPath,
  1038 : nvali.isQuery,
  1040 : nvali.isFragment,
  1042 : nvali.isEmail,
  1044 : nvali.isLocalPart,
  1050 : nvali.isLanguage,
  1052 : nvali.isCountry,
  1054 : nvali.isUuid,
  1056 : nvali.isAsciiString,
  1060 : nvali.isUnicodeString,
  1070 : nvali.isDateTime,
  1072 : nvali.isDate,
  1074 : nvali.isTime,
  1076 : nvali.isYear,
  1078 : nvali.isMonth,
  1080 : nvali.isDay,
  1082 : nvali.isHour,
  1084 : nvali.isMinute,
  1086 : nvali.isSecond,
  1088 : nvali.isMillisecond,
  1090 : nvali.isCssString,
  1092 : nvali.isCssSelector,
  1094 : nvali.isCssDeclaration,
  1096 : nvali.isWebColor,
  1200 : nvali.isNumber,
  1202 : nvali.isPositiveNumber,
  1204 : nvali.isNegativeNumber,
  1206 : nvali.isFloat,
  1208 : nvali.isPositiveFloat,
  1210 : nvali.isNegativeFloat,
  1212 : nvali.isInteger,
  1214 : nvali.isPositiveInteger,
  1216 : nvali.isNegativeInteger,
  1218 : nvali.isZero,
  1300 : nvali.isTrue,
  1302 : nvali.isFalse,
  1350 : nvali.isNull,
  3000 : nvali.isArray,
  3002 : nvali.isStringArray,
  3004 : nvali.isNumberArray,
  3006 : nvali.isIntegerArray,
  3008 : nvali.isIntegerRangeArray,
  3010 : nvali.isEmptyArray,
  3100 : nvali.isJsonObject,
  3110 : nvali.isEmptyObject,
  3200 : nvali.isSerializedOthers,
  3300 : nvali.isTrace,
  3310 : nvali.isDebug,
  3320 : nvali.isInfo,
  3330 : nvali.isNotice,
  3340 : nvali.isWarn,
  3350 : nvali.isError,
  3360 : nvali.isFatal,
  3370 : nvali.isAlert,
  3380 : nvali.isEmerg,
  3400 : nvali.isNormalizedString,
  3410 : nvali.isText,
  3420 : nvali.isBlob,
  3430 : nvali.isDataUrl,
  3450 : nvali.isSimpePassword,
  3460 : nvali.isComplicatedPassword,
  3500 : nvali.isPattern,
  3530 : nvali.isEncoding,
  3540 : nvali.isEncryption,
  3550 : nvali.isHash,
  3560 : nvali.isSalt,
  8000 : nvali.is8000,
  8010 : nvali.is8010,
  8020 : nvali.is8020,
  8030 : nvali.is8030,
  8060 : nvali.is8060,
  8070 : nvali.is8070,
  8080 : nvali.is8080,
  8100 : nvali.is8100,
  8110 : nvali.is8110,
  8120 : nvali.is8120,
  8130 : nvali.is8130,
  8140 : nvali.is8140,
  8200 : nvali.is8200,
  8210 : nvali.is8210,
  8230 : nvali.is8230,
  8240 : nvali.is8240,
  8280 : nvali.is8280,
  8300 : nvali.is8300,
  8310 : nvali.is8310,
  8320 : nvali.is8320,
  8330 : nvali.is8330,
  8340 : nvali.is8340,
  8350 : nvali.is8350,
  8400 : nvali.is8400,
  8410 : nvali.is8410,
  8420 : nvali.is8420,
  8430 : nvali.is8430,
  8440 : nvali.is8440,
  8950 : nvali.is8950,
  8990 : nvali.is8990,
};

/** 
 * The object for default client actions
 *
 * Library
 * @private
 */
var alib = {};

alib.act8000 = function(id, dt, bulk, tag) {
  console.log(dt.toUpperCase().replace('T', ', ').replace('Z', '') + '\n' + bulk);
};

alib.act8010 = function(id, dt, bulk, tag) {
  var node = document.createElement("div");
  bulk = lib.htmlspecialchars(bulk);
  
  node.innerHTML = '<div style="margin-bottom:2px;padding:15px;background-color:#cee5fe;color:#000;"><span style="margin-right:20px;color:#000;float:right;font-weight:bold;font-size:30px;line-height:10px;cursor:pointer;" onclick="this.parentElement.style.display=' + "'none'" + ';">&times;</span>' + 
  dt.toUpperCase().replace('T', ', ').replace('Z', '') + '<br>' + bulk + '</div>';
  document.getElementsByTagName("body")[0].insertBefore(node, document.getElementsByTagName("body")[0].firstChild);
};

alib.act8020 = function(id, dt, bulk, tag) {
  var size = "width:600px;height:300px";
  tag = tag.toLowerCase().replace(/[\s]+/g, '').replace(/,/g, ';').replace(/=/g, ':');
  
  if (/^width:\d{2,4}px;height:\d{2,3}px;?$/i.test(tag)) {
    size = tag;
  }
  
  var node = document.createElement("div");
  bulk = lib.htmlspecialchars(bulk);
  
  node.innerHTML = '<div style="margin-bottom:2px;padding:10px;background-color:#cee5fe;color:#000;' + size + 
                   ';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-style:ridge;"><span style="margin-right:1px;color:#000;float:right;font-weight:bold;font-size:30px;line-height:20px;cursor:pointer;" onclick="this.parentElement.style.display=' + "'none'" + ';">&times;</span>' + 
  dt.toUpperCase().replace('T', ', ').replace('Z', '') + '<br>' + bulk + '</div>';
  document.getElementsByTagName("body")[0].insertBefore(node, document.getElementsByTagName("body")[0].firstChild);
};

alib.act8030 = function(id, dt, bulk, tag) {
  var size = "width=600,height=300";
  tag = tag.toLowerCase().replace(/[\s]+|px/ig, '');
  
  if (/^width=\d{2,4},height=\d{2,3}$/i.test(tag)) {
    size = tag;
  }
  
  var pop = window.open('', id, 'menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,' + size);
  bulk = lib.htmlspecialchars(bulk);
    
  pop.document.open();
  pop.document.write(dt.toUpperCase().replace('T', ', ').replace('Z', '') + '<br>' + bulk);
  pop.document.close();
};

alib.act8060 = function(id, dt, bulk, tag) {
  var filename = 'bulk-' + (+new Date(dt)) + ".txt";

  if (tag.length > 0) {
    filename = 'bulk-' + tag + ".txt";
  }
  
  lib.download(filename, bulk);
};

alib.act8070 = function(id, dt, bulk, tag) {
  sessionStorage.setItem('bulk', bulk);
  sessionStorage.setItem('tag', tag);
  sessionStorage.setItem('dt', dt);
};

alib.act8080 = function(id, dt, bulk, tag) {
  sessionStorage.removeItem('bulk');
  sessionStorage.removeItem('tag');
  sessionStorage.removeItem('dt');
};

alib.act8100 = function(id, dt, bulk, tag) {
  window.scrollTo(0, 0);
};

alib.act8110 = function(id, dt, bulk, tag) {
  window.scrollTo(0, document.body.scrollHeight/2);
};

alib.act8120 = function(id, dt, bulk, tag) {
  window.scrollTo(0, document.body.scrollHeight);
};

alib.act8130 = function(id, dt, bulk, tag) {
  bulk = bulk.replace(/\D+/g, '');
  tag = tag.replace(/\D+/g, '');
  
  if (bulk.length > 0 && tag.length > 0)
    window.scrollTo(bulk, tag);
};

alib.act8140 = function(id, dt, bulk, tag) {
  bulk = bulk.replace(/\D+/g, '');
  tag = tag.replace(/\D+/g, '');
  
  if (bulk.length > 0 && tag.length > 0)
    window.scrollBy(bulk, tag);
};

alib.act8200 = function(id, dt, bulk, tag) {
  var els = lib.getElement(bulk);
  
  if (bulk.split('=')[0].trim().toLowerCase() === 'id') {
    lib.setIdStyle(els, tag, 'add');
  } else {
    lib.setStyle(els, tag, 'add');
  }
};

alib.act8210 = function(id, dt, bulk, tag) {
  var els = lib.getElement(bulk);
  
  if (bulk.split('=')[0].trim().toLowerCase() === 'id') {
    lib.setIdStyle(els, tag, 'remove');
  } else {
    lib.setStyle(els, tag, 'remove');
  }
};

alib.act8220 = function(id, dt, bulk, tag) {
  var els = lib.getElement(bulk);
  
  if (bulk.split('=')[0].trim().toLowerCase() === 'id') {
    lib.setIdStyle(els, tag, 'toggle');
  } else {
    lib.setStyle(els, tag, 'toggle');
  }
};

alib.act8230 = function(id, dt, bulk, tag) {
  var els = lib.getElement(bulk);
  
  if (bulk.split('=')[0].trim().toLowerCase() === 'id') {
    lib.setIdStyle(els, tag, 'set');
  } else {
    lib.setStyle(els, tag, 'set');
  }
};

alib.act8240 = function(id, dt, bulk, tag) {
  var els = lib.getElement(bulk);
  
  if (bulk.split('=')[0].trim().toLowerCase() === 'id') {
    lib.setIdStyle(els, tag, 'clear');
  } else {
    lib.setStyle(els, tag, 'clear');
  }
};

alib.act8280 = function(id, dt, bulk, tag) {
  var els = lib.getElement(bulk);
  
  if (bulk.split('=')[0].trim().toLowerCase() === 'id') {
    lib.triggerIdEvent(els, tag);
  } else {
    lib.triggerEvent(els, tag);
  }
};

alib.act8300 = function(id, dt, bulk, tag) {
  var jsurls = bulk.replace(/[\s]+/g, '').split(';');
  
  for (var j = 0; j < jsurls.length - 1; j++) {
    lib.loadScript(jsurls[j]);
  }
  
  var script = lib.loadScript(jsurls[jsurls.length - 1]);
  
  script.onload = function() {
    if (tsseAction) tsseAction(id, dt, bulk, tag);
  };
};

alib.act8310 = function(id, dt, bulk, tag) {
  var jsurls = bulk.replace(/[\s]+/g, '').split(';');

  var scripts = document.getElementsByTagName('script');
  
  for (var i = 0; i < scripts.length; i++) {

    if ( jsurls.indexOf(scripts[i].getAttribute('src')) !== -1 ) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
  }
};

alib.act8320 = function(id, dt, bulk, tag) {
  var cssurls = bulk.replace(/[\s]+/g, '').split(';');
  
  for (var i = 0; i < cssurls.length - 1; i++) {
    lib.loadLink(cssurls[i]);
  }

  var link = lib.loadLink(cssurls[cssurls.length - 1]);

  link.onload = function() {
    if (tsseAction) tsseAction(id, dt, bulk, tag);
  };
};

alib.act8330 = function(id, dt, bulk, tag) {
  var cssurls = bulk.replace(/[\s]+/g, '').split(';');
  
  var links = document.getElementsByTagName('link');
  
  for (var i = 0; i < links.length; i++) {

    if ( cssurls.indexOf(links[i].getAttribute('href')) !== -1 ) {
      links[i].parentNode.removeChild(links[i]);
    }
  }
};

alib.act8340 = function(id, dt, bulk, tag) {
  var cssurls = tag.replace(/[\s]+/g, '').replace(/[\s]+/g, '').split(';');
  var jsurls = bulk.replace(/[\s]+/g, '').replace(/[\s]+/g, '').split(';');
  
  for (var i = 0; i < cssurls.length; i++) {
    lib.loadLink(cssurls[i]);
  }
  
  for (var j = 0; j < jsurls.length - 1; j++) {
    lib.loadScript(jsurls[j]);
  }
  
  var script = lib.loadScript(jsurls[jsurls.length - 1]);
  
  script.onload = function() {
    if (tsseAction) tsseAction(id, dt, bulk, tag);
  };
};

alib.act8350 = function(id, dt, bulk, tag) {
  alib.act8310(id, bulk, '', dt);
  alib.act8330(id, tag, '', dt);
};

alib.act8400 = function(id, dt, bulk, tag) {
  //window.location.href = window.location.href;
  window.location.reload(true);
};

alib.act8410 = function(id, dt, bulk, tag) {
  window.location.href = bulk;
};

alib.act8420 = function(id, dt, bulk, tag) {
  
  if ( sessionStorage.getItem('_notifTab') ) {
    sessionStorage.setItem('_notifTab', sessionStorage.getItem('_notifTab') + 1);
  } else {
    sessionStorage.setItem('_notifTab', '1');
  }
  
  window['notifTab' + sessionStorage.getItem('_notifTab')] = window.open(bulk, '_blank');
};

alib.act8430 = function(id, dt, bulk, tag) { 
 lib.formPost(bulk, tag, '_self');
};

alib.act8440 = function(id, dt, bulk, tag) {  
  lib.formPost(bulk, tag, '_blank');
};

alib.act8950 = function(id, dt, bulk, tag) {
  if ( bulk === '' && sessionStorage.getItem('_notifTab') ) {
    window['notifTab' + sessionStorage.getItem('_notifTab')].close();
  } else if (sessionStorage.getItem('_notifTab') && sessionStorage.getItem('_notifTab') >= bulk) {
    window['notifTab' + bulk].close();
  }
};

/**
 * The object for aids functions
 *
 * Library
 * @private
 */
var lib = {};

lib.htmlspecialchars = function(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/`/g, '&#x60;');
};

lib.formPost = function(url, query, target){
  var form = document.createElement('form');
  form.method = "post";
  form.action = url;
  form.target = target;
  
  var input = null;
  var qrs = query.split('&');
  for (var i = 0; i < qrs.length; i++) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = qrs[i].split('=')[0];
    input.value = qrs[i].split('=')[1];
    form.appendChild(input);
  }
  
  document.body.appendChild(form);
  form.submit();
};

lib.getElement = function(bulk) {
  var el = bulk.split('=')[0].trim().toLowerCase();
  var elVal = bulk.split('=')[1].trim();
  
  if ( el === 'id' ) {
    return document.getElementById(elVal);
  } else if ( el === 'classname' ) {
    return document.getElementsByClassName(elVal);
  } else if ( el === 'name' ) {
    return document.getElementsByName(elVal);
  } else if ( el === 'tagname' ) {
    return document.getElementsByTagName(elVal);
  } else if ( el === 'tagnamens' ) {
    return document.getElementsByTagNameNS(elVal);
  }
};

lib.setIdStyle = function (element, style, method) {
  if (method == 'add') {
    element.classList.add(style);
  } else if (method == 'remove') {
    element.classList.remove(style);
  } else if (method == 'toggle') {
    element.classList.toggle(style);
  } else if (method == 'set') {
    element.style.cssText = style;
  } else if (method == 'clear') {
    element.style.cssText = '';
  }
};

lib.setStyle = function (elements, style, method) {
  var i;

  if (method == 'add') {

    for (i = 0; i < elements.length; i++) {
      elements[i].classList.add(style);
    }
  } else if (method == 'remove') {

    for (i = 0; i < elements.length; i++) {
      elements[i].classList.remove(style);
    }
  } else if (method == 'toggle') {
    
    for (i = 0; i < elements.length; i++) {
      elements[i].classList.toggle(style);
    }
  } else if (method == 'set') {

    for (i = 0; i < elements.length; i++) {
      elements[i].style.cssText = style;
    }
  } else if (method == 'clear') {

    for (i = 0; i < elements.length; i++) {
      elements[i].style.cssText = '';
    }
  }
};

lib.triggerIdEvent = function (element, eventType) {
  element.dispatchEvent( new CustomEvent(eventType) );
};

lib.triggerEvent = function (elements, eventType) {

  for (var i = 0; i < elements.length; i++) {
    elements[i].dispatchEvent( new CustomEvent(eventType) );
  }
};

lib.loadScript = function(url) {
  var script = document.createElement("script");
  
  script.type = "application/javascript";
  script.src = url;
  
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
  
  return script;
};

lib.loadLink = function (url) {
  var link = document.createElement("link");
  
  link.rel = 'stylesheet';
  link.type = "text/css";
  link.href = url;
  
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(link);
  
  return link;
};

lib.download = function(fname, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', fname);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

/** 
 * Base function 
 *
 * @private
 * @license MIT
 */
var tsse = function(version) {
  var connectionPath = "/tsse-connection";
  var ReqtestConnection = "REQUEST-FOR-TSSE-CONNECTION";
  var ReqtestRenew = "REQUEST-FOR-TSSE-RENEW";
  var sharedDataPath = "/tsse-shared-data";
  
  /**
   * Creates a XMLHttpRequest object
   * 
   * @private 
   * @param {string} path  - The url path to the XMLHttpRequest object  
   * @return {object}	  A XMLHttpRequest object
   */
  var xhrObj = function(path) {
    var req = new XMLHttpRequest();
    req.open("POST", path, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
    req.setRequestHeader("X-Requested-With", "Thread-SSE");
    req.timeout = 3000;
    
    return req;
  };
  
  /**
   * Requests to add 25 minutes to the Thread-SSE connection 
   * 
   * @private 
   * @param {string} path  - The url path to the XMLHttpRequest object
   */
  var renewConnection = function() {
    setInterval(function() {
      var req = xhrObj(connectionPath);
      req.send(ReqtestRenew);
      req.onreadystatechange = function() {
        if ( req.readyState == 4 && req.status == 200 ) {
          if (req.responseText.trim() === 'ptk=') {
            console.log(clib.renewMsg);
          }
        }
      };
    }, 1440000);
  };
  
  /**
   * Creates a Tread-SSE client
   * 
   * @private 
   * @param {string} tssePath  - A connection path to Tread-SSE client
   * @param {string} tsseAction  - The function name that runs with Thread-SSE data as arguments
   */
  var tsseClient = function(tssePath, tsseAction) {
    var parseStatus = null;
    var tsseData = null;
    var evtSource = new EventSource(tssePath);
    
    evtSource.onopen = function() {
      console.log(clib.msgOpen);
    };
    
    evtSource.onerror = function() {
      console.log(clib.msgError);
      return false;
    };
    
    evtSource.addEventListener( "tsse-event", 
      function(evt) {
        if ( evt.lastEventId >= "0" && evt.data) {
          
          try {
            parseStatus = JSON.parse(evt.data);
          } catch(e) {
            console.log( clib.dataError );
            parseStatus = null;
          }
          
          tsseData = parseStatus;
          
          if ( tsseData !== null && 
               typeof tsseData.id !== 'undefined' && 
               validation(tsseData.id, tsseData.bulk, tsseData.tag) )
          { 
            
            if (tsseData.id === '8990') {
              evtSource.close();
              console.log(clib.msg8990);
              return true;
            }
            
            if ( tsseData.id > 7999 && tsseData.id < 10000 && alib['act' + tsseData.id] ) {
              // default client actions
              alib['act' + tsseData.id](tsseData.id, tsseData.dt, tsseData.bulk, tsseData.tag);
            } else if (tsseAction) {
              // custom client actions
              tsseAction(tsseData.id, tsseData.dt, tsseData.bulk, tsseData.tag);
            } else {
              console.log(clib.tsseActionError);
            }
            
          } else {
            console.log(clib.dataTypeError);
          }
        }
      }
    );
  };
  
  /**
   * Validates the value of tsseData
   * 
   * @private 
   * @param {string} id - The id between 1000 and 9999 to the value of tsseData
   * @param {string|number|boolean|null} bulk - The item that contains the main content of Thread-SSE data
   * @param {string|number|boolean|null} tag -  The aid item to Thread-SSE data
   * @returun {boolean} true  Validation succeeds, otherwise false 
   */
  var validation = function(id, bulk, tag) {

    if (id > 5999 && id < 7000) {
      if (idToVali[id]) {
        return idToVali[id](bulk) && tag === '';
      } else {
        id = id - 5000;
      }
    }
    
    if (id > 6999 && id < 8000) {
      if ( typeof customVali === 'object' && customVali['is' + id] ) {
        return customVali['is' + id](bulk) && tag === '';
      } else {
        id = id - 5000;
      }
    }

    if ( (id > 999 && id < 2000) && idToVali[id] )
    {
      return idToVali[id](bulk) && tag === '';
    } else if (id > 1999 && id < 3000) {
      
      if ( typeof customVali === 'object' && customVali['is' + id]) {
        return customVali['is' + id](bulk) && tag === '';
      } else {
        console.log(clib.ict + id);
        return false;
      }
    } else if (( (id > 2999 && id < 4000) ||
                 (id > 4999 && id < 5500) ||
                 (id > 7999 && id < 9000) ) &&
               idToVali[id]) 
    {
      return idToVali[id](bulk, tag);
    } else if ( (id > 3999 && id < 5000) ||
                (id > 5499 && id < 6000) ||
                (id > 8999 && id < 10000) ) {
      
      if ( typeof customVali === 'object' && customVali['is' + id]) {
        return customVali['is' + id](bulk, tag);
      } else {
        console.log(clib.ict + id);
        return false;
      }
    } 
    
    return false;
  }
  
  /**
   * Requests a Thread-SSE server-side connection 
   * 
   * @public
   * @param {string} tsseAction  - The function name that runs with Thread-SSE data as arguments
   * @return   false if the request failed
   */
  this.tsseConnection = function ( tsseAction ) {
    if ( !EventSource || !XMLHttpRequest ) {
      console.log(clib.supportError);
      return false;
    }
    
    var req = xhrObj(connectionPath);
    req.send(ReqtestConnection);
    req.onreadystatechange = function() {
      if ( req.readyState == 4 && req.status == 200 ) {
        var pretxt = req.responseText.substr(0, 4);
        var suftxt = req.responseText.substr(4);
        
        if (pretxt === 'ptk=' && suftxt.length === 46) {
          tsseClient(suftxt, tsseAction);
          renewConnection();
        }
      }
    };
    
    req.onerror = function() {
      console.log(clib.tsseConnectionError);
      return false;
    };
  };
  
  /**
   * Sends shared Thread-SSE data to the members of user group
   * 
   * @public
   * @param {string} id - The id between 1000 and 9999 to the value of tsseData
   * @param {string|number|boolean|null} bulk - The item that contains the main content of Thread-SSE data
   * @param {string|number|boolean|null} tag -  The aid item to Thread-SSE data
   * @return false if sending failed, otherwise true
   */
  this.sendSharedTsseData = function (id, bulk, tag) {
    bulk = bulk || '';
    tag = tag || '';
    
    if (id < 6000 || id > 7999) {
      console.log(clib.isd + id);
      return false;
    }
    
    id = id + '';
    
    if ( validateTsseData(id, bulk, tag) ) {
      var tsseData = {};
      tsseData.id = id;
      tsseData.bulk = bulk;
      tsseData.tag = tag;
      var tsseDataStr = "";

      try {
        tsseDataStr = JSON.stringify(tsseData);
      } catch (e) {
        console.log(clib.fcsd);
        return false;
      }
      
      var req = xhrObj(sharedDataPath);
      req.send(tsseDataStr);
      
      req.onerror = function() {
        console.log(clib.fssd);
        return false;
      };      
    } else {
      console.log(clib.itsd);
      return false;
    }
  }
  
  /**
   * Validates the value of tsseData
   * 
   * @public
   * @see validation
   */
  this.validateTsseData = function(id, bulk, tag) {
    bulk = bulk || '';
    tag = tag || '';
    id = id + '';
    
    return validation(id, bulk, tag);
  };
};

/**
 * Create global functions for the client
 * 
 * @public
 */
var tsseObj = new tsse(clib.version);

window.tsseConnection = tsseObj.tsseConnection;
window.sendSharedTsseData = tsseObj.sendSharedTsseData;
window.validateTsseData = tsseObj.validateTsseData;

})();
