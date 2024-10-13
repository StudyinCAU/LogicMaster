grammar Logic;

prog: expr | EOF;

expr:
    op = REVERSE expr                             # Reverse
    | expr op = CONJUNCTION expr                  # Conjunction
    | expr op = DISJUNCTION expr                  # Disjunction
    | <assoc = right> expr op = IMPLICATION expr  # Implication
    | expr op = EQUIVALENCE expr                  # Equivalence
    | expr op = XOR expr                          # Xor
    | expr op = XNOR expr                         # Xnor
    | VAR                                         # Variable
    | LEFT_PAR expr RIGHT_PAR                     # Par;

LEFT_PAR: '(';
RIGHT_PAR: ')';
VAR: [a-zA-Z]+([0-9]+)?;
REVERSE: '\u00AC';         // ¬
CONJUNCTION: '\u22C0';     // ⋀
DISJUNCTION: '\u22C1';     // ⋁
IMPLICATION: '\u2192';     // →
EQUIVALENCE: '\u21D4';     // ⇔
XOR: '\u2295';             // ⊕
XNOR: '\u2261';            // ≡
WS: [ \t\r\n]+ -> skip;
