/**
 * The constants used by the validation methods
 * 
 */
const uriPattern = /^(ftp:|ftps:|ws:|wss:|http:|https:|file:)?(\/\/)(?:\S+(?::\S*)@)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+=]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
const emailPattern = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
const relativeUriPattern = /^((\.\.\/)*|(\/)?)([-a-z\d%_.~+=]+)(\/[-a-z\d%_.~+=]*)+(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i;
const countryPattern = "AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW";

/**
 * A static class that defines validation methods to Thread-SSE data
 * 
 */
class nvali {
  static isString(val) {
    return typeof val === "string";
  }
  
  static isNumberString(val) {
    return typeof val === "string" &&
           !isNaN(val) && 
           val == +val;
  }
  
  static isFloatString(val) {
    return typeof val === "string" &&
           nvali.isFloat(+val);
  }
  
  static isFractionString(val) {
    return typeof val === "string" &&
           /^[1-9][0-9]*\/[1-9][0-9]*$/.test(val);
  }
  
  static isIntegerString(val) {
    return typeof val === "string" &&
           nvali.isInteger(+val);
  }

  static isNonEmptyString(val) {
    return typeof val === "string" &&
           val.length > 0;
  }

  static isEmptyString(val) {
    return typeof val === "string" &&
           val.length == 0;
  }

  static isHexString(val) {
    return typeof val === "string" &&
           /^-?0x[0-9a-f]+$/i.test(val);
  }

  static isOctalString(val) {
    return typeof val === "string" &&
           /^(-?0[0-7]+ ?)+$/.test(val);
  }
  
  static isBinaryString(val) {
    if (typeof val === "string") {
      for (var i = 0; i < val.length; i++) {
        if (val[i] !== "0" && val[i] !== "1") return false;
      }
      return true;
    }
    return false;
  }

  static isUri(val) {    
    return typeof val === "string" && uriPattern.test(val);
  }

  static isRelativeUri(val) {    
    return typeof val === "string" && relativeUriPattern.test(val);
  }
  
  static isUriProtocol(val) {
    var pattern = /^(ftp|ftps|ws|wss|http|https|file|mailto|data|irc)$/i;
    return typeof val === "string" && pattern.test(val);
  }
  
  static isDomain(val) {
    var pattern = /^(([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})$/i;
    return typeof val === "string" && pattern.test(val);
  }

  static isIpv4(val) {
    return typeof val === "string" && ipv4Pattern.test(val);
  }

  static isIpv6(val) {
    var pattern = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
    return typeof val === "string" && pattern.test(val);
  }

  static isPort(val) {
    var pattern = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/i;
    return typeof val === "string" && pattern.test(val);
  }
  
  static isUserinfo(val) {
    var pattern = /^(?:\S+(?::\S*)?)$/i;
    return typeof val === "string" && pattern.test(val);
  }
  
  static isPath(val) {
    var pattern = /^(\/?[-a-z\d%_.~+=]*)*$/i;
    return typeof val === "string" && pattern.test(val);
  }
  
  static isQuery(val) {
    var pattern = /^(\?[;&a-z\d%_.~+=-]*)?$/i;
    return typeof val === "string" && pattern.test(val);
  }

  static isFragment(val) {
    var pattern = /^(\#[-a-z\d_]*)?$/i;
    return typeof val === "string" && pattern.test(val);
  }

  static isEmail(val) {    
    return typeof val === "string" && emailPattern.test(val);
  }

  static isLocalPart(val) {
    var pattern = /^(?=.{1,64}$)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*$/;
    return typeof val === "string" && pattern.test(val);
  }

  static isLanguage(val) {
    return typeof val === "string" &&
           /^[a-z]{2,3}(?:-[A-Z]{2,3}(?:-[a-zA-Z]{4})?)?$/.test(val);
  }
  
  static isCountry(val) {
    return typeof val === "string" && 
           countryPattern.split("|").indexOf(val.trim().toUpperCase()) !== -1;
  }
  
  static isRegExp(val) {
    return val instanceof RegExp &&
           Object.prototype.toString.call(val).slice(8, -1) === 'RegExp';
  }

  static isRegExpString(val) {
    return typeof val === "string" && 
           nvali.isRegExp(new RegExp(val));
  }
  
  static isUuid(val) {
    var pattern = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$/;
    return typeof val === "string" && pattern.test(val);
  }

  static isAsciiString(val) {
    return typeof val === "string" && /^[\x00-\xFF]+$/.test(val);
  }
  
  static isUnicodeString(val) {
    return typeof val === "string" && /^[\u0000-\u10FFFF]+$/.test(val);
  }
  
  static isDateTime(val) {
    return typeof val === "string" &&
           /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([0-1][0-9]|2[0-4]):([0-5][0-9]):[0-5][0-9](\.\d{3})?Z$/i.test(val);
  }
  
  static isDate(val) {
    return typeof val === "string" &&
           /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(val);
  }
  
  static isTime(val) {
    return typeof val === "string" &&
           /^([0-1][0-9]|2[0-4]):([0-5][0-9]):[0-5][0-9](.\d{3})?$/.test(val);
  }

  static isYear(val) {
    return typeof val === "string" &&
           /^[012]\d{3}$/.test(val);
  }

  static isMonth(val) {
    return typeof val === "string" &&
           /^(0[1-9]|1[012])$/.test(val);
  }

  static isDay(val) {
    return typeof val === "string" &&
           /^(0[1-9]|[12][0-9]|3[01])$/.test(val);
  }

  static isHour(val) {
    return typeof val === "string" &&
           /^(0[1-9]|1[0-9]|2[01234])$/.test(val);
  }
  
  static isMinute(val) {
    return typeof val === "string" &&
           /^([0-5][0-9])$/.test(val);
  }

  static isSecond(val) {
    return typeof val === "string" &&
           /^([0-5][0-9](\.\d{3})?)$/.test(val);
  }

  static isMillisecond(val) {
    return typeof val === "string" && 
           +val > 0;
  }
  
  static isCssString(val) {
    return typeof val === "string" && 
           /^(?:\s*[\S ]+\s*{[^}]*})+$/.test(val);
  }

  static isCssSelector(val) {
    return typeof val === "string" && 
           /^\s*[\S ]+\s*$/.test(val);
  }

  static isCssDeclaration(val) {
    return typeof val === "string" && 
           /^\{[^}]+}$/.test(val);
  }
  
  static isWebColor(val) {
    return typeof val === "string" && 
           /^(#([a-f0-9]{3}){1,2})|(rgb(a)?\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\))$/i.test(val);
  }

  static isNumber(val) {
    return typeof val === "number" && 
           !isNaN(val);
  }

  static isPositiveNumber(val) {
    return typeof val === "number" &&
           val > 0;
  }
  
  static isNegativeNumber(val) {
    return typeof val === "number" &&
           val < 0;
  }
  
  static isFloat(val) {
    return typeof val === "number" &&
           val % 1 !== 0;
  }

  static isPositiveFloat(val) {
    return typeof val === "number" &&
           val % 1 !== 0 &&
           val > 0;
  }

  static isNegativeFloat(val) {
    return typeof val === "number" &&
           val % 1 !== 0 &&
           val < 0;
  }

  static isInteger(val) {
    return typeof val === "number" &&
           Number.isInteger(val);
  }

  static isPositiveInteger(val) {
    return typeof val === "number" &&
           Number.isInteger(val) &&
           val > 0;
  }
  
  static isNegativeInteger(val) {
    return typeof val === "number" &&
           Number.isInteger(val) &&
           val < 0;
  }

  static isZero(val) {
    return typeof val === "number" &&
           Number.isInteger(val) &&
           val === 0;
  }

  static isTrue(val) {
    return typeof val === "boolean" &&
           val === true;
  }

  static isFalse(val) {
    return typeof val === "boolean" &&
           val === false;
  }

  static isNull(val) {
    return val === null;
  }
  
  static isArray(val, tag) {
    return Array.isArray(val) && 
           typeof tag === "string";
  }

  static isStringArray(val, tag) {
    return Array.isArray(val) && 
           val.every( i => (typeof i === "string") ) &&
           typeof tag === "string";
  }

  static isNumberArray(val, tag) {
    return Array.isArray(val) && 
           val.every( i => nvali.isNumber(i) ) &&
           typeof tag === "string";
  }
  
  static isIntegerArray(val, tag) {
    return Array.isArray(val) && 
           val.every( i => nvali.isInteger(i) ) &&
           typeof tag === "string";
  }

  static isIntegerRangeArray(val, tag) {
    return nvali.isIntegerArray(val, tag);
  }
  
  static isEmptyArray(val, tag) {
    return Array.isArray(val) && 
           val.length === 0 &&
           typeof tag === "string";
  }
  
  static isJsonObject(val, tag) {
    return nvali.isJson(val) && typeof tag === "string";
  }
  
  static isEmptyObject(val, tag) {

    if ( nvali.isObject(val) && typeof tag === "string" ) {

      for (var key in val) {
        
        if (val.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    }    
    return false;
  }
  
  static isSerializedOthers(val, tag) {
    return typeof val === "string" &&
           val.length > 0 &&
           typeof tag === "string" &&
           tag.length > 0;
  }

  static isOthers(val) {
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
  }  
  
  static isTrace(val, tag) {
    return typeof val === "string" && 
           val.length > 0 &&
           typeof tag === "string";
  }

  static isDebug(val, tag) {
    return typeof val === "string" && 
           val.length > 0 &&
           typeof tag === "string";
  }
  
  static isNotice(val, tag) {
    return typeof val === "string" && 
           val.length > 0 &&
           typeof tag === "string";
  }

  static isWarn(val, tag) {
    return typeof val === "string" && 
           val.length > 0 &&
           typeof tag === "string";
  }

  static isError(val, tag) {
    return typeof val === "string" && 
           val.length > 0 &&
           typeof tag === "string";
  }

  static isFatal(val, tag) {
    return typeof val === "string" && 
           val.length > 0 &&
           typeof tag === "string"; 
  }
  
  static isAlert(val, tag) {
    return typeof val === "string" && 
           val.length > 0 &&
           typeof tag === "string";
  }

  static isEmerg(val, tag) {
    return typeof val === "string" && 
           val.length > 0 &&
           typeof tag === "string";
  }
  
  static isNormalizedString(val, tag) {
    return typeof val === "string" &&
           val.replace(/[\t\r\n]/g, "") == val &&
           typeof tag === "string";
  }
  
  static isText(val, tag) {
    return typeof val === "string" && 
          val.length > 64000 &&
          typeof tag === "string";
  }
  
  static isBlob(val, tag) {
    return typeof val === "string" && 
          val.length > 64000 &&
          typeof tag === "string";
  }
  
  static isDataUrl(val, tag) {
    return typeof val === "string" && 
           /^\s*data:\S*(;base64)?,\S+$/i.test(val) &&
           typeof tag === "string";
  }
  
  static isSimpePassword(val, tag) {
    var pattern = /^(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/;
    return typeof val === "string" && 
           pattern.test(val) &&
           typeof tag === "string";
  }

  static isComplicatedPassword(val, tag) {
    var pattern = /^(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}$/;
    return typeof val === "string" && 
           pattern.test(val) &&
           typeof tag === "string";
  }
  
  static isPattern(val, tag) {
    //var pattern = new RegExp(val);
    var pattern = new Function('return ' + val)();
    return typeof val === "string" && 
           typeof tag === "string" &&
           pattern.test(tag);
  }
  
  static isEncoding(val, tag) {
    return typeof val === "string" && 
           val.length > 0 &&
           typeof tag === "string";
  }
  
  static isEncryption(val, tag) {
    return nvali.isEncoding(val, tag);
  }

  static isHash(val, tag) {
    return nvali.isEncoding(val, tag);
  }

  static isSalt(val, tag) {
    return nvali.isEncoding(val, tag);
  }
  
  static is8000(val, tag) {
    return typeof val === "string" && 
           val.length > 0 && 
           tag === '';
  }
  
  static is8010(val, tag) {
    return typeof val === "string" && 
           val.length > 0 && 
           tag === '';
  }
  
  static is8020(val, tag) {
    return typeof val === "string" && 
           val.length > 0 && 
           typeof val === "string";
  }
  
  static is8030(val, tag) {
    return typeof val === "string" && 
           val.length > 0 && 
           typeof val === "string";
  }
  
  static is8060(val, tag) {
    return typeof val === "string" && 
           val.length > 0 && 
           typeof tag === "string";
  }

  static is8070(val, tag) {
    return typeof val === "string" && 
           val.length > 0 && 
           typeof tag === "string" && 
           tag.length > 0;
  }
  
  static is8080(val, tag) {
    return val === '' && 
           tag === '';
  }
  
  static is8100(val, tag) {
    return val === '' && 
           tag === '';
  }

  static is8110(val, tag) {
    return val === '' && 
           tag === '';
  }

  static is8120(val, tag) {
    return val === '' && 
           tag === '';
  }
    
  static is8130(val, tag) {
    return nvali.isPositiveInteger(val) &&
           nvali.isPositiveInteger(tag);
  }
  
  static is8140(val, tag) {
      return nvali.is8130(val, tag);
  }
  
  static is8200(val, tag) {
    var pattern = /^(id|classname|name|tagname|tagnamens)$/i;
    return typeof val === "string" && 
           pattern.test(val.split('=')[0]) && 
           typeof tag === "string" &&
           tag.length > 0;
  }
  
  static is8210(val, tag) {
    return nvali.is8200(val, tag);
  }
  
  static is8220(val, tag) {
    return nvali.is8200(val, tag);
  }

  static is8230(val, tag) {
    return nvali.is8200(val, tag);
  }

  static is8240(val, tag) {
    return nvali.is8200(val, tag);
  }

  static is8280(val, tag) {
    return nvali.is8200(val, tag);
  }
  
  static is8300(val, tag) {
    if ( typeof val === "string" && ( tag === '' || nvali.isJson(tag) ) ) {
      var vals = val.replace(/[\s]+/g, '').split(';');      
      return vals.every( function(i) { return (uriPattern.test(i) || relativeUriPattern.test(i)); } );
    }
    return false;
  }
  
  static is8310(val, tag) {
    if (typeof val === "string" && tag === '') {
      var vals = val.replace(/[\s]+/g, '').split(';');      
      return vals.every( function(i) { return (uriPattern.test(i) || relativeUriPattern.test(i)); } );
    }
    return false;
  }

  static is8320(val, tag) {
    return nvali.is8300(val, tag);
  }
  
  static is8330(val, tag) {
    return nvali.is8310(val, tag);
  }
  
  static is8340(val, tag) {
    if (typeof val === "string" && typeof tag === "string") {
      var vals = val.replace(/[\s]+/g, '').split(';');
      var tags = tag.replace(/[\s]+/g, '').split(';');
      var urls = vals.concat(tags);      
      return urls.every( function(i) { return (uriPattern.test(i) || relativeUriPattern.test(i)); } );
    }
    return false;
  }

  static is8350(val, tag) {
    return nvali.is8340(val, tag);
  }
  
  static is8400(val, tag) {
    return val === '' && tag === '';
  }
  
  static is8410(val, tag) {
    return nvali.is8310(val, tag);
  }
  
  static is8420(val, tag) {
    return nvali.is8310(val, tag);
  }

  static is8430(val, tag) {
    return typeof val === "string" && 
           (uriPattern.test(val) || relativeUriPattern.test(val)) &&
           /^([\w\.\+%~-]+=[\w\.\+%~-]+&?)+$/g.test(tag);
  }

  static is8440(val, tag) {
    return nvali.is8430(val, tag);
  }
  
  static is8950(val, tag) {
    return (val === '' || typeof +val === "number" &&  Number.isInteger(+val) && +val > 0) && tag === '';
  }
  
  static is8990(val, tag) {
    return val === '' && 
           tag === '';
  }

  static isObject(val) {
    return typeof val === 'object' && 
           Object.prototype.toString.call(val).slice(8, -1) === 'Object';
  }
  
  static isJson(val) {

    if ( nvali.isObject(val) ) {
      try {
        JSON.stringify(val);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
}

/**
 * The object that maps tsseData id to the validation function
 * 
 */
const idToVali = {
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
 * Validates the value of tsseData
 * 
 * @param {string} id - The id between 1000 and 9999 to the value of tsseData
 * @param {string|number|boolean|null|array|json|others} bulk -
                        The item that contains the main content of Thread-SSE data
 * @param {string|number|boolean|null|array|json|others} tag - 
                        The aid item to Thread-SSE data
 */
function validateTsseData(id, bulk = '', tag = '') {
  id = id + '';
   
  if (id > 5999 && id < 7000) {
    if (idToVali[id]) {
      return idToVali[id](bulk) && tag === '';
    } else {
      id = id - 5000;
    }
  }
  
  if (id > 6999 && id < 8000) {
    if ( typeof customVali === 'function' && customVali['is' + id] ) {
      return customVali['is' + id](bulk) && tag === '';
    } else {
      id = id - 5000;
    }
  }
  
  if ( (id > 999 && id < 2000) && idToVali[id] ) 
  { 
    return idToVali[id](bulk) && tag === '';
  } else if (id > 1999 && id < 3000) {
    
    if ( typeof customVali === 'function' && customVali['is' + id] ) {
      return customVali['is' + id](bulk) && tag === '';
    } else {
      console.log("Invalid customVali to " + id);
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
    
    if ( typeof customVali === 'function' && customVali['is' + id]) {
      return customVali['is' + id](bulk, tag);
    } else {
      console.log("Invalid customVali to " + id);
      return false;
    }
  }
  
  return false;
}

/**
 * Module exports
 * @public
 */
module.exports.validateTsseData = validateTsseData;
module.exports.nvali = nvali;
