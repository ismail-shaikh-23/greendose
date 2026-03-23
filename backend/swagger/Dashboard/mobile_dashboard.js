/**
 * @swagger
 * /dashboard:
 *   get:
 *     tags:
 *       - Mobile Dashboard
 *     summary: Get mobile dashboard data
 *     description: Returns data for the mobile dashboard view. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mobile dashboard data fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             topDeals:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                     example: 12
 *                   productName:
 *                     type: string
 *                     example: "Vitamin C Tablets"
 *                   discount:
 *                     type: string
 *                     example: "30%"
 *             banners:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bannerId:
 *                     type: integer
 *                     example: 1
 *                   imageUrl:
 *                     type: string
 *                     example: "https://cdn.greendose.com/banner1.jpg"
 *             recommendations:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                     example: 22
 *                   productName:
 *                     type: string
 *                     example: "Omega 3 Capsules"
 *                   expiryDate:
 *                     type: string
 *                     format: date
 *                     example: 2025-10-30
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /dashboard/best-deals:
 *   get:
 *     tags:
 *       - Mobile Dashboard
 *     summary: Get best deals for mobile
 *     description: Retrieves a list of top discount/best deal products for the mobile dashboard. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Best deals fetched successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 101
 *               productName:
 *                 type: string
 *                 example: "Vitamin D3 Capsules"
 *               originalPrice:
 *                 type: number
 *                 format: float
 *                 example: 499.00
 *               discountedPrice:
 *                 type: number
 *                 format: float
 *                 example: 249.00
 *               discountPercent:
 *                 type: string
 *                 example: "50%"
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-15
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /dashboard/common-deals:
 *   get:
 *     tags:
 *       - Mobile Dashboard
 *     summary: Get common deals for mobile
 *     description: Retrieves a list of commonly available deals for the mobile dashboard. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Common deals fetched successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 205
 *               productName:
 *                 type: string
 *                 example: "Cough Syrup"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 150.00
 *               dealTag:
 *                 type: string
 *                 example: "Popular Deal"
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-30
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /dashboard/popular-categories:
 *   get:
 *     tags:
 *       - Mobile Dashboard
 *     summary: Get popular categories for mobile
 *     description: Retrieves a list of popular product categories for the mobile dashboard. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Popular categories fetched successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 example: 10
 *               categoryName:
 *                 type: string
 *                 example: "Pain Relief"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/images/pain-relief.png"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */
