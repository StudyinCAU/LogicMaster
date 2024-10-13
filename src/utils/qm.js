// 判断两个最小项是否只有一个不同的比特
function differByOneBit(m1, m2) {
    let count = 0;
    for (let i = 0; i < m1.length; i++) {
        if (m1[i] !== m2[i]) count++;
    }
    return count === 1;
}

// 合并两个最小项
function combineMinterms(m1, m2) {
    return m1.split('').map((bit, i) => (bit === m2[i] ? bit : '-')).join('');
}

// 判断一个最小项是否被一个覆盖项覆盖
function isCovered(minterm, implicant) {
    return minterm.split('').every((bit, i) => implicant[i] === '-' || bit === implicant[i]);
}

// QM算法实现
// QM算法实现
export function quineMcCluskey(minterms, numVars) {
    const binMinterms = minterms.map(m => m.toString(2).padStart(numVars, '0'));
    let groups = {};  // 用于存储按1的数量分组的最小项

    // 将最小项按照1的数量进行分组
    binMinterms.forEach(m => {
        const ones = (m.match(/1/g) || []).length;
        if (!groups[ones]) groups[ones] = [];
        groups[ones].push(m);
    });

    let primes = new Set();
    let used = new Set();
    let nextGroups = {};
    const keys = Object.keys(groups);

    let hasCombined = true;  // 标记是否继续合并

    // 开始循环合并直到没有新的合并
    while (hasCombined) {
        hasCombined = false;
        nextGroups = {};  // 清空下一轮的组

        for (let i = 0; i < keys.length - 1; i++) {
            // 确保下一个 group 存在并且可迭代
            if (!groups[keys[i + 1]]) continue;

            for (const m1 of groups[keys[i]]) {
                for (const m2 of groups[keys[i + 1]]) {
                    if (differByOneBit(m1, m2)) {
                        const combined = combineMinterms(m1, m2);
                        const ones = (combined.match(/1/g) || []).length;

                        if (!nextGroups[ones]) nextGroups[ones] = [];
                        if (!nextGroups[ones].includes(combined)) {
                            nextGroups[ones].push(combined);
                        }

                        primes.add(combined);
                        used.add(m1);
                        used.add(m2);
                        hasCombined = true;  // 记录存在合并
                    }
                }
            }
        }

        // 将未合并的最小项添加到素蕴涵项
        const uncombined = binMinterms.filter(m => !used.has(m));
        uncombined.forEach(m => primes.add(m));

        // 更新当前的分组为下一轮的分组
        groups = nextGroups;
    }

    // 找到必要的素蕴涵项
    const essential = [];
    binMinterms.forEach(m => {
        const coverage = [...primes].filter(p => isCovered(m, p));
        if (coverage.length === 1) essential.push(coverage[0]);
    });

    return essential.length > 0 ? essential : [...primes];  // 返回必要素蕴涵项或所有素蕴涵项
}




// 将简化后的最小项转换为可读表达式
export function convertToReadableExpression(minterm, variables) {
    const terms = minterm.split('').map((bit, i) => {
        if (bit === '-') return ''; // 对于 '-' 跳过对应变量
        return bit === '1' ? variables[i] : variables[i] + "'"; // '1' 对应变量，'0' 对应变量的取反
    }).filter(Boolean);

    // 去除重复的变量
    const uniqueTerms = [...new Set(terms)];

    return uniqueTerms.join('⋀'); // 连接保留的变量，并用 ⋀ 表示逻辑与
}



