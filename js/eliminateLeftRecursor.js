/**
 * Created by xiner on 16/4/3.
 */
(function () {
    "use strict";

    class avoidLeftArith{

        constructor(){
            this.eoLR = new EoLR();
            this.avoidLeftRecursorArith = this.eoLR.avoidLeftRecursorArith;
            
        };
        
        lineStyle(index){
            return { background: index == this.eoLR.phaseIndex - 1 ? 'red' : 'white' };
        }


        avoid(){
            this.eoLR.compute(raw_grammar);
            console.log(this.eoLR.grammar);
            console.log(this.eoLR.phases);

        }



        eolRstepExc () {
            this.eoLR.stepExc();


        }

    }

    angular
        .module('compiler', [])
        .controller('HomeController', () => new avoidLeftArith)
    ;

})();






   