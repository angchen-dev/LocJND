import { globalStatus } from "./GlobalStatus"

export default class SaveData2Csv {
    constructor() {
        this._data = "";
        $(".to-csv").on("click", ()=> {
            this._convertData();
            $(".to-csv").attr("download", (new Date()).getTime()+"_eye-tracking_jnd.csv").attr("href", "data:text/csv;charset=utf-8," + this._data);
        });
    }

    _convertData() {
        let output = "";
        $.each(globalStatus.jnd_result, function(img, val) {
            output += img 
                    + "," + val[0] + "," + val[1] + "," + val[2] + "," + val[3] + "," + val[4] + "," 
                    + globalStatus.loc_result[img] 
                    + "\n"
        })
        this._data = "Ref Image,Distortion Level,JND Point(IMG), Start Timestamp, End Timestamp, Slider Tracking, locations\n" + output;
        this._data =  encodeURIComponent(this._data);
    }
}
