/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: API use for user login..
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        schema:
 *          type: object
 *          required: [ identifier, password ]
 *          properties:
 *            email:
 *              type: string
 *              description: title for post
 *              example: 'rupali.pawar@nimapinfotech.com'
 *            password:
 *              type: string
 *              description: content for post
 *              example: 1234567890
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *         description: Product
 *         schema:
 *           type: object
 *           description: not found
 *           properties:
 *             message:
 *               title: message
 *               type: string
 *               example: not found
 */
/**
 * @swagger
 * /auth/logout:
 *  post:
 *    tags:
 *      - Auth
 *    summary: API use for user login..
 *    security:
 *       - bearerAuth: []
 *    consumes:
 *      - application/json
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *         description: Product
 *         schema:
 *           type: object
 *           description: not found
 *           properties:
 *             message:
 *               title: message
 *               type: string
 *               example: not found
 */
 /**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Forgot password (step 1)
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: email
 *         description: Email to receive OTP
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               example: rupali.pawar@nimapinfotech.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: success
 *       422:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: user not found
 */
/**
 * @swagger
 * /auth/verify-otp/{id}:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify OTP
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: User ID or request identifier
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - otp
 *           properties:
 *             email:
 *               type: string
 *               example: rupali.pawar@nimapinfotech.com
 *             otp:
 *               type: string
 *               example: "6008"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: OTP verified
 *       400:
 *         description: Invalid or expired OTP
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Invalid OTP
 */



 /**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Forgot password (step 2)
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: "token"
 *         in: "path"
 *         description: "Token of user"
 *         required: true
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required: [ newPassword ]
 *           properties:
 *             newPassword:
 *               type: string
 *               description: email
 *               example: rupali.pawar@nimapinfotech.com
 *     responses:
 *       200:
 *         description: otp verified
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               title: message
 *               type: string
 *               example: success
 *       422:
 *         description: user not found
 *         schema:
 *           type: object
 *           description:  user not found
 *           properties:
 *             message:
 *               title: message
 *               type: string
 *               example: user not found
 */

/**
 * @swagger
 * /auth/update-password/{id}:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Update user password
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: User ID
 *       - in: body
 *         name: body
 *         required: true
 *         description: Password update payload
 *         schema:
 *           type: object
 *           required:
 *             - oldPassword
 *             - newPassword
 *             - confirmPassword
 *           properties:
 *             oldPassword:
 *               type: string
 *               example: Password@2000
 *             newPassword:
 *               type: string
 *               example: Password@3000
 *             confirmPassword:
 *               type: string
 *               example: Password@3000
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Password updated successfully
 *       400:
 *         description: Password validation or mismatch
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Old password is incorrect or passwords do not match
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 */
 
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth (Customer)
 *     summary: Customer Login with OTP
 *     description: Allows customers to log in using their mobile number or email with OTP. Must include `isCustomer=true` as query param.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: isCustomer
 *         required: true
 *         type: boolean
 *         default: true
 *         description: Set this to true for customer login
 *       - in: body
 *         name: body
 *         required: true
 *         description: Customer's identifier and OTP
 *         schema:
 *           type: object
 *           required:
 *             - identifier
 *             - otp
 *           properties:
 *             identifier:
 *               type: string
 *               description: Mobile number or email of the customer
 *               example: "9321566700"
 *             otp:
 *               type: string
 *               description: One-time password sent to the customer
 *               example: "4083"
 *     responses:
 *       200:
 *         description: Customer logged in successfully
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *             message:
 *               type: string
 *               example: Login successful
 *       401:
 *         description: Invalid OTP or user not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Invalid OTP
 */
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth (Customer)
 *     summary: Logout customer
 *     description: Logs out a customer by invalidating their session. Requires Bearer token and `isCustomer=true` query param.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isCustomer
 *         required: true
 *         type: boolean
 *         description: Must be true to logout customer
 *     responses:
 *       200:
 *         description: Logout successful
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Customer logged out successfully
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 */


/**
 * @swagger
 * /auth/generate-otp:
 *   post:
 *     tags:
 *       - Auth (Customer)
 *     summary: Generate OTP
 *     description: Sends an OTP to the customer's mobile number.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Mobile number to receive OTP
 *         schema:
 *           type: object
 *           required:
 *             - mobileNumber
 *           properties:
 *             mobileNumber:
 *               type: string
 *               description: Customer's mobile number
 *               example: "9606826387"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: OTP sent successfully
 *       400:
 *         description: Invalid or missing mobile number
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Mobile number is required
 */
