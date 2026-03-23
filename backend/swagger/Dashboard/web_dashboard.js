/**
 * @swagger
 * /dashboard-admin/count:
 *   get:
 *     tags:
 *       - Web Dashboard
 *     summary: Get dashboard counts for admin
 *     description: Returns statistical count data for the admin dashboard. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard counts retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             usersCount:
 *               type: integer
 *               example: 125
 *             campaignsCount:
 *               type: integer
 *               example: 42
 *             ordersCount:
 *               type: integer
 *               example: 87
 *             revenue:
 *               type: number
 *               format: float
 *               example: 12045.75
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /dashboard-admin/top-products:
 *   get:
 *     tags:
 *       - Web Dashboard
 *     summary: Get top-selling products
 *     description: Returns a list of top-selling products for the admin dashboard. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of top products
 *         schema:
 *           type: object
 *           properties:
 *             topProducts:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                     example: 101
 *                   productName:
 *                     type: string
 *                     example: "Paracetamol 500mg"
 *                   totalSold:
 *                     type: integer
 *                     example: 132
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /dashboard-admin/expiry-alert:
 *   get:
 *     tags:
 *       - Web Dashboard
 *     summary: Get near-expiry products
 *     description: Retrieves products that are close to their expiration date. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Near-expiry products fetched successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 45
 *               productName:
 *                 type: string
 *                 example: Ibuprofen Tablets
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-08-10
 *               daysLeft:
 *                 type: integer
 *                 example: 25
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /dashboard-admin/sales:
 *   get:
 *     tags:
 *       - Web Dashboard
 *     summary: Get sales data for graph
 *     description: Retrieves sales data over time to populate the admin dashboard sales graph. Requires Bearer token.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales data fetched successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-07-01
 *               totalSales:
 *                 type: number
 *                 format: float
 *                 example: 14500.75
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */
