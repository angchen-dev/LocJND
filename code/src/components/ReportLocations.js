import * as $ from 'jquery';
import { globalStatus } from "./GlobalStatus";

export default class ReportLocations {
    constructor() {}

    init() {
        $(".image-pool").on("click", (event)=>{
            this.drawCross(event)
        })
    }

    drawCross(event) {
        if (globalStatus.locationNum < 3) { // only record 3 regions
            if (globalStatus.isFindCriticalPoint) {
                
                let offsetX = event.offsetX; // cross x
                let offsetY = event.offsetY; // cross y
                let clientWidth = event.target.clientWidth; // width of image
                let clientHeight = event.target.clientHeight; // height of image
                let clientX = event.clientX; // The distance from the trigger point to the upper left corner of the browser's visible area 
                let clientY = event.clientY; 
                let screenX = event.screenX; 
                let screenY = event.screenY; 

                let timestamp = (new Date()).getTime();
                globalStatus.loc_result[globalStatus.ref_img] += `-('ox':${offsetX}_'oy':${offsetY}_'imw':${clientWidth}_'imh':${clientHeight}_'cx':${clientX}_'cy':${clientY}_'sx':${screenX}_'sy':${screenY}_'et':${timestamp})`;
                globalStatus.cur_locs.push([offsetX, offsetY])
                let new_cross_tmp = $("#cross-temp").clone()
                                                    .css("display", "inline")
                                                    .css("left", event.clientX-15)
                                                    .css("top", event.clientY-15)
                                                    .css("z-index", 2)
                                                    .attr("class", "cross");
            
                $(".cross-panel").append(new_cross_tmp);
                globalStatus.locationNum += 1;
            }
        }
    }
}
