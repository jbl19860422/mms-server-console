const utils = {
    timeConverter(t){
        if (t == 0) {
            return "";
        }
        var tims = new Date(t*1000).toLocaleString('zh', {hour12:false});
        return tims;
    }
}
export default utils