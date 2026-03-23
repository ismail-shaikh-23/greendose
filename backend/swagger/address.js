/**
 * @swagger
 * /address:
 *   post:
 *     tags:
 *       - Address
 *     summary: Create a new address
 *     description: Creates a new address for the authenticated customer. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Address details
 *         schema:
 *           type: object
 *           required:
 *             - customerId
 *             - mainAddress1
 *             - mobileNumber
 *             - name
 *           properties:
 *             customerId:
 *               type: integer
 *               example: 1
 *             mainAddress1:
 *               type: string
 *               example: "Test"
 *             mainAddress2:
 *               type: string
 *               example: "Test"
 *             landmark:
 *               type: string
 *               example: "Near park"
 *             latitude:
 *               type: string
 *               example: "18.5215"
 *             longitude:
 *               type: string
 *               example: "73.8544"
 *             mobileNumber:
 *               type: string
 *               example: "9664041866"
 *             name:
 *               type: string
 *               example: "Naeem"
 *     responses:
 *       201:
 *         description: Address created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Address created
 *             data:
 *               type: object
 *               description: The created address record
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       400:
 *         description: Validation error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Missing required fields
 */


/**
 * @swagger
 * /address:
 *   get:
 *     tags:
 *       - Address
 *     summary: Get all addresses
 *     description: Fetches all addresses for the authenticated customer. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of addresses
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Address list fetched successfully
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   customerId:
 *                     type: integer
 *                     example: 1
 *                   mainAddress1:
 *                     type: string
 *                     example: "Test"
 *                   mainAddress2:
 *                     type: string
 *                     example: "Test"
 *                   landmark:
 *                     type: string
 *                     example: "Near park"
 *                   latitude:
 *                     type: string
 *                     example: "18.5215"
 *                   longitude:
 *                     type: string
 *                     example: "73.8544"
 *                   mobileNumber:
 *                     type: string
 *                     example: "9664041866"
 *                   name:
 *                     type: string
 *                     example: "Naeem"
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
 * /address/{id}:
 *   get:
 *     tags:
 *       - Address
 *     summary: Get address by ID
 *     description: Fetch a specific address by its ID. Requires Bearer token for authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the address to retrieve
 *     responses:
 *       200:
 *         description: Address fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Address fetched successfully
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 customerId:
 *                   type: integer
 *                   example: 1
 *                 mainAddress1:
 *                   type: string
 *                   example: "Test"
 *                 mainAddress2:
 *                   type: string
 *                   example: "Test"
 *                 landmark:
 *                   type: string
 *                   example: "Near park"
 *                 latitude:
 *                   type: string
 *                   example: "18.5215"
 *                 longitude:
 *                   type: string
 *                   example: "73.8544"
 *                 mobileNumber:
 *                   type: string
 *                   example: "9664041866"
 *                 name:
 *                   type: string
 *                   example: "Naeem"
 *       404:
 *         description: Address not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Address not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 */

/**
 * @swagger
 * /address/customer:
 *   get:
 *     tags:
 *       - Address
 *     summary: Get address for the authenticated customer
 *     description: Fetches all addresses for the logged-in customer. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Addresses fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Customer address list fetched successfully
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   customerId:
 *                     type: integer
 *                     example: 1
 *                   mainAddress1:
 *                     type: string
 *                     example: "Test"
 *                   mainAddress2:
 *                     type: string
 *                     example: "Test"
 *                   landmark:
 *                     type: string
 *                     example: "Near park"
 *                   latitude:
 *                     type: string
 *                     example: "18.5215"
 *                   longitude:
 *                     type: string
 *                     example: "73.8544"
 *                   mobileNumber:
 *                     type: string
 *                     example: "9664041866"
 *                   name:
 *                     type: string
 *                     example: "Naeem"
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
 * /address/{id}:
 *   put:
 *     tags:
 *       - Address
 *     summary: Update address by ID
 *     description: Updates an address by its ID. Requires Bearer token for authentication.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the address to update
 *       - in: body
 *         name: body
 *         required: true
 *         description: Updated address data
 *         schema:
 *           type: object
 *           required:
 *             - customerId
 *             - mainAddress1
 *             - mobileNumber
 *           properties:
 *             customerId:
 *               type: integer
 *               example: 1
 *             mainAddress1:
 *               type: string
 *               example: "Test"
 *             mainAddress2:
 *               type: string
 *               example: "Test"
 *             landmark:
 *               type: string
 *               example: "Lat"
 *             latitude:
 *               type: string
 *               example: "1.243.32.1"
 *             longitude:
 *               type: string
 *               example: "233.3.12.1"
 *             mobileNumber:
 *               type: string
 *               example: "9664041865"
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Address updated successfully
 *             data:
 *               type: object
 *       400:
 *         description: Validation error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Invalid input
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Address not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Address not found
 */


/**
 * @swagger
 * /address/{id}:
 *   delete:
 *     tags:
 *       - Address
 *     summary: Delete address by ID
 *     description: Deletes a specific address by its ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Address deleted successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Address not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Address not found
 */
