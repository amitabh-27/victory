let respObject = {
    success : false
};

module.exports.RESPONSE = (req, res) => {
    try{

    }catch(err){
        respObject["message"] = responseMessages["SOMETHING_WRONG"];
        res.status(400).json(respObject);
    }
}