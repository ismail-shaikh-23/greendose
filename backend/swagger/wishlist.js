/**
 * @swagger
 * /wish-list:
 *   post:
 *     tags:
 *       - Wishlist
 *     summary: Add a product to wishlist
 *     description: Adds a product to the authenticated user's wishlist. Requires Bearer token.
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Product to add to wishlist
 *         schema:
 *           type: object
 *           required:
 *             - productId
 *           properties:
 *             productId:
 *               type: integer
 *               example: 4
 *     responses:
 *       201:
 *         description: Product added to wishlist successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Product added to wishlist successfully
 *             wishlistItem:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 productId:
 *                   type: integer
 *                   example: 4
 *                 userId:
 *                   type: integer
 *                   example: 12
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /wish-list/my-list:
 *   get:
 *     tags:
 *       - Wishlist
 *     summary: Get all wishlist items
 *     description: Retrieves all wishlist products for the authenticated user. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               productId:
 *                 type: integer
 *                 example: 101
 *               productName:
 *                 type: string
 *                 example: "Vitamin C Capsules"
 *               price:
 *                 type: number
 *                 example: 299.00
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/images/vitamin-c.jpg"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /wish-list/{id}:
 *   get:
 *     tags:
 *       - Wishlist
 *     summary: Get wishlist item by ID
 *     description: Retrieves a specific wishlist product by its ID for the authenticated user. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: ID of the wishlist item
 *     responses:
 *       200:
 *         description: Wishlist item fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             productId:
 *               type: integer
 *               example: 101
 *             productName:
 *               type: string
 *               example: "Multivitamin Tablets"
 *             price:
 *               type: number
 *               example: 199.99
 *             imageUrl:
 *               type: string
 *               example: "https://example.com/images/multivitamin.jpg"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Wishlist item not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /wish-list/{id}:
 *   put:
 *     tags:
 *       - Wishlist
 *     summary: Update wishlist item
 *     description: Updates the product in the specified wishlist item. Requires Bearer token.
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
 *         description: Wishlist item ID to update
 *       - in: body
 *         name: body
 *         required: true
 *         description: New product to update in wishlist
 *         schema:
 *           type: object
 *           required:
 *             - productId
 *           properties:
 *             productId:
 *               type: integer
 *               example: 3
 *     responses:
 *       200:
 *         description: Wishlist item updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Wishlist item updated successfully
 *             wishlistItem:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 6
 *                 productId:
 *                   type: integer
 *                   example: 3
 *                 userId:
 *                   type: integer
 *                   example: 12
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Wishlist item not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /wish-list/{id}:
 *   delete:
 *     tags:
 *       - Wishlist
 *     summary: Delete wishlist item by ID
 *     description: Deletes a wishlist item for the authenticated user. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: ID of the wishlist item to delete
 *     responses:
 *       200:
 *         description: Wishlist item deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Wishlist item deleted successfully
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Wishlist item not found
 *       500:
 *         description: Server error
 */
