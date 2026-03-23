/**
 * @swagger
 * /product:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create a new product
 *     description: Adds a new product with details and file upload. Requires Bearer token.
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         example: Paracetamol
 *       - in: formData
 *         name: price
 *         type: number
 *         required: true
 *         example: 25.50
 *       - in: formData
 *         name: files
 *         type: file
 *         required: false
 *         description: Upload product image(s)
 *       - in: formData
 *         name: expiryDate
 *         type: string
 *         format: date
 *         example: 2025-12-31
 *       - in: formData
 *         name: subCategoryId
 *         type: integer
 *         required: true
 *         example: 3
 *       - in: formData
 *         name: isPrescriptionRequired
 *         type: boolean
 *         example: false
 *       - in: formData
 *         name: brand
 *         type: string
 *         example: "Cipla"
 *       - in: formData
 *         name: weight
 *         type: number
 *         example: 0.5
 *       - in: formData
 *         name: unit
 *         type: string
 *         example: "kg"
 *       - in: formData
 *         name: description
 *         type: string
 *         example: "Used for fever and pain relief"
 *       - in: formData
 *         name: quantity
 *         type: integer
 *         example: 10
 *       - in: formData
 *         name: vendorId
 *         type: integer
 *         required: true
 *         example: 1
 *     responses:
 *       201:
 *         description: Product created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Product created successfully
 *             data:
 *               type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete product by ID
 *     description: Deletes a product using its ID. Requires Bearer token for authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Product deleted successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Product not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Product not found
 */

/**
 * @swagger
 * /product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     description: Retrieves a list of all products. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Products fetched successfully
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
 *                     example: Paracetamol
 *                   price:
 *                     type: number
 *                     example: 25.50
 *                   brand:
 *                     type: string
 *                     example: Cipla
 *                   quantity:
 *                     type: integer
 *                     example: 10
 *                   isPrescriptionRequired:
 *                     type: boolean
 *                     example: false
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 */

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get single product by ID
 *     description: Retrieves details of a specific product by its ID. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Product fetched successfully
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 name:
 *                   type: string
 *                   example: Paracetamol
 *                 price:
 *                   type: number
 *                   example: 25.5
 *                 brand:
 *                   type: string
 *                   example: Cipla
 *                 description:
 *                   type: string
 *                   example: Used for fever and pain relief
 *                 quantity:
 *                   type: integer
 *                   example: 10
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Product not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Product not found
 */


/**
 * @swagger
 * /product/{id}:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update product by ID
 *     description: Updates an existing product. Supports multipart/form-data. Requires Bearer token.
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the product to update
 *       - in: formData
 *         name: name
 *         type: string
 *         required: false
 *         example: Paracetamol
 *       - in: formData
 *         name: price
 *         type: number
 *         required: false
 *         example: 25.5
 *       - in: formData
 *         name: expiryDate
 *         type: string
 *         format: date
 *         required: false
 *         example: 2025-12-31
 *       - in: formData
 *         name: subCategoryId
 *         type: integer
 *         required: false
 *         example: 3
 *       - in: formData
 *         name: brand
 *         type: string
 *         required: false
 *         example: Cipla
 *       - in: formData
 *         name: weight
 *         type: string
 *         required: false
 *         example: 10mg
 *       - in: formData
 *         name: unit
 *         type: string
 *         required: false
 *         example: tablet
 *       - in: formData
 *         name: description
 *         type: string
 *         required: false
 *         example: Fever and pain relief medicine
 *       - in: formData
 *         name: quantity
 *         type: integer
 *         required: false
 *         example: 50
 *       - in: formData
 *         name: isPrescriptionRequired
 *         type: boolean
 *         required: false
 *         example: false
 *       - in: formData
 *         name: vendorId
 *         type: integer
 *         required: false
 *         example: 2
 *       - in: formData
 *         name: files
 *         type: file
 *         required: false
 *         description: Optional product image or document
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Product updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */


/**
 * @swagger
 * /product/category/{categoryId}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get products by category ID
 *     description: Retrieves all products associated with a specific category. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         type: integer
 *         description: ID of the category to fetch products for
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Products fetched successfully
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 2
 *                   name:
 *                     type: string
 *                     example: Paracetamol
 *                   price:
 *                     type: number
 *                     example: 25.50
 *                   brand:
 *                     type: string
 *                     example: Cipla
 *                   categoryId:
 *                     type: integer
 *                     example: 1
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Category or products not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: No products found for this category
 */

/**
 * @swagger
 * /product/images:
 *   post:
 *     tags:
 *       - Product
 *     summary: Delete product images
 *     description: Deletes one or more images for a specific product. Uses POST instead of DELETE. Requires Bearer token.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: File IDs to delete and associated product ID
 *         schema:
 *           type: object
 *           required:
 *             - fileIds
 *             - productId
 *           properties:
 *             fileIds:
 *               type: array
 *               items:
 *                 type: integer
 *               example: [13, 14]
 *             productId:
 *               type: integer
 *               example: 2
 *     responses:
 *       200:
 *         description: Product images deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Selected product images deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product or images not found
 */
