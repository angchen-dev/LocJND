import * as $ from 'jquery';
import { config } from "./Configuration"; 
import { globalStatus } from "./GlobalStatus";

export function locAccuracy(gt_locs, res_locs) {
    // console.log("--- gt ---");
    // console.log(gt_locs);
    // console.log("--- res_locs ---");
    // console.log(res_locs);

    let _res_locs = _scale_locs(res_locs, 
                                globalStatus.cur_img_h, 
                                globalStatus.cur_img_w, 
                                config.ORIG_H, config.ORIG_W);
    // console.log("--- scale res_locs ---");
    // console.log(_res_locs);

    let clusters = _locations_clusters(gt_locs, _res_locs);
    // console.log("--- clusters ---");
    // console.log(clusters);

    let match_distance_num = _match_distance_num(clusters, config.SIGMA * 2);
    let is_pass = _is_pass_thr(match_distance_num, config.LOC_THR);
    // console.log(`--- location: match ${match_distance_num}, is passed: ${is_pass}`);
    return is_pass;
}

function _match_distance_num(clusters, thr) {
    let cnt = 0
    clusters.forEach((c, idx) => {
        let euclid_distance = _euclidean_distance(c[0], c[1]);
        if (euclid_distance <= thr) {
            cnt ++;
        }
    })
    return cnt
}

function _locations_clusters(gt_locs, res_locs) {
    let clusters = []

    gt_locs.forEach((gt_l, g_idx) => {
        let min_distance = Infinity;
        let match_res_l = [];

        res_locs.forEach((res_l, r_idx) => {
            let distance = _euclidean_distance(gt_l, res_l);
            if(distance < min_distance) {
                match_res_l = res_l
                min_distance = distance  
            }
        })

        clusters.push([match_res_l, gt_l]);
    })
    
    return clusters;
}

function _is_pass_thr(match_num, thr) {
    if (match_num >= thr) {return true;}
    return false;
}

function _euclidean_distance(p1, p2) {
    return Math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)
}

function _scale_locs(res_locs, cur_img_h, cur_img_w, orig_img_h, orig_img_w) {
    let ratio = orig_img_h / cur_img_h;
    let _res_locs = res_locs.slice(0);
    // console.log("--- source result ---");
    // console.log(res_locs);

    res_locs.forEach((e, idx)=> {
        _res_locs[idx] = [Math.floor(ratio * e[0]), Math.floor(ratio * e[1])]
    })

    // console.log("--- scale result ---");
    // console.log(_res_locs);
    return _res_locs
}

