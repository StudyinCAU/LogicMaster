import Minterm from "./minterm.js";  // 使用 import 引入 Minterm

/**
 * Converts a value from decimal to binary
 * 
 * @param value The value to convert to binary
 */
function decToBin(value) {
    return (value >>> 0).toString(2);
}

/**
 * Returns whether or not a value is in an array
 * 
 * @param value The value to look for in an array
 * @param array The array to look for a value in
 */
function valueIn(value, array) {
    for (const compare of array) {
        if (compare == value) {
            return true;
        }

        if (value instanceof Minterm) {
            if (compare.equals(value)) {
                return true;
            }
        }
    }
    return false;
}

export { decToBin, valueIn };  // 使用 export 导出方法
