/**
 * Created by xiner on 16/4/3.
 */


angular
    .module('compiler', [])
    .controller('HomeController', HomeController);

function HomeController($scope) {

    var home = this;
    home.avoid= function () {

        var userinput = home.textInput;
        var userinputs = userinput.split("\n");
        avoidImmediateLeftRecursor(userinputs);
        

    }

    /**
     * 消除立即左递归
     * @param userinputs
     */
    function avoidImmediateLeftRecursor(userinputs){
        home.textOutput="";
        for(var i=0;i<userinputs.length;i++){
            var grammer = userinputs[i];
            if(isImmediateLeftRecursor(grammer)) {
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
                        if(generates[a].indexOf("e")==-1){//如果是空
                            notconts += generates[a] + head + "'" + "|";
                        }else{
                            notconts +=head+"'"+"|"
                        }
                    }
                }

                home.textOutput+=notconts.substr(0, notconts.length - 1)+"\n";
                home.textOutput+=conts + "e"+"\n"; // 最后一个是空

            }else{
                home.textOutput += grammer+"\n";
            }


        }


        /**
         * 判断是否有立即左递归
         * @param grammer
         */
        function  isImmediateLeftRecursor(grammer) {
            if(grammer.indexOf("->")>-1){
                var head = grammer.split("->")[0];
                var tail = grammer.split("->")[1];
                //包含"或者"符号
                if(tail.indexOf("|")>-1){
                    var allgers = tail.split("|");
                    for(var num = 0;num < allgers.length;num++){
                        if(allgers[num].indexOf(head)==0){
                            return true;
                        }
                    }

                }
            }

            return false;
        }

    }
    

}


