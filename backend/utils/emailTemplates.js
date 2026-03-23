/* eslint-disable max-len */
exports.resetPasswordSubject = `Password Reset Confirmation - ${new Date().toLocaleString()}`;
exports.resetPassword = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #333;">Password Changed Successfully</h2>
    <p>Hello,</p>
    <p>Your password has been changed successfully. 
    You can now log in using your new password.</p>
    <p>If you did not make this change, 
    please contact our support immediately.</p>
    <br/>
    <p>Thanks,<br/>
    <strong>Team GreenDose, </strong><br/>
    <strong>Date: ${new Date().toLocaleDateString()}</strong><br/>,
    <strong>Reference ID: \${REFERENCE_ID_PLACEHOLDER}</strong></p>
  </div>
`;

exports.setNewPasswordSubject = `Password Update Confirmation - ${new Date().toLocaleString()}`;
exports.setNewPassword = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #333;">Password Updated</h2>
    <p>Hello,</p>
    <p>Your password has been updated as per your request.</p>
    <p>If this wasn't you, 
    please change your password immediately or contact support.</p>
    <br/>
    <p>Thanks,<br/>
    <strong>Team GreenDose, </strong><br/>
    <strong>Date: ${new Date().toLocaleDateString()}</strong><br/>,
    <strong>Reference ID: \${REFERENCE_ID_PLACEHOLDER}</strong></p>
  </div>
`;

exports.forgotPasswordSubject = `\${NAME_PLACEHOLDER} your OTP for Password Reset Request - ${new Date().toLocaleString()}`;
exports.forgotPassword = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>Hello,</p>
    <p>You have requested to reset your password. 
    Use the OTP below to proceed:</p>
    <h3 style="color: #007bff;">
    Your OTP: <strong>\${OTP_PLACEHOLDER}</strong></h3>
    <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
    <br/>
    <p>Thanks,<br/>
    <strong>Team GreenDose, </strong><br/>
    <strong>Date: ${new Date().toLocaleDateString()}</strong><br/>,
    <strong>Reference ID: \${REFERENCE_ID_PLACEHOLDER}</strong></p>
  </div>
`;