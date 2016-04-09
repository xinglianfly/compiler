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
            var headii= userinputs[ii].split("->")[0];
            var tailii = userinputs[ii].split("->")[1];
            for (var j = 0; j < ii ; j++) {//把j带入ii中
                var headj = userinputs[j].split("->")[0];
                var tailj = userinputs[j].split("->")[1];
                var geneii = tailii.split("|");
                var newgene="";
                for(var k = 0; k < geneii.length;k++){
                    if(geneii[k].startsWith(headj)){//如果j中能代入ii中的条件是ii的产生式中包含j的头部
                        var genej = tailj.split("|");
                        var genejrep = geneii[k];
                        for(var gen = 0;gen < genej.length;gen++){
                            genej[gen]= genejrep.replace(headj,genej[gen]);//将产生式带入
                            newgene+=genej[gen]+"|";//重新组合成产生式
                        }
                    }else{//如果不能带入的话,就将原来的产生式组合
                        newgene+=geneii[k]+"|";
                    }
                }

                tailii=newgene.substr(0, newgene.length - 1);//去掉最后一个"|"



            }

            userinputs[ii] = headii+"->"+tailii;//将能带入的式子带入后重新构建用户的输入来消除立即左递归


            avoidImmediateLeftRecursor(userinputs);//消除立即左递归

        }


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


}


