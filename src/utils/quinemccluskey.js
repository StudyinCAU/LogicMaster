
import Minterm from "./minterm.js";
import { decToBin, valueIn } from './util.js';


/**
 * A class to handle processing the Quine-McCluskey Algorithm
 */
export default class QuineMcCluskey {

    /**
     * Creates a new QuineMcCluskey object to process the Quine-Mccluskey Algorithm
     */
    constructor(variables, values, dontCares = [], isMaxterm = false) {
        // 预处理输入表达式，替换异或和同或
        this.preprocessVariables(variables);
        values.sort();
        this.variables = variables;
        this.values = values;
        this.allValues = values.concat(dontCares);
        this.allValues.sort();
        this.dontCares = dontCares;
        this.isMaxterm = isMaxterm;
        this.func = null;
        this.func = this.getFunction();
    }
    
    // 添加预处理函数
    preprocessVariables(variables) {
        for (let i = 0; i < variables.length; i++) {
            if (variables[i].includes("⊕")) {
                // 将异或转换为 (A ⋀ ¬B) ⋁ (¬A ⋀ B)
                variables[i] = variables[i].replace("⊕", "(A⋀¬B)⋁(¬A⋀B)");
            }
            if (variables[i].includes("≡")) {
                // 将同或转换为 (A ⋀ B) ⋁ (¬A ⋀ ¬B)
                variables[i] = variables[i].replace("≡", "(A⋀B)⋁(¬A⋀¬B)");
            }
        }
    }
    

    // Helper Methods

    /**
     * Returns the binary value equivalent to the decimal value given
     */
    getBits(value) {
        let s = (value >>> 0).toString(2);
        for (let i = s.length; i < this.variables.length; i++)
            s = "0" + s;
        return s;
    }

    // Grouping Methods

    /**
     * Creates the initial grouping for the bits from the values
     * given to the Quine-McCluskey Algorithm
     */
    initialGroup() {

        // Keep track of groups by 2-dimensional array
        let groups = [];
        for (let i = 0; i < this.variables.length + 1; i++) {
            groups.push([]);
        }

        // Iterate through values
        for (const value of this.allValues) {

            // Count number of 1's in value's bit equivalent
            let count = 0;
            let bits = this.getBits(value);
            for (const bit of bits) {
                if (bit == "1") {
                    count += 1;
                }
            }

            // Add count to proper group
            groups[count].push(new Minterm([value], bits));
        }

        return groups;
    }

    /**
     * Creates a power set of all valid prime implicants that covers the rest of an expression.
     * This is used after the essential prime implicants have been found.
     */
    powerSet(values, primeImplicants) {

        // Get the power set of all the prime implicants
        let powerset = [];

        // Iterate through decimal values from 1 to 2 ** size - 1
        for (let i = 1; i < 2 ** primeImplicants.length - 1; i++) {
            let currentset = [];

            // Get the binary value of the decimal value
            let binValue = decToBin(i);
            for (let j = binValue.length; j < primeImplicants.length; j++) {
                binValue = "0" + binValue;
            }

            // Find which indexes have 1 in the binValue string
            for (let j = 0; j < binValue.length; j++) {
                if (binValue.charAt(j) == "1") {
                    currentset.push(primeImplicants[j]);
                }
            }
            powerset.push(currentset);
        }

        // Remove all subsets that do not cover the rest of the implicants
        let newpowerset = [];
        for (const subset of powerset) {

            // Get all the values the set covers
            let tempValues = [];
            for (const implicant of subset) {
                for (const value of implicant.getValues()) {
                    if (!valueIn(value, tempValues) && valueIn(value, values)) {
                        tempValues.push(value);
                    }
                }
            }
            tempValues.sort(function(number1, number2) {return number1 > number2;});

            // Check if this subset covers the rest of the values
            if (tempValues.length == values.length &&
                tempValues.every(function(u, i) {return u === values[i]})) {
                newpowerset.push(subset);
            }
        }
        powerset = newpowerset;

        // Find the minimum amount of implicants that can cover the expression
        let minSet = powerset[0];
        for (const subset of powerset) {
            if (subset.length < minSet.length) {
                minSet = subset;
            }
        }

        if (minSet == undefined) {
            return [];
        }
        return minSet;
    }

    // Compare Methods

    /**
     * Returns an array of all the prime implicants for an expression
     */
    getPrimeImplicants(groups = null) {

        // Get initial group if group is null
        if (groups === null) {
            groups = this.initialGroup();
        }

        // If there is only 1 group, return all the minterms in it
        if (groups.length == 1) {
            return groups[0];
        }

        // Try comparing the rest
        else {
            let unused = [];
            let comparisons = [...Array(groups.length - 1).keys()];
            let newGroups = [];
            for (let i of comparisons) {
                newGroups.push([]);
            }

            // Compare each adjacent group
            for (const compare of comparisons) {
                let group1 = groups[compare];
                let group2 = groups[compare + 1];

                // Compare every term in group1 with every term in group2
                for (const term1 of group1) {
                    for (const term2 of group2) {

                        // Try combining it
                        let term3 = term1.combine(term2);

                        // Only add it to the new group if term3 is not null
                        //  term3 will only be null if term1 and term2 could not
                        //  be combined
                        if (term3 !== null) {
                            term1.use();
                            term2.use();
                            if (!valueIn(term3, newGroups[compare])) {
                                newGroups[compare].push(term3);
                            }
                        }
                    }
                }
            }

            // Get array of all unused minterms
            for (const group of groups) {
                for (const term of group) {
                    if (!term.isUsed() && !valueIn(term, unused)) {
                        unused.push(term);
                    }
                }
            }

            // Add recursive call
            for (const term of this.getPrimeImplicants(newGroups)) {
                if (!term.isUsed() && !valueIn(term, unused)) {
                    unused.push(term);
                }
            }

            return unused;
        }
    }

    // Solving Methods

    /**
     * Solves for the expression returning the minimal amount of prime implicants needed
     * to cover the expression.
     */
    solve() {

        // 获取 prime implicants
        let primeImplicants = this.getPrimeImplicants();
    
        // 保留 essential prime implicants
        let essentialPrimeImplicants = [];
        let valuesUsed = Array(this.values.length).fill(false);
    
        // 遍历所有值，找到只能由一个 prime implicant 覆盖的 essential prime implicants
        for (let i = 0; i < this.values.length; i++) {
            let value = this.values[i];
    
            // 检查哪些 prime implicants 覆盖当前的值
            let uses = 0;
            let last = null;
            for (const minterm of primeImplicants) {
                if (valueIn(value, minterm.getValues())) {
                    uses += 1;
                    last = minterm;
                }
            }
            
            // 如果该值只能由一个 implicant 覆盖，加入 essential implicants
            if (uses === 1 && last && !valueIn(last, essentialPrimeImplicants)) {
                for (const v of last.getValues()) {
                    if (!valueIn(v, this.dontCares)) {
                        let idx = this.values.indexOf(v);
                        if (idx !== -1) valuesUsed[idx] = true;
                    }
                }
                essentialPrimeImplicants.push(last);
            }
        }
    
        // 如果所有值都已覆盖，直接返回 essential implicants
        if (valuesUsed.every(Boolean)) {
            return essentialPrimeImplicants;
        }
    
        // 剩余未覆盖的值
        let remainingValues = this.values.filter((_, i) => !valuesUsed[i]);
        
        // 筛选 prime implicants，找到能覆盖剩余值的
        let remainingImplicants = primeImplicants.filter(implicant =>
            implicant.getValues().some(value => remainingValues.includes(value))
        );
    
        // 创建 powerset，并找到最优组合
        let additionalImplicants = this.powerSet(remainingValues, remainingImplicants);
    
        return essentialPrimeImplicants.concat(additionalImplicants);
    }
    

    /**
     * Returns the expression in a readable form
     */
/**
 * Returns the expression in a readable form
 */
    getFunction() {
        // 如果已经生成过表达式，直接返回
        if (this.func != null) {
            return this.func;
        }

        // 获取求解后的最小项
        let primeImplicants = this.solve();

        // 检查是否没有 implicant，返回 0
        if (primeImplicants.length === 0) {
            return "0";
        }

        let result = [];

        // 遍历所有 prime implicant
        for (let i = 0; i < primeImplicants.length; i++) {
            let implicant = primeImplicants[i];
            let implicantResult = [];

            // 遍历 implicant 中的每个变量位
            for (let j = 0; j < implicant.getValue().length; j++) {
                const bit = implicant.getValue().charAt(j);

                if (bit === "1") {
                    implicantResult.push(this.variables[j]); // 正常变量
                } else if (bit === "0") {
                    implicantResult.push(`¬${this.variables[j]}`); // 取反变量
                }
            }

            // 将拼接后的 implicant 加入到结果数组中
            if (implicantResult.length > 0) {
                result.push(implicantResult.join("⋀")); // 用 AND 连接每个最小项
            }
        }

        // 用 OR 连接所有 implicants，返回最终表达式
        return result.length > 0 ? result.join(" ⋁ ") : "1";
    }

}
