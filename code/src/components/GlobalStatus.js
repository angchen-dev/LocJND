export const globalStatus = {
    isCalibrated : false
    , devicePixelRatio: 0
    , os_info: ""
    , flicker_interval : null
    , test_image: ""
    , training_gt: Object()
    , test_gt: Object()
    , training_imgs_count: 0
    , quiz_imgs_count: 0
    , SRC_IMG_IDX_LIST: []
    , src_img_idx_list_copy: []
    , ins_flickering_interval: null
    , progress_task_cnt: 0 // progress bar
    , calibration_start_time: ""
    , dis_imgurls: []
    , ref_img: "" // src image id, no compressed
    , ref_img_id: "" // if not first jnd, distorted image can be reference image
    , distorted_val: 0
    , distorted_img_id: ""
    , slider_tracking: ""
    , isStart: false
    , curr_src_num: 0
    , isFindCriticalPoint: false
    , locationNum: 0
    , section: "study" // training / study
    , jnd_result: {}
    , loc_result: {}
    , dis_imgids: []
    , bg_img_idx: 0
    , progress_task_num: 0
    , env_bg_interval: null
    , survey_result: "survey result:"
    , worker_jnd_val: 0
    , curr_img_count: 0
    , pass_test: false
    , cur_img_h: 480
    , cur_img_w: 640
    , cur_locs:[]
}