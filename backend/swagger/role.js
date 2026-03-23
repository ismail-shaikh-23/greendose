/**
 * @swagger
 * /role/:
 *   post:
 *     tags:
 *       - Role
 *     summary: Create a new role
 *     description: Creates a new role in the system. Requires Bearer token for authorization.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Role data
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - description
 *           properties:
 *             name:
 *               type: string
 *               example: Admin
 *             description:
 *               type: string
 *               example: admin
 *     responses:
 *       201:
 *         description: Role created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Role created successfully
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Admin
 *                 description:
 *                   type: string
 *                   example: admin
 *       400:
 *         description: Bad Request (e.g., missing fields or duplicate role name)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */

/**
 * @swagger
 * /role/{id}:
 *   put:
 *     tags:
 *       - Role
 *     summary: Update an existing role
 *     description: Updates a role's name and description using its ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the role to update
 *       - in: body
 *         name: body
 *         required: true
 *         description: Updated role data
 *         schema:
 *           type: object
 *           required:
 *             - role_name
 *             - description
 *           properties:
 *             role_name:
 *               type: string
 *               example: Super admin
 *             description:
 *               type: string
 *               example: Super admin
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Role updated successfully
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 4
 *                 role_name:
 *                   type: string
 *                   example: Super admin
 *                 description:
 *                   type: string
 *                   example: Super admin
 *       400:
 *         description: Bad request (e.g., invalid fields or missing role)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 */
/**
 * @swagger
 * /role/{id}:
 *   delete:
 *     tags:
 *       - Role
 *     summary: Delete a role by ID
 *     description: Deletes a role from the system using its ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the role to delete
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Role deleted successfully
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Role not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Role not found
 */


/**
 * @swagger
 * /role/{id}:
 *   get:
 *     tags:
 *       - Role
 *     summary: Get role by ID
 *     description: Retrieves the details of a specific role using its ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: integer
 *         required: true
 *         description: ID of the role to retrieve
 *     responses:
 *       200:
 *         description: Role fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Role fetched successfully
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 role_name:
 *                   type: string
 *                   example: Vendor
 *                 description:
 *                   type: string
 *                   example: Vendor role with limited access
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Role not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Role not found
 */


/**
 * @swagger
 * /role/:
 *   get:
 *     tags:
 *       - Role
 *     summary: Get all roles
 *     description: Retrieves a list of all roles in the system. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Roles fetched successfully
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   role_name:
 *                     type: string
 *                     example: Admin
 *                   description:
 *                     type: string
 *                     example: Administrator role with full access
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 */



