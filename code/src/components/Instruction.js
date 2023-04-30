// import * as $ from 'jquery';
import { globalStatus } from "./GlobalStatus";
import { getLocalData } from "../tools/ManageLocalData";

export default class Instruction {
    constructor () {}

    show() {
        if (getLocalData("isCalibrated") == "true") {
            $("#inst-cali_hint").css("display", "none");
        }

        $("#instruction-modal").modal("show");
        this._flickering();
    }

    _flickering() {
        let _cnt = 0;
        globalStatus.ins_flickering_interval = setInterval(()=>{
            $(".instr-active").removeClass("instr-active");
            if (_cnt % 2 === 0) {
                $(".instr-dis-img").addClass("instr-active");
            } else if (_cnt % 2 == 1) {
                $(".instr-ref-img").addClass("instr-active");
            }
            _cnt++;
            _cnt = _cnt % 2;
        }, globalStatus.FREQ);
    }

    initBtn() {
        $(".showInstr").on('click', (e)=>  {
            this.show();
        })

        $(".instr-close-btn").on('click', (e)=>  {
            clearInterval(globalStatus.ins_flickering_interval);
        })
    }
}


