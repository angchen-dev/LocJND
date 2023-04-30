import * as $ from 'jquery';
import { getLocalData } from "../tools/ManageLocalData";
import { config } from "./Configuration"; 
import { globalStatus } from "./GlobalStatus";

export default class Environment {
    constructor () {
        this.isCorrectEnvironment = true;
        this.isMaximizedBrowser = true;
        this._isTheSameBrowser = true;
        this._isNotZoomedBrowser = true;
    }

    check() {
        // check it is a maximized browser or not 
        if(
            screen.availWidth - window.outerWidth > 100 || 
            screen.availHeight - window.outerHeight > 100
        ) {
            this.showWarningCover("maximize_browser");
            this.isMaximizedBrowser = false;
        } else {
            this.isMaximizedBrowser = true;
        }

        // check it is the same monitor during the experiment or not 
        if (
            globalStatus.isCalibrated || 
            getLocalData("isCalibrated") == "true"
        ) {
            if (
                screen.availWidth != getLocalData("screen_width") || 
                screen.availHeight != getLocalData("screen_height")
            ) {
                this.showWarningCover("same_monitor");
                this._isTheSameBrowser = false;
            } else {
                this._isTheSameBrowser = true;
            }
        } 

        // check the browser is zoomed or not
        if (
            globalStatus.isCalibrated && 
            globalStatus.cali_devicePixelRatio!=0
        ) {
            if (window.devicePixelRatio != globalStatus.devicePixelRatio) {
                this.showWarningCover("scale_browser");
                this._isNotZoomedBrowser = false;
            } else {
                this._isNotZoomedBrowser = true;
            }
        } 

        this.isCorrectEnvironment = this.isMaximizedBrowser && 
                                    this._isTheSameBrowser && 
                                    this._isNotZoomedBrowser;

        if (this.isCorrectEnvironment) {
            this.hideWarningCover();
        }
    }

    checkInBackground() {
        globalStatus.env_bg_interval = setInterval(()=>this.check(),1000);  
    }

    showWarningCover(message) {
        $(".warning-cover").css("visibility", "visible");
        $(".warning-msg").html(config.WARNING_MESSAGE[message]);
    }
    
    hideWarningCover() {
        $(".warning-cover").css("visibility", "hidden");
        $(".warning-msg").html();
    }

    getBrowserInfo() {

        for (let key in window.navigator) {
            if (!$.isFunction(window.navigator[key]) && typeof window.navigator[key] != 'object') {
                globalStatus.os_info += key+":"+window.navigator[key] + ";"; 
            }
        }  
      
        for (let key in window.screen) {
            if (!$.isFunction(window.navigator[key]) && typeof window.navigator[key] != 'object') {
                globalStatus.os_info += key+":"+window.navigator[key] + ";"; 
            }
        }  

        globalStatus.os_info += "Resolution:"+screen.width+"*"+screen.height+";"
                    +"PixelRatio:"+window.devicePixelRatio+";"
                    +"TimeZone:"+(-new Date().getTimezoneOffset()/60)+";"

        if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
            globalStatus.os_info += "Downlink:" + navigator.connection.downlink * 1024 /8 + ";"
        }

        $.getJSON('https://ipapi.co/json/', function(data) {
            let ip_info = JSON.stringify(data, null, 2);
            globalStatus.os_info += "+" + ip_info;
        });  
    }


    isPC() {
        // filter mobile devices
        let userAgentInfo = navigator.userAgent.toLowerCase();
        let Agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"];
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) >= 0) {
                this.showWarningCover("mobile_device");
                return false;
            }
        }
        return true;
    }

    isCorrectBrowser() {
        // must use Chrome 
        let isChrome = !!window.chrome;
        if (isChrome) {
            return true;
        } else {
            this.showWarningCover("correct_browser");
            return false;
        }
    }

    isCorrectResolution() {
        if (screen.width < config.ENV_MIN_W || screen.height < config.ENV_MIN_H) {
            return false
        } else {
            return true;
        };
    }
} 


