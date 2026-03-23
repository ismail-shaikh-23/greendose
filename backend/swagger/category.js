/**
 * @swagger
 * /category/:
 *   post:
 *     tags:
 *       - Category
 *     summary: Create a new category
 *     description: Adds a new product category with optional image upload. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: Name of the category
 *         example: Skin care
 *       - in: formData
 *         name: file
 *         type: file
 *         required: false
 *         description: Image file for the category
 *     responses:
 *       201:
 *         description: Category created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Category created successfully
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Skin care
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */


/**
 * @swagger
 * /category:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get all categories
 *     description: Fetches a list of all categories. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Categories fetched successfully
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Skin care
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 */



/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     tags:
 *       - Category
 *     summary: Delete a category by ID
 *     description: Deletes a specific category using its ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Category deleted successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Category not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Category not found
 */



/**
 * @swagger
 * /category/{id}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get a single category by ID
 *     description: Retrieves details of a specific category. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the category to retrieve
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Category fetched successfully
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Skin care
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Category not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Category not found
 */


/**
 * @swagger
 * /category/mobile:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get categories for mobile view
 *     description: Returns a list of categories optimized for mobile clients. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mobile categories fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Mobile categories fetched successfully
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Skin care
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
 * /category/{id}:
 *   put:
 *     tags:
 *       - Category
 *     summary: Update a category by ID
 *     description: Updates a category using form-data (e.g., name and image file). Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the category to update
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: Name of the category
 *         example: Updated Skin Care
 *       - in: formData
 *         name: file
 *         type: file
 *         required: false
 *         description: Image or icon file for the category
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Category updated successfully
 *             data:
 *               type: object
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
