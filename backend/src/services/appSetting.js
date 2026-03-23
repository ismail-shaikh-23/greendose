const commonFunctions = require('../../utils/commonFunctions');
const { NoDataFoundError } = require('../../utils/customError');
const fs = require('fs');
const path = require('path');
const { LOGO_FILE_PATH } = require('../../utils/enums');
const handleSuccess = require('../../utils/successHandler');

exports.updateLogo = async (fileId) => {
    const result = await commonFunctions.findOne('fileUpload', { condition : { id: fileId } });
    if(!result){
        throw new NoDataFoundError(`Cannot find the file with this id ${fileId}`);
    }
    fs.copyFileSync(path.join('public',result.path),LOGO_FILE_PATH);
    return handleSuccess('Logo file updated successfully');
};