### Thread-SSE complicate data and examples
------------

| id | &nbsp;&nbsp;&nbsp;bulk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | tag | Example |
|-------|-------|---------|--------|
| 3000 | Mixture array, element types are string, number, boolean, null, array and JSON object | "array" | [-6.67, "x", null, "y", 100, true, [], {}, "b"] |
| 3002 | String array | "array" | ["a", "b", "5.1", "x", "-10"] |
| 3004 | Number array | "array" | [2.34, 5, -6.67, 10.28] |
| 3006 | Integer array | "array" | [8, 4, 3, 2, 10, 15] |
| 3008 | Integer range array | "array" | "6, 20, 2" |
| 3010 | Empty array | "array" | [] |
| 3100 | JSON object | "json" | {"city": "New York", "name": "Jonesy Band", "education": "No College", "age": 16} |
| 3110 | Empty object | "json" | {} |
| 3200 | Others object, all data types except string, number, boolean, null, array and JSON object Thread-SSE automatically convert  this object into a string before sending data via network | The value of object.constructor.name. toLowerCase() | new Map( [ ["a", -10], ["b", 5.1] ] ) |
| 3300 | Trace exception message | "trace" |  |
| 3310 | Debug exception message | "debug" |  |
| 3320 | Info exception message | "info" |  |
| 3330 | Notice exception message | "notice" |  |
| 3340 | Warn exception message | "warn" |  |
| 3350 | Error exception message | "error" |  |
| 3360 | Fatal exception message | "fatal" |  |
| 3370 | Alert exception message | "alert" |  |
| 3380 | Emerg exception message | "emerg" |  |
| 3400 | Normalized string | "normalization" | "She sells sea shells by the sea shore. The shells she sells are surely seashells." |
| 3410 | Text, length more than 64000bytes | "text" |  |
| 3420 | Blob, length more than 64000bytes | "blob" |  |
| 3430 | Data URL, a string with the format: [<media type>][;base64],<data> | "data url" | "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAA AAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" |
| 3450 | Simple password with 1 lowercase letter, 1 uppercase letter, 1 number, and be at least 8 characters long | "simple password" | "QVtP2fwKNw59" |
| 3460 | Complicate password with 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long | "complicate password" | "p3P*f$9&=S-rT()" |
| 3500 | Regular expression string, all '\' in the string have to be escaped. | A string that matches the regular expression, e.g. "(647) 823-7580" | "/^((\\(\\d{3}\\) ?)|(\\d{3}-))?\\d{3}-\\d{4}$/" |
| 3530 | Encoded string | The name of encoding | "https%3A%2F%2Favatars2.githubusercontent.com%2Fu%2F18145628%3Fs%3D400 %26u%3Dd9b9f7b81ba63e045478001da75f576927bfaf23%26v%3D4", "url encoding" |
| 3540 | Encrypted string | The name of encryption |  |
| 3550 | Hash code | The name of hash method | "fdd1fc91732d46de9ba3a604c5fdffc7", "md5" |
| 3560 | Salt code | The name of salt or an empty string | "de581449385caeecdea8bbc02ce49c4f:f516dfb84b9051ed85b89cdc3a8ab7f5", "md5 salted" |

System automatically fills the value of tag for data id between 3000 and 3510, don't need to assign tag argument at updateTsseData for data id between 3000 and 3510.

[**⛪ Go to Thread-SSE documentation**](./document.md "Thread-SSE documentation")
