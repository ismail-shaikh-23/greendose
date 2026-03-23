/**
 * @swagger
 * /campaign:
 *   post:
 *     tags:
 *       - Campaign
 *     summary: Create a new campaign
 *     description: Uploads a campaign along with a file and required metadata. Requires Bearer token.
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: formData
 *         name: files
 *         type: file
 *         required: true
 *         description: File to upload (e.g. image or document)
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: Name of the campaign
 *       - in: formData
 *         name: startDate
 *         type: string
 *         format: date
 *         required: true
 *         description: Campaign start date (YYYY-MM-DD)
 *       - in: formData
 *         name: endDate
 *         type: string
 *         format: date
 *         required: true
 *         description: Campaign end date (YYYY-MM-DD)
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Campaign created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */



/**
 * @swagger
 * /campaign:
 *   get:
 *     tags:
 *       - Campaign
 *     summary: Get list of all campaigns
 *     description: Retrieves all campaigns. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of campaigns retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             campaigns:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Summer Sale
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: 2025-08-01
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: 2025-08-15
 *                   filePath:
 *                     type: string
 *                     example: /uploads/summer-sale.pdf
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /campaign/{id}:
 *   get:
 *     tags:
 *       - Campaign
 *     summary: Get campaign by ID
 *     description: Retrieves a single campaign by its ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the campaign to retrieve
 *     responses:
 *       200:
 *         description: Campaign retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: Summer Sale
 *             startDate:
 *               type: string
 *               format: date
 *               example: 2025-08-01
 *             endDate:
 *               type: string
 *               format: date
 *               example: 2025-08-15
 *             filePath:
 *               type: string
 *               example: /uploads/summer-sale.pdf
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Campaign not found
 */


/**
 * @swagger
 * /campaign/{id}:
 *   put:
 *     tags:
 *       - Campaign
 *     summary: Update a campaign by ID
 *     description: Updates an existing campaign, including optional file replacement. Requires Bearer token.
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: Campaign ID to update
 *       - in: formData
 *         name: files
 *         type: file
 *         required: false
 *         description: New file to upload (replaces existing one if provided)
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: Updated name of the campaign
 *       - in: formData
 *         name: startDate
 *         type: string
 *         format: date
 *         required: true
 *         description: Updated start date (YYYY-MM-DD)
 *       - in: formData
 *         name: endDate
 *         type: string
 *         format: date
 *         required: true
 *         description: Updated end date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Campaign updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Campaign updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Campaign not found
 */


/**
 * @swagger
 * /campaign/status/{id}:
 *   put:
 *     tags:
 *       - Campaign
 *     summary: Update campaign status
 *     description: Updates the status of a campaign (e.g., pending, approved, rejected). Requires Bearer token.
 *     consumes:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the campaign to update
 *       - in: body
 *         name: body
 *         required: true
 *         description: Status payload
 *         schema:
 *           type: object
 *           required:
 *             - status
 *           properties:
 *             status:
 *               type: string
 *               example: approved
 *               enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Campaign status updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Campaign status updated successfully
 *       400:
 *         description: Invalid input or campaign ID
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Campaign not found
 */

/**
 * @swagger
 * /campaign/mobile:
 *   get:
 *     tags:
 *       - Campaign
 *     summary: Get mobile campaign list
 *     description: Retrieves a list of campaigns optimized for mobile users. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Campaign list for mobile retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             campaigns:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Mobile Summer Promo
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: 2025-08-01
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: 2025-08-15
 *                   filePath:
 *                     type: string
 *                     example: /uploads/mobile-promo.jpg
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /campaign/mobile/{id}:
 *   get:
 *     tags:
 *       - Campaign
 *     summary: Get campaign by ID for mobile
 *     description: Retrieves a specific campaign optimized for mobile by its ID. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the campaign to retrieve
 *     responses:
 *       200:
 *         description: Campaign data retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: Mobile Diwali Offer
 *             startDate:
 *               type: string
 *               format: date
 *               example: 2025-10-25
 *             endDate:
 *               type: string
 *               format: date
 *               example: 2025-11-05
 *             filePath:
 *               type: string
 *               example: /uploads/diwali-offer-mobile.jpg
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Campaign not found
 */
