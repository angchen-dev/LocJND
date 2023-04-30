import * as $ from 'jquery';
import { globalStatus } from "./GlobalStatus"
import { config } from "./Configuration"; 


export function progressBarInit(img_cnt) {
    globalStatus.progress_task_cnt = 0;
    globalStatus.progress_task_num = (config.REF_IMG_IDX_MAX / config.REF_IMG_STEP) * img_cnt;
    
    $(".progress-bar").attr("aria-valuemax", globalStatus.progress_task_num*10)
                    .css("width", 100*(globalStatus.progress_task_cnt / globalStatus.progress_task_num) + "%")
                    .html(globalStatus.progress_task_cnt + "/" + globalStatus.progress_task_num); //progress_step = 10
}

export function progressBarAdd() {
    $(".progress-bar").css("width", 100 * (globalStatus.progress_task_cnt / globalStatus.progress_task_num) + "%")
                    .html(globalStatus.progress_task_cnt + "/" + globalStatus.progress_task_num);
}