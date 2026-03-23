/**
 * @swagger
 * /faq:
 *   post:
 *     tags:
 *       - FAQ
 *     summary: Create a new FAQ entry
 *     description: Adds a new frequently asked question to the system.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: FAQ data
 *         schema:
 *           type: object
 *           required:
 *             - question
 *             - answer
 *           properties:
 *             question:
 *               type: string
 *               example: What is GreenDose and how does it work?
 *             answer:
 *               type: string
 *               example: GreenDose is a mobile-first shopping app that offers discounted wellness and OTC products that are close to expiry but still completely safe and usable. The platform partners with pharmacies to make these products available at lower prices, helping both users and the environment by reducing waste.
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: FAQ added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /faq:
 *   get:
 *     tags:
 *       - FAQ
 *     summary: Get all FAQs
 *     description: Retrieves the complete list of frequently asked questions.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of FAQs retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             faqs:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   question:
 *                     type: string
 *                     example: What is GreenDose and how does it work?
 *                   answer:
 *                     type: string
 *                     example: GreenDose is a mobile-first shopping app that offers discounted wellness and OTC products...
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /faq/{id}:
 *   get:
 *     tags:
 *       - FAQ
 *     summary: Get FAQ by ID
 *     description: Retrieves a specific frequently asked question by its ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the FAQ to retrieve
 *     responses:
 *       200:
 *         description: FAQ retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             question:
 *               type: string
 *               example: What is GreenDose and how does it work?
 *             answer:
 *               type: string
 *               example: GreenDose is a mobile-first shopping app that offers discounted wellness and OTC products...
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /faq/{id}:
 *   put:
 *     tags:
 *       - FAQ
 *     summary: Update FAQ by ID
 *     description: Updates the question and/or answer of a specific FAQ.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the FAQ to update
 *       - in: body
 *         name: body
 *         required: true
 *         description: Updated FAQ content
 *         schema:
 *           type: object
 *           required:
 *             - question
 *             - answer
 *           properties:
 *             question:
 *               type: string
 *               example: What is GreenDose and how does it work?
 *             answer:
 *               type: string
 *               example: GreenDose is a mobile-first shopping app that offers discounted wellness and OTC products...
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: FAQ updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /faq/{id}:
 *   delete:
 *     tags:
 *       - FAQ
 *     summary: Delete FAQ by ID
 *     description: Deletes a specific FAQ from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the FAQ to delete
 *     responses:
 *       200:
 *         description: FAQ deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: FAQ deleted successfully
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
