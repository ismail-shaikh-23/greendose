 
/* eslint-disable max-len */
const ExcelJS = require("exceljs");
const path = require('path');
const process = require('process');
const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError'); 
const ORDER_REPORT_TEMPLATE_PATH = path.join(process.cwd() + "/public/templates/order_report_template.xlsx");


exports.createOrdersReport = async(orderRecords) => { 
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(ORDER_REPORT_TEMPLATE_PATH);
    const worksheet = workbook.getWorksheet("report");
    const firstCell = worksheet.getCell('A2');
    let row = 2;
    for(let i=0;i<orderRecords.length;i++){
        worksheet.getCell(`A${row}`).value = orderRecords[i].orderNumber;
        worksheet.getCell(`B${row}`).value = new Date(orderRecords[i].createdAt); 
        worksheet.getCell(`B${row}`).numFmt = 'dd/mm/yyyy\\ h:mm:ss\\ AM/PM'; 
        worksheet.getCell(`C${row}`).value = orderRecords[i].customer?.firstName +" "+ orderRecords[i].customer?.lastName;
        worksheet.getCell(`D${row}`).value = orderRecords[i].customer?.email;
        worksheet.getCell(`E${row}`).value = orderRecords[i].totalAmount;
        worksheet.getCell(`F${row}`).value = orderRecords[i].subTotal;
        worksheet.getCell(`G${row}`).value = orderRecords[i].discount;
        worksheet.getCell(`H${row}`).value = orderRecords[i].paymentStatus;
        worksheet.getCell(`I${row}`).value = orderRecords[i].orderStatusHistory?.status;
        let vendors = "";
        let vendorSet = new Set();
        let vendorData = orderRecords[i]?.vendorData;
        let index = 0;
        while(index < vendorData.length){
            if(!vendorSet.has(vendorData[index].organizationName)){
                vendors += vendorData[index].organizationName + ", ";
                vendorSet.add(vendorData[index].organizationName);
            }
            index++;
        }        
        worksheet.getCell(`J${row}`).value = vendors.substring(0, vendors.length - 2);

        setStyleOfSheetCells(worksheet, row, firstCell);
        row++;
    }
    const targetReportPath = `/reports/order_report_${Date.now()}.xlsx`;
    workbook.xlsx.writeFile('public' + targetReportPath);
    const redirectPath = `${process.env.BACK_END_BASE_URL}${targetReportPath}`
    return redirectPath;
}; 


function setStyleOfSheetCells(worksheet, row, firstCell){
    let col = 1;
    while(col <= 10){
        worksheet.getCell(row, col++).style = firstCell.style;
    }
}


