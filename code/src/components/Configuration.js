import { globalStatus } from "./GlobalStatus";

export { config };

const MAX_HIT = 20 // no limitation

const config = {
    MAX_HIT: MAX_HIT 
    , WARNING_MESSAGE: {
        "mobile_device":"Mobile Device is not suitable for this work, please use PC, otherwise your work will be rejected."
        , "maximize_browser": "Please maximize your browser."
        , "correct_browser": "To enable all interface features, please use Chrome."
        , "same_monitor": "Please use the same monitor."
        , "scale_browser": "Please don't change the browser zoom level. You can set it back from browser menu, or using the CMD/CTRL and +/- key combination, or using CMD/CTRL and mouse scroll combination. Thank you."
        , "please_drag": "Please adjust the slider until you find the flickering critical point." 
        , "resolution" : "Monitor resolution does not fulfill the requirement. Width>=1366, height>=768."                                                      
        , "lose_qualification": "Unfortunately, you lost the qualification for this study because you failed lots of test questions. You are not allowed to do more HITs from this study. Please submit your result if any, and exit the experiment. Thank you for your cooperation."
        , "reach_max_hit_hum": `Dear participant, you have finished ${MAX_HIT} HITs that reached the upper limit of the HIT number. You are not allowed to do more HITs from this study. Please submit your result if any, and exit the experiment. Thank you for your cooperation.`
        , "failed_questions": "You failed the test question. Please pay more attention to the study. Otherwise, you will lose your qualification for this study."
        , "critical_point": "Please adjust the slider until you find the critical flickering point. Then click button \"I found the critical point\". Spending around 30 seconds on finding the critical point is recommended."
        , "report_location": "Please report 3 different locations where you perceive that the image is flickering locally by clicking the image. Then click button \"Next Image\". Spending around 30 seconds on reporting the locations is recommended."
        , "loc_training_msg" : "Your answer is incorrect. Please note that the expected regions with flicker are separated. Hint: the expected regions are located within the circles."
        , "wrong_calibration": `<span style="color:#BA4A00;font-size:20pt">Your monitor's size is detected as small. Please use a bank card , and do the calibration again, or switch to a larger monitor. Thank you for your cooperation.</span>`
    }

    , SESSION_MSG: {
        "training_description": "In this session, you will learn how to find the critical flickering point of an image. Remember, at this critical level of flickering, you can perceive some regions with slight flickering while in larger regions flicker is not yet visually apparent. You will get $0.1 as bonus in this session."
        , "thank_you": "Thank you for your participation! Please submit your HIT result. <br> <span class='text-primary'>Your assignment will be approved as soon as possible.</span>"
        , "survey_msg": "Thank you for your participation! <br>Please take a short survey before submitting your HIT result."
    }
    , ENV_MIN_W: 1360
    , ENV_MIN_H: 760
    , IMAGE_WIDTH_CM: 13.797
    , IMAGE_HEIGHT_CM: 10.347
    , DISTANCE: 30 //one image
    , FREQ: Math.round(1000/8) //ms
    , EXP_NAME: "loc_jnd_30.04_v2"
    , REF_IMG_STEP: 100 // 100 -> first jnd
    , REF_IMG_IDX_MAX: 100 //distorted bg img num
    , IMG_PREFIX_NAME: "./data/selected_images/"
    , MODE: "offline" //offline/amt
    , IS_PILOT_EXP: false
    , TRAINING_SLIDER_AUTO_INTERVAL: 20 //ms
    , HIT_PASS_TOTAL_THR: 10
    , HIT_PASS_ACC: 0.7
    , LOC_THR: 2
    , SIGMA: 35
    , ORIG_H: 480
    , ORIG_W: 640
    , hasDisqualification: true
    , hasMaxHitNumLimit: true
    , monitorHeight: 17 // cm
    , calibrationCntLim: 3
}

