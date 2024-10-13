/**
 * A class to hold information about a minterm when using the Quine-McCluskey Algorithm
 */
export default class Minterm {

    /**
     * Creates a new minterm object
     */
    constructor(values, value) {
        this.values = values;
        this.value = value;
        this.used = false;

        this.values.sort(function(number1, number2) {return number1 > number2;});
    }

    /**
     * Returns a String representation of the Minterm
     */
    toString() {
        let values = this.values.join(", ");
        return `m(${values}) = ${this.value}`;
    }

    /**
     * Determines if this Minterm object is equal to another object
     */
    equals(minterm) {

        if (!(minterm instanceof Minterm)) {
            return false;
        }

        return (
            this.value == minterm.value &&
            this.values.length == minterm.values.length &&
            this.values.every(function(u,i) {return u === minterm.values[i]})
        );
    }

    /**
     * Returns the values in this Minterm
     */
    getValues() {
        return this.values;
    }

    /**
     * Returns the binary value of this Minterm
     */
    getValue() {
        return this.value;
    }

    /**
     * Returns whether or not this Minterm has been used
     */
    isUsed() {
        return this.used;
    }

    /**
     * Labels this Minterm as "used"
     */
    use() {
        this.used = true;
    }
    
    /**
     * Combines 2 Minterms together if they can be combined
     */
    combine(minterm) {
        let diff = 0;
        let result = "";
    
        for (let i = 0; i < this.value.length; i++) {
            if (this.value.charAt(i) !== minterm.value.charAt(i)) {
                diff++;
                result += "-"; // 不同的位置使用 don't care
            } else {
                result += this.value.charAt(i);
            }
    
            // 如果 diff 超过 1，返回 null 表示无法合并
            if (diff > 1) {
                return null;
            }
        }
    
        return new Minterm(this.values.concat(minterm.values), result);
    }
    
}
