/**
 * @swagger
 * /search/relevance:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search products by relevance
 *     description: Performs a product search based on relevance using the provided search keyword. Requires Bearer token.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         type: string
 *         description: The search keyword to filter products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products fetched based on relevance
 *         schema:
 *           type: object
 *           properties:
 *             results:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                     example: 501
 *                   productName:
 *                     type: string
 *                     example: "Green Tea Extract"
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 349.99
 *                   inStock:
 *                     type: boolean
 *                     example: true
 *       400:
 *         description: Missing or invalid query parameter
 *       401:
 *         description: Unauthorized - Token required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search products
 *     description: Retrieves a list of products matching the search keyword. Requires Bearer token.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         type: string
 *         description: The keyword to search products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             results:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                     example: 102
 *                   productName:
 *                     type: string
 *                     example: "Multivitamin Tablets"
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 199.00
 *                   imageUrl:
 *                     type: string
 *                     example: "https://cdn.greendose.com/products/multivitamin.jpg"
 *                   inStock:
 *                     type: boolean
 *                     example: true
 *       400:
 *         description: Missing or invalid search keyword
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
