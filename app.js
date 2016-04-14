/**
 * Created by xiner on 16/4/3.
 */


angular
    .module('compiler', [])
    .controller('HomeController', HomeController);

function HomeController($scope) {

    var home = this;
    home.avoid = function () {

        var userinputs = home.textInput.split("\n");//把用户的输入按照行分开
        for (var ii = 0; ii < userinputs.length; ii++) {
            var headii = userinputs[ii].split("->")[0];
            var tailii = userinputs[ii].split("->")[1];
            for (var j = 0; j < ii; j++) {//把j带入ii中
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


            }

            userinputs[ii] = headii + "->" + tailii;//将能带入的式子带入后重新构建用户的输入来消除立即左递归


            avoidImmediateLeftRecursor(userinputs);//消除立即左递归

        }


    }

    home.readFiles = function () {

    }

    /**
     * 消除立即左递归
     * @param userinputs 用户的输入
     */
    function avoidImmediateLeftRecursor(userinputs) {
        home.textOutput = "";
        for (var i = 0; i < userinputs.length; i++) {
            var grammer = userinputs[i];
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
                        if (generates[a].indexOf("e") == -1) {//如果是空
                            notconts += generates[a] + head + "'" + "|";
                        } else {
                            notconts += head + "'" + "|"
                        }
                    }
                }

                home.textOutput += notconts.substr(0, notconts.length - 1) + "\n";
                home.textOutput += conts + "e" + "\n"; // 最后一个是空 e代表是空

            } else {
                home.textOutput += grammer + "\n";
            }


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
            longestCommonPrefix(allgen, 0, leftuserri,leftu);//提取左公因子
        }

    }
    /**
     * 提取左公因子具体算法
     * @param allgen  每一个的箭头右侧部分
     * @param start  从第几个元素还是匹配前缀
     * @param leftuserri 箭头左边的部分,为了生成 A A' A'' A'''类似的东西
     * @returns {*}
     */
    function longestCommonPrefix(allgen, start, leftuserri,leftu) {

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
        }

        start = start + 1;
        if (start < rightuseri.split("|").length) {
            return longestCommonPrefix(rightuseri.split("|"), start, leftuserri,leftu);//递归查找
        } else {
            home.textcommonprefix +=  leftu+"->"+rightuseri+"\n";
            return;
        }
    }


}


