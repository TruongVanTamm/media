import fs from 'fs';
import AWS from 'aws-sdk';
import formidable from 'formidable';
AWS.config.update({
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  console.log(req)
  if (req.method === 'POST') {
    const folderNameArray = req.rawHeaders.filter((item) => {
      return item.includes('media');
    });
    const folderNameString = folderNameArray
      .toString()
      .split('/')
      .slice(4)
      .join()
      .replaceAll(',', '/');

    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (!files.fileUpload) {
        res.status(404).send('Error');
      }
      if (files.fileUpload.mimetype.includes('video')) {
        s3.putObject(
          {
            Key: files.fileUpload.originalFilename,
            Bucket: `${process.env.AWS_BUCKET_NAME}/${folderNameString}`,
            Body: fs.createReadStream(files.fileUpload.filepath),
            ACL: 'public-read',
          },
          function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);
          }
        );
      } else {
        s3.putObject(
          {
            Key: files.fileUpload.originalFilename,
            Bucket: `${process.env.AWS_BUCKET_NAME}/${folderNameString}`,
            Body: fs.createReadStream(files.fileUpload.filepath),
            ACL: 'public-read',
          },
          function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);
          }
        );
      }
    });
    res.send('Upload success');
  } else {
    console.log(2);
  }
}
