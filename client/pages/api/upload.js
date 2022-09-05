import AWS from 'aws-sdk';
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
  if (req.method === 'POST') {
    // const form = formidable({ multiples: true });
    // form.parse(req, async (err, fields, files) => {
    //   if (!files.fileUpload) {
    //     res.status(404).send('Error');
    //   }
    //   if (files.fileUpload.mimetype.includes('video')) {
    //     s3.putObject(
    //       {
    //         Key: files.fileUpload.originalFilename,
    //         Bucket: `${process.env.AWS_BUCKET_NAME}/${store.getState().pathname}`,
    //         Body: fs.createReadStream(files.fileUpload.filepath),
    //         ACL: 'public-read',
    //       },
    //       function (err, data) {
    //         if (err) console.log(err, err.stack);
    //         else console.log(data);
    //       }
    //     );
    //     res.send('Upload success');
    //   } else {
    //     s3.putObject(
    //       {
    //         Key: files.fileUpload.originalFilename,
    //         Bucket: `${process.env.AWS_BUCKET_NAME}`,
    //         Body: fs.createReadStream(files.fileUpload.filepath),
    //         ACL: 'public-read',
    //       },
    //       function (err, data) {
    //         if (err) console.log(err, err.stack);
    //         else console.log(data);
    //       }
    //     );
    //     res.send('Upload success');
    //   }
    // });
  } else {
    console.log(2);
  }
}
