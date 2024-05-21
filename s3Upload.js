const { S3 } = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const uuid = require('uuid').v4;


const s3UploadV2 = async(files) => {
    const s3 = new S3();

    // Single file
    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${uuid()}-${files.originalname}`,
        Body: files.buffer
    }

    return await s3.upload(param).promise();

    // // Multiple Files upload
    // const params = files.map((file) => {
    //     return {
    //         Bucket: process.env.AWS_BUCKET_NAME,
    //         Key: `uploads/${uuid()}-${file.originalname}`,
    //         Body: file.buffer
    //     }
    // })

    // return await Promise.all(params.map(param => s3.upload(param).promise()))

}

const s3UploadV3 = async(files) => {
    const s3Client = new S3Client()
    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${uuid()}-${files.originalname}`,
        Body: files.buffer
    }

    return await s3Client.send(new PutObjectCommand(param))
}

module.exports = {
    s3UploadV2,
    s3UploadV3
}