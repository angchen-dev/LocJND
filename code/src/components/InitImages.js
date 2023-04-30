import * as $ from 'jquery';
import { globalStatus } from "./GlobalStatus";
import { storeLocalData, getLocalData } from "../tools/ManageLocalData";
import { config } from "./Configuration"; 
import { progressBarInit } from "./ProgressBar";

export default class InitImages {
    constructor() {}

    init() {
        if ( // skip training if did training before
            globalStatus.section=="training" 
            && getLocalData("didTraining")=="true" 
            && globalStatus.training_imgs_count>0
        ) {
            globalStatus.src_img_idx_list_copy = globalStatus.src_img_idx_list_copy.slice(globalStatus.training_imgs_count);
            progressBarInit(globalStatus.quiz_imgs_count);
            globalStatus.curr_img_count += globalStatus.training_imgs_count
            globalStatus.training_imgs_count = 0;
        }

        if (globalStatus.ref_img_id != "") {
            $("." + "src-" + globalStatus.ref_img_id.split("_")[0]).remove();
        }

        $(".range").attr("max", config.REF_IMG_IDX_MAX).focus();
        globalStatus.curr_src_num = globalStatus.src_img_idx_list_copy.shift();
        if (globalStatus.training_imgs_count > 0) {
            globalStatus.training_imgs_count -= 1;
        } else if (globalStatus.training_imgs_count==0) { // training is end, switch to quiz section

            // globalStatus.result = {}; // remove training result
            // globalStatus.location = {}; // remove training result
            globalStatus.section = "study"
            globalStatus.isStart = false;

            if (globalStatus.training_imgs_count==0) {
                globalStatus.training_imgs_count = -1
                storeLocalData("didTraining", "true");
            }

            $(".image-panel, .controller-panel").css("visibility", "hidden");
            
            $(".loading-image-div").css("z-index", "-1").css("visibility", "hidden");

            $(".section-name").html("Study").removeClass("text-primary").addClass("text-warning");
            
            $(".section-tips").html("In this session, you will carry out a task to find the flickering critical points of " 
                                    + globalStatus.quiz_imgs_count 
                                    + " images. Please pay attention to the study, otherwise you will lose your qualification for this study.");

            $(".start-section").html("Start Study")
                            .css("visibility", "visible")
                            .removeClass("btn-primary")
                            .addClass("btn-warning");
        }
    
        let imagelist_obj = this.genImagelist(globalStatus.curr_src_num);
        globalStatus.ref_img = imagelist_obj["ref_img_url"];
        globalStatus.ref_img_id = imagelist_obj["ref_img_id"];
        globalStatus.dis_imgurls = imagelist_obj["dis_imgurls"];
        globalStatus.dis_imgids = imagelist_obj["dis_imgids"];
        globalStatus.distorted_img_id = globalStatus.ref_img_id;
        globalStatus.distorted_val = 0;
        globalStatus.bg_img_idx = 0;
        this.createImageDom(false, globalStatus.ref_img_id
                        , globalStatus.ref_img
                        , globalStatus.dis_imgids
                        , globalStatus.dis_imgurls);

        // remove in AMT
        if (config.MODE == "offline") {
            let jndgt = "";
            if (globalStatus.section == "training") {
                jndgt = globalStatus.training_gt[globalStatus.curr_src_num]["jnd"];
            } 

            let html = `"this text just for development, image: ${globalStatus.ref_img_id.slice(0,-4)} - ${jndgt}`
            $(".image-type").css("display", "inline")
                            .html(html);
        }
        
    }

    startSection() {
        $(".start-section").on("click", (e)=>{
            
            globalStatus.isStart = true;
            globalStatus.jnd_result[globalStatus.ref_img] = ["", "", (new Date()).getTime(), ""];
            $(".range, .see-flickering").attr("disabled", false);
            $(".next-image").attr("disabled", true);
            $(".start-section").css("visibility", "hidden");
            $(".image-panel, .controller-panel").css("visibility", "visible");
            $(".range").focus();
            
            if (globalStatus.section == "study") {
                progressBarInit(globalStatus.quiz_imgs_count)
            }
        })

    }

    getDistortedImage() {
        $(".range").on("input", ()=> { 
            this.sliderChange();
        });
    }

    sliderChange() {
        if ($(".range").attr("hasDragged") == "n") {
            $(".range").attr("hasDragged", "y");
        }

        globalStatus.slider_tracking += "+" 
                                        + $(".range").val()
                                        + "-" 
                                        + (new Date()).getTime();

        globalStatus.distorted_val = parseInt($(".range").val());

        let dis_val = globalStatus.distorted_val;
        $(".factor").html(`Distortion Level: ${dis_val}`);
        globalStatus.distorted_img_id = globalStatus.ref_img_id;

        if (globalStatus.distorted_val>0) {
            globalStatus.distorted_img_id = globalStatus.dis_imgids[config.REF_IMG_IDX_MAX + 1 - globalStatus.distorted_val] // slider value > 0 
        }
    }

    genImagelist(new_img_name) {
        let next_ref_img_id = new_img_name;

        let tmp_name_list = next_ref_img_id.split("_");

        let next_ref_img_url = config.IMG_PREFIX_NAME 
                                + tmp_name_list[0] 
                                + "_" + tmp_name_list[1] + ".png";

        let next_heat_img_url = ""
        if (globalStatus.section == "training") {
            next_heat_img_url = config.IMG_PREFIX_NAME 
                                + tmp_name_list[0] 
                                + "_" + tmp_name_list[1] + "_HEAT.png";
        }


        let next_imgurls = Array();
        let next_imgids = Array();

        for (let i=1; i<=config.REF_IMG_IDX_MAX; i++) {
            let next_dis_iamge_id = next_ref_img_id + "_" + (Array(3).join("0") + i).slice(-3);
            next_imgids.push(next_dis_iamge_id);
            next_imgurls.push(config.IMG_PREFIX_NAME + next_dis_iamge_id + ".jpg")
        }

        if (globalStatus.section == "training") {
            next_imgids.push(next_ref_img_id + "_HEAT");
            next_imgurls.push(next_heat_img_url)
        }

        return {
                "ref_img_url": next_ref_img_url
                , "dis_imgurls": next_imgurls
                , "ref_img_id":next_ref_img_id+"_000"
                , "dis_imgids": next_imgids
        }
    }

    createImageDom(
        isNextGroup
        ,ref_image_id
        , ref_image_url
        , distorted_img_id_list
        , distorted_img_url_list
    ) {                       
        let img_id_list = distorted_img_id_list
        let img_url_list = distorted_img_url_list
        img_id_list.unshift(ref_image_id);
        img_url_list.unshift(ref_image_url);

        if ($("#" + ref_image_id).length == 0) {

            for (let i=0, l=img_id_list.length; i<l; i++) {
                let image_dom = "<div class='image-cover "
                                + img_id_list[0].split("_")[0]  + "-" + img_id_list[0].split("_")[1] 
                                + "' id='" +  img_id_list[i] 
                                + "' style='z-index:-1'>"
                                + "<img alt='test image' class='image' "
                                + "src='" + img_url_list[i] + "'>"
                                + "</div>"
    
                $(image_dom).appendTo($(".image-pool"));
            }
        }

        if (!isNextGroup) { // if the last image is downloaded, then all the images are downloaded
            img_url_list = img_url_list.slice(img_url_list.length-1);
        }

        this.preloadGroupImages(isNextGroup, img_url_list, 0);
    }
    
    preloadGroupImages(isNextGroup, imageArray, index) {
        let self = this;
        index = index || 0;
        if (imageArray && imageArray.length > index) {
            let img = new Image();
            img.onload = function() {
                if (isNextGroup) {
                    self.preloadGroupImages(isNextGroup, imageArray, index + 1);
                } else {
                    self.preloadGroupImages(isNextGroup, imageArray, index + 1);
                    if (index+1 == imageArray.length){self.displayAfterloading();}
                }
            }
            img.src = imageArray[index];
        }
    } 

    displayAfterloading() {  
        $(".loading-image-div").css("z-index", "-1")
                                .css("visibility", "hidden");

        $(".image-pool").css("z-index", "1");

        if (globalStatus.isStart) {
            $(".see-flickering, .range").attr("disabled", false);
            $(".range").focus();
        }

        globalStatus.jnd_result[globalStatus.ref_img] = ["", "", (new Date()).getTime(), ""];
        globalStatus.loc_result[globalStatus.ref_img] = "";
        
        if (globalStatus.src_img_idx_list_copy.length > 0) {
            let next_ref_img = "";
            let next_ref_img_id = "";
            let next_group_imgurls = [];
            let next_group_imgids = [];

            let next_img = globalStatus.src_img_idx_list_copy[0];
            let imagelist_obj = this.genImagelist(next_img);

            next_ref_img = imagelist_obj["ref_img_url"];
            next_ref_img_id = imagelist_obj["ref_img_id"];
            next_group_imgurls = imagelist_obj["dis_imgurls"];
            next_group_imgids = imagelist_obj["dis_imgids"];

            this.createImageDom(
                            true
                            , next_ref_img_id
                            , next_ref_img
                            , next_group_imgids
                            , next_group_imgurls
            );
        }
    }

}