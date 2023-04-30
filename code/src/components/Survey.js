import { getLocalData, storeLocalData } from "../tools/ManageLocalData";
import { globalStatus } from "./GlobalStatus"

export default class Survey {
    constructor() {
        $(".save-survey").on("click", ()=>{
            this._getResult();
        });
    }

    _getResult() {
        let survey_items = ["inst", "pay", "job"];
        let item_group = [];
        let cnt = 0;
        for (let i = 0, length1 = survey_items.length; i < length1; i++) {
            item_group = $("input[name='" + survey_items[i] + "']");
            for (let j = 0, length2 = item_group.length; j < length2; j++) {
                if (item_group[j].checked) {
                    cnt += 1;
                    globalStatus.survey_result += survey_items[i] + "=" + item_group[j].value + ";";
                    break;
                }
            }
        }

        globalStatus.survey_result += "suggestion:" + $("#suggestion").val();
        $("input.survey").val(globalStatus.survey_result);

        if (cnt == 3) {
            $(".show-survey").attr("disabled", true);
            storeLocalData("didSurveyBefore", "true");
        } else {
            storeLocalData("didSurveyBefore", "false");
        }
    }
}

export function isDidSurvey() {
    if (getLocalData("didSurveyBefore") && getLocalData("didSurveyBefore")=="true") return true;
    
    return false;
}