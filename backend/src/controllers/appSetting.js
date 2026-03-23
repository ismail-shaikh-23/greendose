const response = require("../../utils/response");
const { updateLogo } = require("../services/appSetting");

exports.updateLogo = async (req, res) => {
    const result = await updateLogo(req.body.fileId);
    return response.created(res, result)
};