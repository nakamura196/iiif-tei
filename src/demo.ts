import {curation2tei} from "./index"

(async () => {
    const url = "https://mp.ex.nii.ac.jp/api/curation/json/b6ea1384-039d-4440-9cb5-c2be149b3daf"
    const xml_string = await curation2tei(url);
    console.log(xml_string);
})();