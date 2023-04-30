import Calibration from "./Calibration"
import { config } from './Configuration';
import { globalStatus } from './GlobalStatus';
import Environment from "./Environment"
import PerceiveFlickering from "./PerceiveFlickering"

const seeFlickering = new PerceiveFlickering();

export function keyboardControl(){
    const calibration = new Calibration();

    document.onkeyup = function (event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which || e.code;
        switch (keyCode) {
            case 13://space
            case 32://enter
            if($(".see-flickering").css("display") == "inline-block") {
                seeFlickering.clickSeeFlickering();
            } else if($(".next-image").css("display") == "inline-block") {
                seeFlickering.clickNextImage();
            }
                break;
            default:
                break;
        }
    }

    document.onkeydown = function (event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        switch (keyCode) {
            case 38://up arrow
                e.preventDefault();
                if (globalStatus.isCalibrated == false) {
                    $(".finish-calibration").css("visibility", "visible");
                    calibration.setStartTimestamp();
                    calibration.increase();
                }
                break;
            case 40://down arrow
                e.preventDefault();
                if (globalStatus.isCalibrated == false) {
                    $(".finish-calibration").css("visibility", "visible");
                    calibration.setStartTimestamp();
                    calibration.decrease();    
                }
                break;
            default:
                break;
        }
    }
}


function btnAnimation(btnclass) {
    let cls = $("." + btnclass).attr('class').split(" ").find(t=>t.startsWith("btn-"));

    $("." + btnclass).removeClass(cls);
    $("." + btnclass).addClass("btn-outline-secondary");
    let btnInterval = setInterval (function() {
        $("." + btnclass).removeClass("btn-outline-secondary");
        $("." + btnclass).addClass(cls);
        clearInterval(btnInterval);
    }, 200);
}