import * as $ from 'jquery';
import Environment from "./components/Environment"; 
import Calibration from "./components/Calibration"; 
import { config } from "./components/Configuration"; 
import { storeLocalData, getLocalData } from "./tools/ManageLocalData";
import { globalStatus } from "./components/GlobalStatus";
import { keyboardControl } from "./components/KeyboardControl";
import InitInputData from "./components/InitInputData";
import Instruction from "./components/Instruction";
import { progressBarInit } from "./components/ProgressBar";
import InitImages from "./components/InitImages"
import PerceiveFlickering from "./components/PerceiveFlickering"
import ReportLocations from "./components/ReportLocations"
import SaveData2Csv from "./components/SaveData2Csv"
import Survey from "./components/Survey"

const calibration = new Calibration();
const env = new Environment(globalStatus);
const initInputData = new InitInputData();
const instruction = new Instruction();
const initImages = new InitImages();
const seeFlickering = new PerceiveFlickering();
const reportLoc = new ReportLocations();
const saveData2CSV = new SaveData2Csv();
const survey = new Survey();

$("#js-warning").css("display", "none");

if (!env.isPC()) {
    env.showWarningCover("mobile_device");
} else if (!env.isCorrectResolution()) {
    env.showWarningCover("resolution");
} else {
    initInputData.storeResolution();
    if (!env.isNotMaximizedBrowser) {
        initInputData.checkLocalExpName();
        if (!getLocalData("have_qualification")) {
            storeLocalData("have_qualification", "true")
        }

        env.check();
        env.checkInBackground();
        
        if (config.hasDisqualification) {
            if (getLocalData("have_qualification") == "true") {
                if (config.hasMaxHitNumLimit) {
                    if (parseInt(getLocalData("hit_num")) >= config.MAX_HIT) {
                        clearInterval(globalStatus.env_bg_interval);
                        env.showWarningCover("reach_max_hit_hum");
                    } else {
                        key_steps();
                    }
                } else {
                    key_steps();
                }
            } else if (getLocalData("have_qualification") == "false") {
                clearInterval(globalStatus.env_bg_interval);
                env.showWarningCover("lose_qualification");
            }
        } else {
            key_steps();
        }
    }
}

function key_steps() {
    env.getBrowserInfo();
    initInputData.getSrcImageNumber();
    instruction.show();
    instruction.initBtn();
    calibration.init();
    progressBarInit(globalStatus.training_imgs_count);
    initImages.init();
    initImages.getDistortedImage();
    initImages.startSection();
    seeFlickering.init();
    reportLoc.init();
    keyboardControl();
}