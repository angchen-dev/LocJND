// import * as $ from 'jquery';
import { storeLocalData, getLocalData } from "../tools/ManageLocalData";
import { config } from "./Configuration"; 
import { globalStatus } from "./GlobalStatus";
import { flickeringInit } from "./Flickering"

export default class Calibration {
    constructor () {}

    init() {
        this.checkHadCalibrated();
        this.keepDecreasing();
        this.keepIncreasing();

        if (!getLocalData("isCalibrated")) {
            storeLocalData("isCalibrated", "false");
        }

        $(".finish-calibration").on('click', (e)=> {
            let calibration_time = (new Date()).getTime() - globalStatus.calibration_start_time;
            globalStatus.os_info += `calibration_time:${calibration_time};`
            storeLocalData("calibration_time", calibration_time);
            this.scaleImage();
        });

        $(".adjust-distance").on('click', (e)=> {
            $(".display-panel").css("display", "none");
            $(".jnd-panel").css("display", "inline");
            $(".see-flickering").css("display", "inline").attr("disabled", false);
            $(".range").focus();
            flickeringInit();
            $(".section-msg").css("display", "inline");
            $(".image-panel, .controller-panel").css("display", "inline").css("visibility", "hidden");
            $(".range, .next-image").attr("disabled", true);
        });
    }

    checkHadCalibrated() {
        
        if ( // did not do the calibration
            getLocalData("outerWidth") == null 
            && getLocalData("outerHeight") == null
            && getLocalData("availWidth") == null
            && getLocalData("availHeight") == null
        ) {
            storeLocalData("outerWidth", window.outerWidth);
            storeLocalData("outerHeight", window.outerHeight);
            storeLocalData("availWidth", screen.availWidth);
            storeLocalData("availHeight", screen.availHeight);
            storeLocalData("isCalibrated", "false");
            globalStatus.isCalibrated == false;
        } 

        if ( // did the calibration
            getLocalData("isCalibrated") == "true"
            && window.outerWidth == getLocalData("outerWidth") 
            && window.outerHeight == getLocalData("outerHeight") 
            && screen.availWidth == getLocalData("availWidth") 
            && screen.availHeight == getLocalData("availHeight")
        ) { // environment is fixed
            globalStatus.isCalibrated = true;
            this.hadCalibratedAction();

        } else { // environment was changed, update the environment values
            globalStatus.isCalibrated = false;
            storeLocalData("isCalibrated", "false");
            storeLocalData("outerWidth", window.outerWidth);
            storeLocalData("outerHeight", window.outerHeight);
            storeLocalData("availWidth", screen.availWidth);
            storeLocalData("availHeight", screen.availHeight);
        }

        if (globalStatus.isCalibrated == false) {
            $(".card-panel").css("display", "inline");
        }
    }

    keepIncreasing() {
        let frameInterval = null;
        $(".zoom-in-frame").on('mousedown', (e)=>  {
            if (e.which == 1) { // lefy key 1, 2, scroll, 3, right key
                $(".finish-calibration").css("visibility", "visible");
                this.setStartTimestamp();
                frameInterval = setInterval(()=>this.increase(),30);
            }
        })
        
        $(".zoom-in-frame").on('mouseup', (e)=> {
            if (e.which == 1) { // lefy key 1, 2, scroll, 3, right key
                clearInterval(frameInterval);
            }
        })
        
        $(".zoom-in-frame").on('mouseleave', (e)=> {
            if (e.which == 1) { // lefy key 1, 2, scroll, 3, right key
                clearInterval(frameInterval);
            }
        })
    
    }

    keepDecreasing() {
        let frameInterval = null;
        $(".zoom-out-frame").on('mousedown', (e)=>  {
            if (e.which == 1) { // lefy key 1, 2, scroll, 3, right key
                $(".finish-calibration").css("visibility", "visible");
                this.setStartTimestamp();
                frameInterval = setInterval(()=>this.decrease(),30);
            }
        })

        $(".zoom-out-frame").on('mouseup', (e)=> {
            if (e.which == 1) { // lefy key 1, 2, scroll, 3, right key
                clearInterval(frameInterval);
            }
        })

        $(".zoom-out-frame").on('mouseleave', (e)=> {
            if (e.which == 1) { // lefy key 1, 2, scroll, 3, right key
                clearInterval(frameInterval);
            }
        })
    }

    setStartTimestamp() {
        if (!globalStatus.calibration_start_time) {
            globalStatus.calibration_start_time = (new Date()).getTime();
        }
    }

    increase() {
        $(".card-area").width($(".card-area").width() * 1.005)
                        .height($(".card-area").height() * 1.005);
    }

    decrease() {
        $(".card-area").width($(".card-area").width() / 1.005)
                        .height($(".card-area").height() / 1.005);
    }

    scaleImage() {
        // var frame_height = $(".card-area").height();
        // w=53.98 mm, h=85.60mm. ISO 7810
        // var image_width = 0.6 * document.documentElement.clientWidth; //20%, 20%
        // var physical_width = (image_width * 85.60 / frame_width)/10; //cm        
        // var distance = Math.round((physical_width / 2.) / Math.tan(Math.PI / 12.));

        let frame_width = $(".card-area").width() + 6; //px
        let px_cm_rate = frame_width / 8.56
        let browser_height_cm = Math.ceil(screen.height  / px_cm_rate);
        let browser_width_cm = Math.ceil(screen.width / px_cm_rate);
        
        globalStatus.devicePixelRatio = window.devicePixelRatio;
    
        storeLocalData("px_cm_rate", px_cm_rate);
        storeLocalData("browser_width_cm", browser_width_cm);
        storeLocalData("browser_height_cm", browser_height_cm);
        storeLocalData("devicePixelRatio", globalStatus.devicePixelRatio);
        
        if (browser_height_cm >= config.monitorHeight) {
            globalStatus.isCalibrated = true;
            storeLocalData("isCalibrated", "true");
            let calibration_time = -1;
            this._initPanel(px_cm_rate, browser_width_cm, browser_height_cm, calibration_time)
        } else {
            $("#reminder-modal-text").html(config.WARNING_MESSAGE["wrong_calibration"]);
            $("#reminder-modal-btn").html("OK");
            $("#reminder").modal("show");
        }
    }

    hadCalibratedAction() {
        let px_cm_rate = getLocalData("px_cm_rate");
        let browser_width_cm = getLocalData("browser_width_cm");
        let browser_height_cm = getLocalData("browser_height_cm");
        let calibration_time = getLocalData("calibration_time");
        globalStatus.devicePixelRatio = getLocalData("devicePixelRatio");

        this._initPanel(px_cm_rate, browser_width_cm, browser_height_cm, calibration_time)

    }

    _initPanel(px_cm_rate, browser_width_cm, browser_height_cm, calibration_time) {
        globalStatus.os_info += "px_cm_rate:" + px_cm_rate + ";" 
                                + "browser_width_cm:" + browser_width_cm +";"
                                + "browser_height_cm:" + browser_height_cm +";"
                                + "devicePixelRatio:" + globalStatus.devicePixelRatio +";"
                                + "calibration_time:" + calibration_time +";"
        
        let cur_img_h = px_cm_rate * config.IMAGE_HEIGHT_CM;
        let cur_img_w = px_cm_rate * config.IMAGE_WIDTH_CM;
        globalStatus.cur_img_h = cur_img_h;
        globalStatus.cur_img_w = cur_img_w;

        $(".browser-width-cm").html(
                                    "Browser width: " 
                                    + browser_width_cm 
                                    + "cm (" 
                                    + Math.ceil(browser_width_cm*0.393701) 
                                    +"inch)"
                                );

        $(".image, .loading-image, .image-pool").css("width", cur_img_w)
                                                .css("height", cur_img_h);

        $(".range, .image-panel").css("width", cur_img_w)
        
        $(".card-panel").css("display", "none");
        
        $(".distance-value").html(
                                "Please adjust your distance. Distance= " 
                                + config.DISTANCE 
                                + " cm"
                                + " (" 
                                + (config.DISTANCE*0.393701).toFixed(0) 
                                + " inch)"
                            );

        $(".display-panel").css("display", "inline");
    }
}