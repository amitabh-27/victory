module.exports = {
    setResponseObject: async (req, success, message, data) => {
        let resp = {
            success: success,
        };
        if (message) {
            resp["message"] = message;
        }
        if (data) {
            resp["data"] = data;
        }
        
        req.newRespData = await resp;
        return;
    },

    getDateFromObj: async (date) => {
        var date = new Date(date);
        var day = date.getDate(); //Date of the month: 2 in our example
        var month = date.getMonth(); //Month of the Year: 0-based index, so 1 in our example
        var year = date.getFullYear()
        return day + "/" + month + "/" + year
    },

    getOTP() {
        var otp = Math.floor(100000 + Math.random() * 900000);
        return otp;
    },

    getRandomName(max) {
            let randomNames = ['John', 'Sally', 'Alex',"Kristen","Nicholas","Sandy"];
             return randomNames[Math.floor(Math.random() * max)];
    },

    getRandomEmail(max) {
        let emailNames = ['abc', 'xyz', 'hello',"zero","happy","Qwer"];
        return emailNames[Math.floor(Math.random() * max)];
},


}