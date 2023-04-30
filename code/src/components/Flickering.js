import * as $ from 'jquery';
import { config } from "./Configuration"; 
import { globalStatus } from "./GlobalStatus";

export function flickeringInit (){
    let _cnt = 0;

    globalStatus.flicker_interval = setInterval(()=>{
        if (globalStatus.isStart) {
            if (globalStatus.distorted_val >= 0) {
                $(".curr-display").removeClass("curr-display");
                if (globalStatus.distorted_img_id != globalStatus.ref_img_id) {
                    if (_cnt%2 === 0) {
                        $("#" + globalStatus.distorted_img_id).removeClass("curr-display");
                        $("#" + globalStatus.ref_img_id).addClass("curr-display");
    
                    } else if (_cnt%2 == 1) {
                        $("#" + globalStatus.distorted_img_id).addClass("curr-display");
                        $("#" + globalStatus.ref_img_id).removeClass("curr-display");
                        $(".range").focus();
                    }
                    _cnt++;
                    _cnt = _cnt%2;
                } else if (globalStatus.distorted_img_id == globalStatus.ref_img_id) {
                    $("#" + globalStatus.ref_img_id).addClass("curr-display");
                }
            }
        }
    }, config.FREQ);
}