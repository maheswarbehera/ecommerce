import CryptoJS from 'crypto-js';

const secretKey = 'ncXcsMuhcxrWERR'; 
const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

console.log(
    encrypt('maheswar') // U2FsdGVkX19YArF1S83b/PbNxWN0kAqiagc7f2nrfEY=
)

export const decrypt = (encryptedData) => {
    return CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8)
}

console.log(
    decrypt('U2FsdGVkX19YArF1S83b/PbNxWN0kAqiagc7f2nrfEY=') //maheswar
)
export default encrypt;