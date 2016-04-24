/**
 * Created by xiner on 16/4/3.
 */


angular
    .module('compiler', [])
    .controller('HomeController', HomeController)
    .directive('fileDropzone', fileDropzone)
    .directive('fileChange', fileChange)
;

function HomeController($scope) {

    var home = this;
    home.counter = 0;

    home.ii = 0;
    home.j = 0;
    home.textOutput = "";

    home.avoidLeftRecursorArith = [{name: "(1） 把文法G的所有非终结符按任一顺序排列，例如，A1，A2，…，An", color: {'background-color': 'blue'}},
        {name: "（2）for （i＝1；i<=n；i++）", color: {'background-color': ''}},
        {name: "       for （j＝1；j<=i－1；j++）", color: {'background-color': ''}},
        {
            name: "             把形如Ai→Ajγ的产生式改写成Ai→δ1γ /δ2γ /…/δkγ ,其中Aj→δ1 /δ2 /…/δk是关于的Aj全部规则；",
            color: {'background-color': ''}
        },
        {name: "    消除Ai规则中的直接左递归；", color: {'background-color': ''}},

        {name: "（3） 化简由（2）所得到的文法，即去掉多余的规则", color: {'background-color': ''}}];


    home.avoid = function () {

        var userinputs = home.textInput.split("\n");//把用户的输入按照行分开
        for (var ii = 0; ii < userinputs.length; ii++) {
            var headii = userinputs[ii].split("->")[0];
            var tailii = userinputs[ii].split("->")[1];
            for (var j = 0; j < ii; j++) {//把j带入ii中
                tailii = changeRules(userinputs, ii, j);

            }
            userinputs[ii] = headii + "->" + tailii;//将能带入的式子带入后重新构建用户的输入来消除立即左递归
            avoidImmediateLeftRecursor(userinputs[ii]);//消除立即左递归

        }

    }

    /**
     * 把形如Ai→Ajγ的产生式改写成Ai→δ1γ /δ2γ /…/δkγ ,其中Aj→δ1 /δ2 /…/δk是关于的Aj全部规则；
     * @param userinputs
     * @param ii
     * @param j
     * @returns {*}
     */
    function changeRules(userinputs, ii, j) {
        var headii = userinputs[ii].split("->")[0];

        var tailii = userinputs[ii].split("->")[1];

        var headj = userinputs[j].split("->")[0];
        var tailj = userinputs[j].split("->")[1];
        var geneii = tailii.split("|");
        var newgene = "";
        for (var k = 0; k < geneii.length; k++) {
            if (geneii[k].startsWith(headj)) {//如果j中能代入ii中的条件是ii的产生式中包含j的头部
                var genej = tailj.split("|");
                var genejrep = geneii[k];
                for (var gen = 0; gen < genej.length; gen++) {
                    genej[gen] = genejrep.replace(headj, genej[gen]);//将产生式带入
                    newgene += genej[gen] + "|";//重新组合成产生式
                }
            } else {//如果不能带入的话,就将原来的产生式组合
                newgene += geneii[k] + "|";
            }
        }

        tailii = newgene.substr(0, newgene.length - 1);//去掉最后一个"|"

        userinputs[ii] = headii + "->" + tailii;//将能带入的式子带入后重新构建用户的输入来消除立即左递归
        return tailii;
    }

    home.stepExc = function () {
        if (home.phaseIndex == 3) {
            if (home.j < home.ii) {
                home.j++;
                home.counter++;
            } else {
                if (home.ii < 3) {
                    home.j = 0;
                    home.counter = home.counter + 2;
                    home.ii++;
                } else {
                    home.counter++;
                }
            }
        } else if (home.phaseIndex == 5) {
            if (home.ii < 3) {
                home.counter = 2;

            } else {
                home.counter++;
            }
            var userinputs = home.textInput.split("\n");//把用户的输入按照行分开
            var headii = userinputs[home.ii - 1].split("->")[0];
            var tailii = userinputs[home.ii - 1].split("->")[1];


            for (var j = 0; j < home.ii - 1; j++) {


                tailii = changeRules(userinputs, home.ii - 1, j);

            }
            userinputs[home.ii - 1] = headii + "->" + tailii;//将能带入的式子带入后重新构建用户的输入来消除立即左递归

            avoidImmediateLeftRecursor(userinputs[home.ii - 1]);//消除ii立即左递归

        }
        else if (home.phaseIndex == 4) {
            if (home.j < home.ii) {
                home.counter--;
            } else {
                home.counter = 3;
            }
        }
        else if (home.phaseIndex == 6) {
            
        } else {
            home.counter++;
        }

        home.phaseIndex = home.counter;


    }


    /**
     * 判断是否是大小写   以此来表示是终结符还是非终结符
     * @param B
     * @returns {boolean} true是大写
     */
    function isNonterminal(B) {

        for (var b = 0; b < B.length; b++) {
            if (B.match(/[A-Z]/)) {//如果是大写字母的话,就是非终结符
                return true;
            }
        }
        if (B == '∂') {
            return false;
        }
        return false;
    }


    /**
     * 取得元素的first集合,如果是终结符的话,就是本身,如果是非终结符的话,就是从set里面拿
     * @param first
     * @param beta
     * @param rnum
     * @returns {*}
     */
    function firstsetwhenterminate(first, beta, rnum) {
        if (!isNonterminal(beta[rnum])) {//如果是终结符的话
            return beta[rnum];
        } else {
            return first[beta[rnum]];
        }
    }

    function compute_first(beta, first) {
        var result = [];
        if (beta.length == 0 || beta[0] == "∂") {
            result.push("∂");
        } else {
            result.splice(0, result.length);
            var firlen = firstsetwhenterminate(first, beta, 0);
            for (var fifi = 0; fifi < firlen.length; fifi++) {
                result.push(firlen[fifi]);
            }
            for (var rnum = 1; rnum < beta.length; rnum++) {
                var fi = firstsetwhenterminate(first, beta, rnum - 1);
                if (fi.indexOf("∂") == -1) {
                    break;
                }
                var f = firstsetwhenterminate(first, beta, rnum);
                f.splice(f.indexOf("∂"), 1);
                for (var fnum = 0; fnum < f.length; fnum++) {
                    result.push(f[fnum]);

                }
            }

            var firse = firstsetwhenterminate(first, beta, rnum - 1);

            if (rnum == beta.length && firse.indexOf("∂") > -1) {
                if (result.indexOf("∂") == -1) {
                    result.push("∂");
                }
            } else {
                if (result.indexOf("∂") > -1) {
                    result.splice(result.indexOf("∂"), 1);
                }
            }
        }

        return result;
    }

    /**
     * 计算follow的值
     * @param first  first集合
     */
    function findFollow(userinput, first) {
        var keys = Object.keys(first);
        var follow_set = {};
        var A, RHS, B;
        var change = true;
        for (var fnum = 0; fnum < keys.length; fnum++) {//初始化  把follow集合的key写上去
            follow_set[keys[fnum]] = [];
        }

        follow_set[userinput[0].split("->")[0]].push("∂");


        while (change) {
            change = false;
            for (var unum = 0; unum < userinput.length; unum++) {
                A = userinput[unum].split("->")[0];

                RHS = userinput[unum].split("->")[1];
                for (var rnum = 0; rnum < RHS.split("|").length; rnum++) {
                    var btemp = RHS.split("|")[rnum];

                    for (var jnum = 0; jnum < btemp.length; jnum++) {
                        if (jnum + 1 < btemp.length && btemp.charAt(jnum + 1) == '\'') {//处理E'类似的有带'的,要当做一个字符
                            B = btemp[jnum] + '\'';
                            jnum++;
                        } else {
                            B = btemp[jnum];

                        }
                        if (isNonterminal(B) && B != '\'') {//如果是非终结符的话
                            var beta = [];
                            for (var bj = jnum + 1; bj < btemp.length; bj++) {
                                var nextnode = btemp.charAt(bj);
                                if (bj + 1 < btemp.length && btemp.charAt(bj + 1) == '\'') {//处理E'类似的有带'的,要当做一个字符
                                    nextnode += btemp.charAt(bj + 1);
                                    ++bj;
                                }
                                beta.push(nextnode);
                            }

                            var rfirst = [];
                            rfirst = compute_first(beta, first);
                            var size = follow_set[B].length;
                            var Barr = follow_set[B];
                            if (rfirst.indexOf("∂") == -1) {
                                for (var rr = 0; rr < rfirst.length; rr++) {
                                    if (Barr.indexOf(rfirst[rr]) == -1) {
                                        Barr.push(rfirst[rr]);

                                    }
                                }
                            } else {
                                rfirst.splice(rfirst.indexOf("∂"), 1);
                                for (var rr = 0; rr < rfirst.length; rr++) {
                                    if (Barr.indexOf(rfirst[rr]) == -1) {
                                        Barr.push(rfirst[rr]);
                                    }
                                }
                                rfirst = follow_set[A];
                                for (var rr = 0; rr < rfirst.length; rr++) {
                                    if (Barr.indexOf(rfirst[rr]) == -1) {
                                        Barr.push(rfirst[rr]);
                                    }
                                }
                            }
                            var newsize = follow_set[B].length;
                            if (size != newsize) {
                                change = true;
                            }
                        }
                    }
                }

            }
        }

        console.log("follow" + follow_set);
    }


    /**
     * 查找FIRST集合
     */
    home.findFirst = function () {

        var first = {};
        // var userinput = ["S->ABc","A->a|$","B->b"];
        var userinput = ["E->TE'",
            "E'->+TE'|∂",
            "T->FT'",
            "T'->*FT'|∂",
            "F->(E)|i"
        ];

        // var userinput = ["A->BaAb",
        //    "B->l",
        //     "C->eA",
        // ];
        var map = {};
        for (var i = 0; i < userinput.length; i++) {
            var split1 = userinput[i].split("->");
            var split2 = split1[1].split("|");
            map[split1[0]] = split2;
        }
        Object.size = function (map) {
            var size = 0, key;
            for (key in map) {
                if (map.hasOwnProperty(key))
                    size++;
            }
            return size;
        };
        for (var b = 0; b < Object.size(map); b++) {
            firstCore(Object.keys(map)[b], map[Object.keys(map)[b]]);
        }


        console.log("first 集合如下:" + first);

        findFollow(userinput, first);

        function firstCore(leftnode, rightnodes) {
            if (leftnode in first) {
                return first[leftnode];
            }

            var st = [];
            for (var ii = 0; ii < rightnodes.length; ii++) {
                for (var aa = 0; aa < rightnodes[ii].length; aa++) {
                    var nextnode = rightnodes[ii].charAt(aa);
                    if (nextnode in map) {//非终结点

                        if (aa + 1 < rightnodes[ii].length && rightnodes[ii].charAt(aa + 1) == '\'') {
                            nextnode += rightnodes[ii].charAt(aa + 1);
                            ++aa;
                        }

                        if (nextnode in map) {
                            var temst = firstCore(nextnode, map[nextnode]);
                            st = st.concat(temst);
                            if (temst.indexOf("$") > -1) {

                            } else {
                                break;

                            }
                        }


                    } else {//终结点
                        st.push(nextnode.charAt(0));
                        break;
                    }
                }
            }

            first[leftnode] = st;
            return st;
        }
    }


    /**
     * 选择文件读取文件内容操作
     * @param files
     */
    home.readFiles = function (files) {
        var reader = new FileReader();
        reader.onload = function (evt) {//回调操作
            $scope.$apply(function () {//一个异步操作,读完文件之后,异步更新界面
                home.textInput = evt.target.result;
            })
        }
        reader.readAsText(files[0]);//读取第0个文件
    }


    home.dragHandler = function (fileText) {
        home.textInput = fileText;
    }

    /**
     * 消除立即左递归
     * @param userinputs 用户的输入
     */
    function avoidImmediateLeftRecursor(grammer) {
        if (isImmediateLeftRecursor(grammer)) {
            var parts = grammer.split("->");
            var head = parts[0];
            var tail = parts[1].trim();
            var generates = tail.split("|");
            var conts = head + "'" + "->";
            var notconts = head + "->";
            for (var a = 0; a < generates.length; a++) {
                //分为两种情况
                if (generates[a].indexOf(head) > -1) {//包含非终结符号
                    conts += generates[a].replace(head, "") + head + "'" + "|";
                } else {//不包含非终结符号
                    if (generates[a].indexOf("ε") == -1) {//如果是空
                        notconts += generates[a] + head + "'" + "|";
                    } else {
                        notconts += head + "'" + "|"
                    }
                }
            }

            home.textOutput += notconts.substr(0, notconts.length - 1) + "\n";
            home.textOutput += conts + "ε" + "\n"; // 最后一个是空 ε代表是空

        } else {
            home.textOutput += grammer + "\n";
        }


        /**
         * 判断是否有立即左递归
         * @param grammer
         */
        function isImmediateLeftRecursor(grammer) {
            if (grammer.indexOf("->") > -1) {//代表是否含有"->"
                var head = grammer.split("->")[0];
                var tail = grammer.split("->")[1];
                //包含"或者"符号
                if (tail.indexOf("|") > -1) {
                    var allgers = tail.split("|");
                    for (var num = 0; num < allgers.length; num++) {
                        if (allgers[num].indexOf(head) == 0) {
                            return true;
                        }
                    }

                }
            }

            return false;
        }


    }

    /**
     * 将用户的输入提取左公因子
     */
    home.longestCommonPrefix = function () {
        home.textcommonprefix = "";
        var userinputs = home.textOutput.split("\n");
        if (userinputs == null || userinputs.length == 0) {
            return;
        }

        for (var u = 0; u < userinputs.length; u++) {
            var rightuseri = userinputs[u].split("->")[1];
            var leftuserri = userinputs[u].split("->")[0];
            var leftu = leftuserri;
            var allgen = rightuseri.split("|");//将右侧分成一个个元素
            longestCommonPrefix(allgen, 0, leftuserri, leftu);//提取左公因子
        }

    }
    /**
     * 提取左公因子具体算法
     * @param allgen  每一个的箭头右侧部分
     * @param start  从第几个元素还是匹配前缀
     * @param leftuserri 箭头左边的部分,为了生成 A A' A'' A'''类似的东西
     * @returns {*}
     */
    function longestCommonPrefix(allgen, start, leftuserri, leftu) {

        var prefix = allgen[start];
        var max = 0;
        for (var i = start + 1; i < allgen.length; i++) {
            var j = 0;
            while (j < allgen[i].length && j < prefix.length && allgen[i].charAt(j) == prefix.charAt(j)) {
                j++;
            }
            if (j == 0) {//如果这个元素没有公共左因子,就跳过
                continue;
            } else {
                if (max < j) {//如果之前的前缀不如现在这个前缀长,为了找到最长的公共左因子
                    max = j;

                }
            }

        }
        prefix = prefix.substr(0, max);
        if (prefix != "") {
            var reallgen = allgen.slice();
            var leftallgen = [];
            var rightleft = "";
            var rightleftci = "";
            for (var de = start; de < allgen.length; de++) {//提取左公因子
                if (allgen[de].startsWith(prefix)) {
                    reallgen[de] = "";
                    leftallgen.push(allgen[de].replace(prefix, ""));//为了推出A'的表达式使用的,就是把前缀替换成"",然后单独拿出来
                }
            }
            for (var de1 = 0; de1 < reallgen.length; de1++) {
                if (reallgen[de1] != "") {
                    rightleft += reallgen[de1] + "|";//提取左公因子之后,剩下的部分要怎么写

                }
            }

            for (var de2 = 0; de2 < leftallgen.length; de2++) {//推出A'的表达式
                rightleftci += leftallgen[de2] + "|";
            }
            leftuserri = leftuserri + "'";

            rightuseri = prefix + leftuserri + "|" + rightleft.substr(0, rightleft.length - 1);


            console.log("前缀是:" + prefix);
            console.log(rightuseri);
            home.textcommonprefix += leftuserri + "->" + rightleftci.substr(0, rightleftci.length - 1) + "\n";
            console.log(leftuserri + "->" + rightleftci.substr(0, rightleftci.length - 1));
        } else {
            rightuseri = "";
            for (var ru = 0; ru < allgen.length; ru++) {
                rightuseri += allgen[ru] + "|";
            }
            rightuseri = rightuseri.substr(0, rightuseri.length - 1);
        }

        start = start + 1;
        if (start < rightuseri.split("|").length) {
            return longestCommonPrefix(rightuseri.split("|"), start, leftuserri, leftu);//递归查找
        } else {
            home.textcommonprefix += leftu + "->" + rightuseri + "\n";
            return;
        }
    }


}


function fileChange() {
    return {
        restrict: 'A',//代表只能用在哪里 A代表的是属性  如果定义成E的话,表示可以用于元素名 如果定义成C的话,表示用在css中
        // require:'ngModel',//代表需要依赖谁,这里是需要依赖ngmodel
        scope: {//相关内容是怎么处理的
            fileHandler: '=' //表示当做函数来用的
        },
        link: function link(scope, element, attrs, ctrl) {//在元素上面加一个监听器,当元素不使用的时候,就关掉监听器
            element.on('change', onChange);
            scope.$on('destroy', function () {
                element.off('change', onChange);
            });
            function onChange() {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    scope.$apply(function () {
                        scope.fileHandler(evt.target.result);
                    })
                };
                reader.readAsText(element[0].files[0]);

            }
        }

    }


}


function fileDropzone() {
    return {
        restrict: 'A',//表示当做一个属性来用
        scope: {
            //等号是用来取值的,这里表示当做一个变量来用
            fileHandler: '=',
            fileType: '@'//可以取字符串的值
        },
        link: function (scope, element, attrs) {
            var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;

            //dragOver或者dragenter时间
            processDragOverOrEnter = function (event) {
                event.stopPropagation();
                event.preventDefault();
                return false;
            };

            //获得文件mime类型

            validMimeTypes = attrs.fileDropzone;


            isTypeValid = function (type) {//判断是否是图片类型
                if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                    return true;
                } else {
                    alert("无效文件.上传文件必须是" + validMimeTypes);
                    return false;
                }
            };

            //元素绑定事件
            element.on('dragover', processDragOverOrEnter);
            element.on('dragenter', processDragOverOrEnter);


            return element.on('drop', function (event) {//绑定drop事件
                var file, reader, type;
                if (event != null) {
                    event.preventDefault();
                }
                reader = new FileReader();
                reader.onload = function (evt) {
                    if (isTypeValid(type)) {//判断大小和类型是不是符合条件
                        return scope.$apply(function () {
                            scope.fileHandler(evt.target.result);

                        });
                    }
                };

                file = event.dataTransfer.files[0];
                type = file.type;
                reader.readAsText(file);
                return false;
            });
        }
    };
}



