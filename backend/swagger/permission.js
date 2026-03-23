/**
 * @swagger
 * /permission/:
 *   post:
 *     tags:
 *       - Permission
 *     summary: Create a new permission
 *     description: Adds a new permission to the system. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Permission details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - actionName
 *             - description
 *             - method
 *             - baseUrl
 *             - path
 *           properties:
 *             actionName:
 *               type: string
 *               example: Update vendor list
 *             description:
 *               type: string
 *               example: Api to update vendor list
 *             method:
 *               type: string
 *               enum: [GET, POST, PUT, DELETE]
 *               example: PUT
 *             baseUrl:
 *               type: string
 *               example: /api/vendor
 *             path:
 *               type: string
 *               example: /:id
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Permission created successfully
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 actionName:
 *                   type: string
 *                   example: Update vendor list
 *                 method:
 *                   type: string
 *                   example: PUT
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */


/**
 * @swagger
 * /permission/{id}:
 *   put:
 *     tags:
 *       - Permission
 *     summary: Update a permission by ID
 *     description: Updates an existing permission with new details. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: integer
 *         required: true
 *         description: ID of the permission to update
 *       - in: body
 *         name: body
 *         required: true
 *         description: Updated permission details
 *         schema:
 *           type: object
 *           required:
 *             - actionName
 *             - description
 *             - method
 *             - base_url
 *             - path
 *           properties:
 *             actionName:
 *               type: string
 *               example: Edited by chinmay
 *             description:
 *               type: string
 *               example: Edited by chinmay
 *             method:
 *               type: string
 *               enum: [GET, POST, PUT, DELETE]
 *               example: PUT
 *             base_url:
 *               type: string
 *               example: /api/Edited by chinmay
 *             path:
 *               type: string
 *               example: /:id
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Permission updated successfully
 *             data:
 *               type: object
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Permission not found
 */


/**
 * @swagger
 * /permission:
 *   get:
 *     tags:
 *       - Permission
 *     summary: Get all permissions
 *     description: Fetch all permission records. Use `fetchAll=true` to retrieve all without pagination. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fetchAll
 *         required: false
 *         type: boolean
 *         description: If true, returns all permissions without pagination
 *         example: true
 *     responses:
 *       200:
 *         description: Permissions fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Permissions fetched successfully
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   actionName:
 *                     type: string
 *                     example: Create product
 *                   description:
 *                     type: string
 *                     example: API to create new product
 *                   method:
 *                     type: string
 *                     example: POST
 *                   base_url:
 *                     type: string
 *                     example: /api/product
 *                   path:
 *                     type: string
 *                     example: /
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 */

/**
 * @swagger
 * /permission/{id}:
 *   get:
 *     tags:
 *       - Permission
 *     summary: Get permission by ID
 *     description: Retrieves a specific permission by its ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the permission to retrieve
 *     responses:
 *       200:
 *         description: Permission fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Permission fetched successfully
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 actionName:
 *                   type: string
 *                   example: View vendor list
 *                 description:
 *                   type: string
 *                   example: API to view all vendors
 *                 method:
 *                   type: string
 *                   example: GET
 *                 base_url:
 *                   type: string
 *                   example: /api/vendor
 *                 path:
 *                   type: string
 *                   example: /
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Permission not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Permission not found
 */


/**
 * @swagger
 * /permission/{id}:
 *   delete:
 *     tags:
 *       - Permission
 *     summary: Delete a permission by ID
 *     description: Deletes a specific permission from the system using its ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: integer
 *         required: true
 *         description: ID of the permission to delete
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Permission deleted successfully
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Permission not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Permission not found
 */
