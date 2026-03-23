/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user
 *     description: Creates a new user with the provided information.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: User registration details
 *         schema:
 *           type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - userName
 *             - email
 *             - password
 *             - roleId
 *             - mobileNumber
 *           properties:
 *             firstName:
 *               type: string
 *               example: "Rupali"
 *             lastName:
 *               type: string
 *               example: "Pawar"
 *             userName:
 *               type: string
 *               example: "Rups"
 *             email:
 *               type: string
 *               format: email
 *               example: "rupali.pawar@nimapinfotech.com"
 *             password:
 *               type: string
 *               format: password
 *               example: "Rupali@2003"
 *             roleId:
 *               type: string
 *               example: "1"
 *             mobileNumber:
 *               type: string
 *               example: "9606826387"
 *     responses:
 *       201:
 *         description: User created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User created successfully
 *             data:
 *               type: object
 *       400:
 *         description: Validation error or user already exists
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Email already exists
 */

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users
 *     description: Retrieves a list of all users. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Users fetched successfully
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   firstName:
 *                     type: string
 *                     example: Rupali
 *                   lastName:
 *                     type: string
 *                     example: Pawar
 *                   userName:
 *                     type: string
 *                     example: Rups
 *                   email:
 *                     type: string
 *                     example: rupali.pawar@nimapinfotech.com
 *                   mobileNumber:
 *                     type: string
 *                     example: 9606826387
 *                   roleId:
 *                     type: integer
 *                     example: 1
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
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID
 *     description: Fetch a single user's details using their ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the user to fetch
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User fetched successfully
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 firstName:
 *                   type: string
 *                   example: Rupali
 *                 lastName:
 *                   type: string
 *                   example: Pawar
 *                 userName:
 *                   type: string
 *                   example: Rups
 *                 email:
 *                   type: string
 *                   example: rupali.pawar@nimapinfotech.com
 *                 mobileNumber:
 *                   type: string
 *                   example: 9606826387
 *                 roleId:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User not found
 *       401:
 *         description: Unauthorized
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 */


/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user by ID
 *     description: Deletes a specific user by their ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User deleted successfully
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User not found
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
 * /user/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user by ID
 *     description: Updates user details by user ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the user to update
 *       - in: body
 *         name: body
 *         required: true
 *         description: User fields to update
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: Rupali
 *             lastName:
 *               type: string
 *               example: Pawar
 *             userName:
 *               type: string
 *               example: Rups
 *             email:
 *               type: string
 *               example: rupali.pawar@nimapinfotech.com
 *             mobileNumber:
 *               type: string
 *               example: 9606826387
 *             roleId:
 *               type: integer
 *               example: 1
 *     responses:
 *       200:
 *         description: User updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User updated successfully
 *             data:
 *               type: object
 *       400:
 *         description: Validation or update error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Invalid input
 *       401:
 *         description: Unauthorized
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User not found
 */


