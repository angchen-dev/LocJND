import * as $ from 'jquery';
import { globalStatus } from "./GlobalStatus";
import { config } from "./Configuration"; 
import InitImages from "./InitImages"
import { locAccuracy } from "./LocAccuracy"

const initImages = new InitImages();

export default class Traniing {
    constructor() {
        $(".try-again-btn").on("click", (e)=>{
            this._tryAgain(e);
        });  

        let pre_ref_img_id = "";
        let pre_distorted_img_id = "";
    }

    _getJndRange() {
        if (globalStatus.section == "training") {
            return globalStatus.training_gt[globalStatus.curr_src_num]["jnd"]
        } else if (globalStatus.section == "study") {
            return globalStatus.test_gt["jnd"]
        }  
    }

    _getLocs() {
        if (globalStatus.section == "training") {
            return globalStatus.training_gt[globalStatus.curr_src_num]["loc"]
        } else if (globalStatus.section == "study") {
            return globalStatus.test_gt["loc"]
        }
    }
    
    isJndCorrect() {
        let [range_start, range_end] = this._getJndRange();
        let result = globalStatus.distorted_val;
        globalStatus.worker_jnd_val = globalStatus.distorted_val;
        if (result>=range_start && result<=range_end) {return true;} 
    
        return false;
    }

    jndCoaching() {
        let [range_start, range_end] = this._getJndRange();

        globalStatus.slider_tracking += "+" + "Train"+ "-" + (new Date()).getTime();
        $(".try-again-btn").css('visibility', 'hidden');
        $(".range").attr("disabled", true);
        $(".controller-panel").css("display", "none");

        $(".training-msg").css("display", "inline-block");
        $(".training-tips").html(`<span class='text-danger'>Your answer is incorrect. \
                                Please note that your slider must be in a position \
                                where you can see the flickering on the image, \
                                and there is no flickering before your selected position. \
                                Hint: The correct answer is in the range from ${range_start} to ${range_end}.</span>`);

        setTimeout(()=> { 
            $(".try-again-btn").css('visibility', 'visible'); 
        }, 2000);
    }

    areLocsCorrect(res_locs) {
        let gt_locs = this._getLocs();
        globalStatus.cur_locs = [];
        return locAccuracy(gt_locs, res_locs);
    }

    locCoaching() {
        this.pre_ref_img_id = globalStatus.ref_img_id;
        this.pre_distorted_img_id = globalStatus.distorted_img_id;

        let heat_map_dom_id = globalStatus.ref_img_id.slice(0, -3) + "HEAT"
        globalStatus.ref_img_id = heat_map_dom_id;
        globalStatus.distorted_img_id = heat_map_dom_id;

        $(".try-again-btn").css('visibility', 'hidden');
        $(".controller-panel").css("display", "none");

        $(".training-msg").css("display", "inline-block");
        let loc_training_msg = config.WARNING_MESSAGE["loc_training_msg"];
        $(".training-tips").html(`<span class='text-danger'>${loc_training_msg}</span>`);
        setTimeout(()=> { 
            $(".try-again-btn").css('visibility', 'visible'); 
        }, 2000);
    }

    _tryAgain(e) {
        let part = $(e.target).attr("data-part")
        if (part=="jnd") {
            // console.log("---- jnd ----")
            globalStatus.slider_tracking += "+" + "clicktryagain"+ "-" + (new Date()).getTime();
            $(".controller-panel").css("display", "inline");
            $(".training-msg").css("display", "none");
            globalStatus.distorted_val = globalStatus.worker_jnd_val;
            $(".range").attr("disabled", false);
        } else if (part=="loc") {
            // console.log("---- loc ----")
            globalStatus.loc_result[globalStatus.ref_img] += "-clicktryagain_" + (new Date()).getTime();
            $(".cross").remove();
            $(".try-again-btn").css('visibility', 'hidden');
            $(".controller-panel").css("display", "inline");
            $(".training-msg").css("display", "none");
            globalStatus.ref_img_id = this.pre_ref_img_id;
            globalStatus.distorted_img_id = this.pre_distorted_img_id;
        }
    }
}

