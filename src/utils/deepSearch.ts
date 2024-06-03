/* Источник: https://gist.github.com/YagoLopez/1c2fe87d255fc64d5f1bf6a920b67484 */

//return an array of objects according to key, value, or key and value matching
export function getObjects(obj, key, val, options = { strict: true }) {
    const strict = (i) => i === key && obj[i] === val || i === key && val === ''
    const soft = (i) => i === key && String(obj[i]).toLowerCase().includes(String(val).toLowerCase()) || i === key && val === ''
    const searchCondition = (i) => options.strict ? strict(i) : soft(i)

    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val, { strict: options.strict }));
        } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (searchCondition(i)) { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

//return an array of values that match on a certain key
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}
