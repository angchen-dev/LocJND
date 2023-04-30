import * as $ from 'jquery';
import { globalStatus } from "./GlobalStatus";
import { storeLocalData, getLocalData } from "../tools/ManageLocalData";
import { shuffle } from "../tools/Shuffle"
import { config } from "./Configuration"; 

export default class InitInputData {
    constructor () {
        $(".section-tips").html(config.SESSION_MSG["training_description"]);
    }

    storeResolution() {
        storeLocalData("screen_width", screen.availWidth);
        storeLocalData("screen_height", screen.availHeight);
    }
    
    checkLocalExpName() {
        if(
            !getLocalData("exp_name") 
            || getLocalData("exp_name") != config.EXP_NAME
        ) {   
            storeLocalData("exp_name", config.EXP_NAME);
            storeLocalData("acc_record", JSON.stringify({"total_hit":0, 
                                                        "acc":0, 
                                                        "jnd_passed":0,
                                                        "jnd_failed":0, 
                                                        "loc_passed":0,
                                                        "loc_failed":0}));
            storeLocalData("have_qualification", "true");
            storeLocalData("hit_num", 0);
            storeLocalData("didTraining", "false");
            storeLocalData("didTraining", "false");
            storeLocalData("isCalibrated", "false");
        }
    }
    
    getSrcImageNumber() { // 43-12-26
        // for multiple JNDs
        // if (config.REF_IMG_STEP != config.REF_IMG_IDX_MAX) {
        //     $(".next-image").html("Next Group")
        // }
    
        let src_img_idx_list = null;
        let src_img_gt_list = null;
        let test_gt = null;

        if (config.MODE == "amt") {
            src_img_idx_list = $(".src-img-num-list").attr("imgurls").split("-");
            src_img_gt_list = $(".src-img-gt-list").attr("imggts").split("_");
            test_gt = $(".test-ground-truth").attr("testgt");
        } else if (config.MODE == "offline") {
            src_img_idx_list = $(".dev-src-img-num-list").attr("imgurls").split("-");
            src_img_gt_list = $(".dev-src-img-gt-list").attr("imggts").split("_");
            test_gt = $(".dev-test-ground-truth").attr("testgt");
        }

        for (let i=0; i<src_img_idx_list.length; i++) {
            src_img_idx_list[i] = src_img_idx_list[i].trim();
        }
    
        let training_imgs = [];
        let quiz_imgs = [];

        if (test_gt.length > 0 ){
            let [test_gt_jnd, test_gt_locs] = _splitGt(test_gt);
            globalStatus.test_gt = {"jnd":test_gt_jnd, "loc":test_gt_locs};
        }


        for (let i=0; i<src_img_gt_list.length; i++) {
            let gt = src_img_gt_list[i].trim();
            if (gt=="none") {
                quiz_imgs.push(src_img_idx_list[i]);
            } else if (gt=="test") {
                quiz_imgs.push(src_img_idx_list[i]);
                let tmp_name_list = src_img_idx_list[i].split("_")
                globalStatus.test_image = config.IMG_PREFIX_NAME
                                                + tmp_name_list[0] 
                                                + "_" + tmp_name_list[1] + ".png";
                globalStatus.training_gt[src_img_idx_list[i]] = $(".test-ground-truth").attr("testgt");
            } else {
                training_imgs.push(src_img_idx_list[i]);
                let [gt_jnd, gt_locs] = _splitGt(gt);
                globalStatus.training_gt[src_img_idx_list[i]] = {"jnd":gt_jnd, "loc":gt_locs};
            }
        }

        globalStatus.training_imgs_count = training_imgs.length;
        globalStatus.quiz_imgs_count = quiz_imgs.length;
        globalStatus.SRC_IMG_IDX_LIST = shuffle(training_imgs).concat(shuffle(quiz_imgs));// training first
        globalStatus.src_img_idx_list_copy = Array.from(globalStatus.SRC_IMG_IDX_LIST);
    }
}

function _splitGt(gt_data) {
    let [gt_jnd, gt_locs] = gt_data.split("+");

    gt_jnd = gt_jnd.split("-");
    gt_jnd.forEach((element, index) => {
        gt_jnd[index] = parseInt(element);
    });

    gt_locs = gt_locs.split(",");
    gt_locs.forEach((element, index) => {
        let ele = element.split("-")
        ele.forEach((e, idx) => {
            ele[idx] = parseInt(e);
        });
        ele.reverse();

        gt_locs[index] = ele;
    });

    return [gt_jnd, gt_locs]
}
