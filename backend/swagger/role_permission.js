/**
 * @swagger
 * /role-permission/:
 *   post:
 *     tags:
 *       - Role-Permission
 *     summary: Assign a permission to a role
 *     description: Assigns a specific permission to a given role. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Role and permission mapping
 *         schema:
 *           type: object
 *           required:
 *             - roleId
 *             - permissionId
 *           properties:
 *             roleId:
 *               type: integer
 *               example: 1
 *             permissionId:
 *               type: integer
 *               example: 45
 *     responses:
 *       201:
 *         description: Permission assigned to role successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Role permission assigned successfully
 *       400:
 *         description: Invalid role or permission
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */


/**
 * @swagger
 * /role-permission/:
 *   get:
 *     tags:
 *       - Role-Permission
 *     summary: Get all role-permission mappings
 *     description: Returns a list of all role-permission mappings in the system. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role-permission list fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Role-permission list fetched successfully
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   roleId:
 *                     type: integer
 *                     example: 1
 *                   permissionId:
 *                     type: integer
 *                     example: 45
 *                   roleName:
 *                     type: string
 *                     example: Admin
 *                   actionName:
 *                     type: string
 *                     example: Create product
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
 * /role-permission/bulk-change:
 *   post:
 *     tags:
 *       - Role-Permission
 *     summary: Bulk assign permissions to a role
 *     description: Replaces all existing permissions for a role with the provided permission IDs. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         type: integer
 *         description: Role ID to assign permissions to
 *       - in: body
 *         name: body
 *         required: true
 *         description: Array of permission IDs to assign to the role
 *         schema:
 *           type: object
 *           required:
 *             - permissionIds
 *           properties:
 *             permissionIds:
 *               type: array
 *               items:
 *                 type: integer
 *               example: [1, 2, 3, 81, 82, 83]
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Permissions assigned successfully
 *       400:
 *         description: Invalid role or permissions
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
