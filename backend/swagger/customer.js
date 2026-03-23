/**
 * @swagger
 * /customer:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Register a new customer
 *     description: Registers a new customer. No authentication/token required.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Customer registration details
 *         schema:
 *           type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - userName
 *             - email
 *             - roleId
 *             - mobileNumber
 *           properties:
 *             firstName:
 *               type: string
 *               example: Sahil
 *             lastName:
 *               type: string
 *               example: Nikam
 *             userName:
 *               type: string
 *               example: SahilNikam
 *             email:
 *               type: string
 *               format: email
 *               example: sahilnikam@nimapinfotech.com
 *             roleId:
 *               type: integer
 *               example: 3
 *             mobileNumber:
 *               type: string
 *               example: "9321566700"
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Customer created successfully
 *             customer:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 firstName:
 *                   type: string
 *                   example: Sahil
 *                 lastName:
 *                   type: string
 *                   example: Nikam
 *                 email:
 *                   type: string
 *                   example: sahilnikam@nimapinfotech.com
 *                 roleId:
 *                   type: integer
 *                   example: 3
 *                 mobileNumber:
 *                   type: string
 *                   example: "9321566700"
 *       400:
 *         description: Bad Request - Invalid input
 *       409:
 *         description: Conflict - Email or username already exists
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /customer:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get all customers
 *     description: Retrieves a list of all registered customers. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of customers
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               firstName:
 *                 type: string
 *                 example: Sahil
 *               lastName:
 *                 type: string
 *                 example: Nikam
 *               userName:
 *                 type: string
 *                 example: SahilNikam
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sahilnikam@nimapinfotech.com
 *               roleId:
 *                 type: integer
 *                 example: 3
 *               mobileNumber:
 *                 type: string
 *                 example: "9321566700"
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /customer/{id}:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get customer by ID
 *     description: Retrieves a single customer's details by their ID. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         type: integer
 *     responses:
 *       200:
 *         description: Customer fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             firstName:
 *               type: string
 *               example: Sahil
 *             lastName:
 *               type: string
 *               example: Nikam
 *             userName:
 *               type: string
 *               example: SahilNikam
 *             email:
 *               type: string
 *               format: email
 *               example: sahilnikam@nimapinfotech.com
 *             roleId:
 *               type: integer
 *               example: 3
 *             mobileNumber:
 *               type: string
 *               example: "9321566700"
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */





/**
 * @swagger
 * /customer/{id}:
 *   delete:
 *     tags:
 *       - Customer
 *     summary: Delete customer by ID
 *     description: Permanently deletes a customer from the system. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the customer to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
 


/**
 * @swagger
 * /customer/{id}:
 *   put:
 *     tags:
 *       - Customer
 *     summary: Update customer by ID
 *     description: Updates an existing customer's details. Requires Bearer token.
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: Customer ID
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - userName
 *             - email
 *             - roleId
 *             - mobileNumber
 *           properties:
 *             firstName:
 *               type: string
 *               example: Sahil
 *             lastName:
 *               type: string
 *               example: Nikam
 *             userName:
 *               type: string
 *               example: SahilNikam
 *             email:
 *               type: string
 *               example: sahilnikam@nimapinfotech.com
 *             roleId:
 *               type: integer
 *               example: 3
 *             mobileNumber:
 *               type: string
 *               example: 9321566700
 *             isActive:
 *               type: boolean
 *               example: true
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
