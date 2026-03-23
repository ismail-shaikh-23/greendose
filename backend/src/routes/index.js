const express = require('express');

const router = express.Router();
const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);

// fs.readdirSync(__dirname)
//   .filter(
//     (dir) =>
//       dir.indexOf('.') !== -1 && dir !== basename && dir.slice(-3) === '.js',
//   )
//   // .forEach((dir_) => {
//   //   fs.readdirSync(`${__dirname}/`)
//   //   .filter((routeFile) => routeFile.slice(-3) === ".js")
//   .map((index) => {
//     const fileName = index.split('.js')[0]; 
//     const mainRoute = fileName ? `/${fileName}` : '/';
//     const route = require(path.join(`${__dirname}/${index}`));
//     return router.use(mainRoute, route);
//   });
// // });

// module.exports = router;

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const routeName = file === 'index.js' ? '' : file.replace('.js', '');
    const routePath = routeName ? `/${routeName}` : '/';
    const route = require(path.join(__dirname, file));
    router.use(routePath, route);
  });

module.exports = router;
