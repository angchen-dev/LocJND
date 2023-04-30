import { storeLocalData, getLocalData } from "../tools/ManageLocalData";
import { config } from "./Configuration"; 
import { globalStatus } from "./GlobalStatus";
import { progressBarInit, progressBarAdd } from "./ProgressBar";
import { flickeringInit } from './Flickering';
import InitImages from "./InitImages"
import Training from "./Training"
import { isDidSurvey } from "./Survey"

const initImages = new InitImages();
const training = new Training()

export default class PerceiveFlickering {
    constructor () {}

    init() {
        $(".see-flickering").on("click", ()=> {
            this.clickSeeFlickering();
        });

        $(".next-image").on("click", ()=> {
            this.clickNextImage();
        });
    }

    clickSeeFlickering() {
        if ($(".range").attr("hasDragged") == "y") {
            if (globalStatus.section == "study") {
                this.noJndCoaching();
                globalStatus.loc_result[globalStatus.ref_img] += "-st_" + (new Date()).getTime();
            } else if (globalStatus.section == "training") {
                if (training.isJndCorrect()){
                    this.noJndCoaching();
                    globalStatus.loc_result[globalStatus.ref_img] += "-st_" + (new Date()).getTime();
                } else {
                    training.jndCoaching();
                }
            }

        } else if ($(".range").attr("hasDragged") == "n") {
            $("#reminder-modal-text").html(config.WARNING_MESSAGE["please_drag"]);
            $("#reminder-modal-btn").html("OK");
            $("#reminder").modal("show");
        }
    }
    
    clickNextImage() {
        if (globalStatus.locationNum >= 3) {
                
            let curr_image_dom_class = globalStatus.curr_src_num.split("_")[0] 
                                    + "-" + globalStatus.curr_src_num.split("_")[1]

            globalStatus.locationNum = 0;
            $(".tips").html(config.WARNING_MESSAGE["critical_point"]);
            if (globalStatus.section == "study") {
                this.noLocCoaching();
                $(`.${curr_image_dom_class}`).remove(); // remove image dom
            } else if (globalStatus.section == "training") {
                let res_locs = globalStatus.cur_locs;
                if (training.areLocsCorrect(res_locs)){// true, no location training
                    this.noLocCoaching();
                    $(`.${curr_image_dom_class}`).remove(); // remove image dom
                } else {
                    globalStatus.loc_result[globalStatus.ref_img] += "-WRONGLOC" + "-" + (new Date()).getTime();
                    training.locCoaching();
                }
            }

        } else {
            $("#reminder-modal-text").html(config.WARNING_MESSAGE["report_location"]);
            $("#reminder-modal-btn").html("OK");
            $("#reminder").modal("show");
        }
    }

    noJndCoaching() {
        $(".see-flickering").css("display", "none").attr("disabled", true);
        $(".next-image").css("display", "inline").attr("disabled", false);
        $(".tips").html(config.WARNING_MESSAGE["report_location"]);
        $(".range").attr("disabled", true);
        $(".range").attr("hasDragged", "n");
        globalStatus.isFindCriticalPoint = true;
        $(".try-again-btn").attr("data-part", "loc");
    }

    noLocCoaching() {
        $(".cross").remove();
        globalStatus.isFindCriticalPoint = false;
        $(".see-flickering").css("display", "none");
        $(".next-image").css("display", "none");
        $(".try-again-btn").attr("data-part", "jnd");

        // $(".range").attr("hasDragged", "n");

        globalStatus.progress_task_cnt += 1;
        progressBarAdd();

        // check if pass test question
        if (globalStatus.section == "study") {
            if (globalStatus.ref_img == globalStatus.test_image) {
                if(!getLocalData("acc_record")) {   
                    storeLocalData("acc_record", JSON.stringify({"total_hit":0, 
                                                                "acc":0, 
                                                                "jnd_passed":0,
                                                                "jnd_failed":0, 
                                                                "loc_passed":0,
                                                                "loc_failed":0}));
                }
    
                let acc_record = JSON.parse(getLocalData("acc_record"));
                acc_record["total_hit"] += 1; // total hit humber
    
                // jnd
                let is_jnd_correct = training.isJndCorrect();
                if (is_jnd_correct) {
                    acc_record["jnd_passed"] += 1;
                } else {
                    acc_record["jnd_failed"] += 1;
                }

                // locations
                let are_locs_correct = training.areLocsCorrect(globalStatus.cur_locs);
                if (are_locs_correct) {
                    acc_record["loc_passed"] += 1;
                } else {
                    acc_record["loc_failed"] += 1;
                }

                globalStatus.pass_test = is_jnd_correct && are_locs_correct

                acc_record["acc"] = (acc_record["jnd_passed"] + acc_record["loc_passed"]) / (2 * acc_record["total_hit"]);
                storeLocalData("acc_record", JSON.stringify(acc_record));
            }
        }

        globalStatus.jnd_result[globalStatus.ref_img][0] = globalStatus.distorted_val;
        globalStatus.jnd_result[globalStatus.ref_img][1] = (config.REF_IMG_IDX_MAX+1) - globalStatus.distorted_val;
        globalStatus.jnd_result[globalStatus.ref_img][3] = (new Date()).getTime();
        globalStatus.jnd_result[globalStatus.ref_img][4] = globalStatus.slider_tracking;
        globalStatus.slider_tracking = "";

        globalStatus.bg_img_idx += config.REF_IMG_STEP;
        if (config.bg_img_idx < config.REF_IMG_IDX_MAX) { //0,10,..,90
            globalStatus.ref_img_id = globalStatus.dis_imgids[(config.REF_IMG_IDX_MAX+1)-globalStatus.bg_img_idx]; // image index start from 1
            globalStatus.jnd_result[globalStatus.ref_img] = ["", "", (new Date()).getTime(), ""];

            $(".range").attr("min", globalStatus.bg_img_idx).val(globalStatus.bg_img_idx);
            let dis_val = globalStatus.bg_img_idx;
            $(".factor").html(`Distortion Level: ${dis_val}`);
            globalStatus.distorted_img_id = globalStatus.ref_img_id;
            globalStatus.distorted_val = globalStatus.bg_img_idx;
        } else {
            globalStatus.curr_img_count ++;
            if (globalStatus.curr_img_count < globalStatus.SRC_IMG_IDX_LIST.length) {
                $(".range").attr("disabled", true);
                clearInterval(globalStatus.flicker_interval);
                this.get_next_image();
            } else {// end exp

                // clear flickering and environment checking interval
                clearInterval(globalStatus.flicker_interval);
                clearInterval(globalStatus.env_bg_interval);

                
                // change the components
                $(".range").attr("disabled", true);
                $(".next-image").css("display", "none");
                $(".instruction").css("display", "none");
                $(".distortion-level").css("display", "none");
                $(".range").css("display", "none");
                $(".progress").css("display", "none");
                $(".section-msg").css("display", "none");
                $(".tips").html(config.SESSION_MSG["thank_you"]);

                // increase hit num
                storeLocalData("hit_num", parseInt(getLocalData("hit_num"))+1);

                
                // check the qualification
                let acc_record = JSON.parse(getLocalData("acc_record"));

                if (config.hasDisqualification) { 
                    if (acc_record["total_hit"] >= config.HIT_PASS_TOTAL_THR && acc_record["acc"]<config.HIT_PASS_ACC) {
                        storeLocalData("have_qualification", "false");
                        this._show_reminder("lose_qualification");
                    } else if (parseInt(getLocalData("hit_num")) >= config.MAX_HIT) {
                        this._show_reminder("reach_max_hit_hum");
                    } else if (!globalStatus.pass_test) {
                        this._show_reminder("failed_questions");
                    }
                } else {
                    if (config.hasMaxHitNumLimit) {
                        if (parseInt(getLocalData("hit_num")) >= config.MAX_HIT) {
                            this._show_reminder("reach_max_hit_hum");
                        } else if (!globalStatus.pass_test) {
                            this._show_reminder("failed_questions");
                        }
                    } else {
                        if (!globalStatus.pass_test) {
                            this._show_reminder("failed_questions");
                        }
                    }
                }

                //need survey for pilot experiment
                if (config.IS_PILOT_EXP) {
                    if (!isDidSurvey()) {
                        $(".show-survey").css("display", "inline");
                        $(".tips").html(config.SESSION_MSG["survey_msg"]); 
                    } 
                }

                // save data to AMT dom ;
                $("input.jnd-result").val(JSON.stringify(globalStatus.jnd_result));
                $("input.os-info").val(globalStatus.os_info);
                $("input.loc-result").val(JSON.stringify(globalStatus.loc_result));
                $("input.survey").val(globalStatus.survey_result);

                if (config.MODE=="amt") {
                    $("#submitButton").css("display", "inline"); 
                } else if (config.MODE=="offline") {
                    $(".to-csv").css("display", "inline");
                }
            }
        }
    }

    _show_reminder(msg) {
        $("#reminder-modal-text").html(config.WARNING_MESSAGE[msg]);
        $("#reminder-modal-btn").html("OK");
        $("#reminder").modal("show");
    }

    get_next_image() {
        $(".curr-display").removeClass("curr-display");
        $(".loading-image-div").css("z-index", "1").css("visibility", "visible");
        $(".image-pool").css("z-index", "-1");
        $(".range").attr("hasDragged", "n").attr("disabled", true).attr("min", "0").val(0);
        $(".see-flickering").css("display", "inline").attr("disabled", true);
        // $(".next-image").css("display", "inline").attr("disabled", true);
        $(".factor").html("Distortion Level: 0");
        initImages.init();
        flickeringInit();
    }
}
