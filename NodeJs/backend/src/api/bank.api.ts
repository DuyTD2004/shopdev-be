
import axios from "axios";

// Tạo mã đối soát ngẫu nhiên 10 ký tự
export const generateReconciliationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// search bin(bank code) from bank.js
// get Fullname by bankcode & account number
export const getNameHolder = (data: { bin: string; accountNumber: string }) => {
  const config = {
    method: "post",
    url: "https://api.vietqr.io/v2/lookup",
    headers: {
      "x-client-id": process.env.QR_CODE_CLIENT_ID,
      "x-api-key": process.env.QR_CODE_API_KEY,
      "Content-Type": "application/json",
    },
    data,
  };
  return new Promise<any>((resolve, reject) => {
    axios(config)
      .then(function (response) {
        console.log("getNameHolder", JSON.stringify(response.data));
        resolve(response.data);
      })
      .catch(function (error) {
        console.log("getNameHolder", error);
        reject(error);
      });
  });
};



// generate link qrcode payment
export const genQr = (data: {
  accountNo: '0365277198';
  accountName: 'TRAN DUC DUY';
  acqId: 970422;
  amount: number;
  addInfo: "string";
  format: "text";
  template: "compact";
}) => {
  const config = {
    method: "post",
    url: "https://api.vietqr.io/v2/generate",
    headers: {
      "x-client-id": process.env.QR_CODE_CLIENT_ID,
      "x-api-key": process.env.QR_CODE_API_KEY,
      "Content-Type": "application/json",
    },
    data,
  };
  return new Promise<any>((resolve, reject) => {
    axios(config)
      .then(function (response) {
        console.log("genQr", JSON.stringify(response.data));
        resolve(response.data);
      })
      .catch(function (error) {
        console.log("genQr", error);
        reject(error);
      });
  });
};