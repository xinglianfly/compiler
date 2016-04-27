 "use strict";

    let raw_grammar = `
E->E+T|T
T->T*F|F
F->(E)|i
`;
 this.new_grammar=[];

    class Phase {
        constructor(text, extra = []) {
            this.text = text;
            this.extra = extra;
        }
    }

    /**
     * Eliminating left recursion
     */
    class EoLR {
        constructor() {
            this.counter = 0;
            this.avoidLeftRecursorArith = ["(1） 把文法G的所有非终结符按任一顺序排列，例如，A1，A2，…，An",
                "（2）for （i＝1；i<=n；i++）",
                "       for （j＝1；j<=i－1；j++）",

                "             把形如Ai→Ajγ的产生式改写成Ai→δ1γ /δ2γ /…/δkγ ,其中Aj→δ1 /δ2 /…/δk是关于的Aj全部规则；",

                "    消除Ai规则中的直接左递归；",

                "（3） 化简由（2）所得到的文法，即去掉多余的规则"];
            this.avoidLeftRecursorVeriable = {ii: 0, j: 0};//消除左递归用到的全局变量

        }

        compute(raw_grammar) {
            if (raw_grammar) {
                this._compute(raw_grammar);
            } else {
                throw new Error(`grammar expected but got ${raw_grammar}`);
            }
        }

        _compute(raw_grammar) {
            // 最终结果
            this._grammar = [];
            this._phases = [];

            let old_grammar = parser.parse(raw_grammar);
            let grammar = [];

            // 合并同一个非终结符号的多个产生式
            this._phases.push(new Phase("将非终结符号排序"));
            this._sort(old_grammar, grammar);

            grammar.forEach((current, index) => {
                this._phases.push(new Phase(`转换第 ${index} 个非终结符号`, [{index}]));
                this._replace(index, current, grammar);

                this._phases.push(new Phase(`消除第 ${index} 个非终结符号的产生式之间的立即左递归`, [{index}]));
                this._eliminate(current);
            });
        }


        _sort(old_grammar, grammar) {
            let grammar_obj = {};
            old_grammar.forEach(production => {
                if (production.head in grammar_obj) {
                    grammar[grammar_obj[production.head]].body.push(...production.body);
                } else {
                    grammar_obj[production.head] = grammar.length;
                    grammar.push({
                        head: production.head,
                        body: production.body
                    });
                }
            });
        }

        _replace(index, current, grammar) {
            for (let prev_index = 0; prev_index < index; prev_index++) {
                this._phases.push(new Phase(`查看第 ${prev_index} 能否代入第 ${index} 个非终结符号的产生式中`, [{index, prev_index}]));
                let new_body = [];
                current.body.forEach(e => {
                    if (e[0] === grammar[prev_index].head) {
                        grammar[prev_index].body.forEach(prev_e => {
                            new_body.push(prev_e.concat(e.slice(1)));
                        })
                    } else {
                        new_body.push(e);
                    }
                });
                current.body = new_body;
            }
        }

        _eliminate(current) {
            // 判断是否需要消除左递归 这里通过判断产生式体中存不存在以head作为开头的
            if (current.body.some(e => e[0] === current.head)) {
                let alpha = [];
                let beta = [];
                // 提取alpha 和 beta 数组
                current.body.forEach(e => {
                    if (e[0] === current.head) {
                        alpha.push(e.slice(1));
                    } else {
                        beta.push(e);
                    }
                });

                // 这里虽然可以合并到上面查找的时候 这里暂时分开 可能可以用在步骤里面
                let new_body = [];
                let new_production = {head: current.head + "'", body: []};

                // 生成 head 产生式
                beta.forEach(e => {
                    new_body.push(e.concat(new_production.head));
                });

                // 生成 head + ' 产生式
                alpha.forEach(e => {
                    new_production.body.push(e.concat(new_production.head));
                });
                new_production.body.push(["empty"]);

                current.body = new_body;
                this._grammar.push(current);
                this._grammar.push(new_production);

            } else {
                this._grammar.push(current);
            }
        }


        _stepExc(old_grammar,grammar){
            // 合并同一个非终结符号的多个产生式,走到第一行,将非终结符号排序"
            if(this.phaseIndex==1){
                this._phases.push(new Phase("将非终结符号排序"));
                this._sort(old_grammar, grammar);
                this.counter++;

                //走到第三行,判断ii和j的大小的关系
            } else if (this.phaseIndex == 3) {
                if (this.avoidLeftRecursorVeriable.j < this.avoidLeftRecursorVeriable.ii) {
                    this.avoidLeftRecursorVeriable.j++;
                    this.counter++;
                } else {
                    if (this.avoidLeftRecursorVeriable.ii < old_grammar.length) {
                        this.avoidLeftRecursorVeriable.j = 0;
                        this.counter = this.counter + 2;
                        this.avoidLeftRecursorVeriable.ii++;
                    } else {
                        this.counter++;
                    }
                }
                //将之前的产生式带入当前的产生式中
                var index = this.avoidLeftRecursorVeriable.ii;
                this._phases.push(new Phase(`转换第 ${index} 个非终结符号`, [{index}]));


                //走到第五行,消除立即左递归,
            } else if (this.phaseIndex == 5) {
                if (this.avoidLeftRecursorVeriable.ii < old_grammar.length) {
                    this.counter = 2;

                } else {
                    this.counter++;
                }
                var index = this.avoidLeftRecursorVeriable.ii-1;
                var current = old_grammar[index];

                this._phases.push(new Phase(`消除第 ${index} 个非终结符号的产生式之间的立即左递归`, [{index}]));
                this._eliminate(current);
            }
                //走到第四行,将之前的产生式带入本产生式中
            else if (this.phaseIndex == 4) {
                if (this.avoidLeftRecursorVeriable.j < this.avoidLeftRecursorVeriable.ii) {
                    this.counter--;
                } else {
                    this.counter = 3;
                }
                var current = old_grammar[index];
                this._replace(index, current, grammar);
            }
                //最后一行,化简
            else if (this.phaseIndex == 6) {

            } else {
                this.counter++;
            }

            this.phaseIndex = this.counter;
            console.log("line:"+this.phaseIndex);//打印行号

        }

        stepExc() {
                this._stepExc(parser.parse(raw_grammar),new_grammar);

        }
        get grammar() {
            return this._grammar;
        }

        get phases() {
            return this._phases;
        }
    }

    class Animator {

    }


    
