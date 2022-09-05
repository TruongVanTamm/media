import AWS from 'aws-sdk';
import {store} from '../store/store';
AWS.config.update({
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();
export const config = {
  api: {
    bodyParser: true,
  },
};
export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log(store.getState());
    s3.putObject(
      {
        // Key: `${folderName}/${req.body.folderName}/`,
        Key: `${req.body.pathname}${req.body.folderName}/`,
        Bucket: process.env.AWS_BUCKET_NAME,
      },
      function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
      }
    );
    res.send('Upload success');
  } else if (req.method === 'DELETE') {
    req.body.objectID.map((item) => {
      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `${item}`,
      };
      s3.listObjects(params, function (err, data) {
        //   if (err) return callback(err);
        //   if (data.Contents.length == 0) callback();
        params = { Bucket: process.env.AWS_BUCKET_NAME };
        params.Delete = { Objects: [] };
        data.Contents.forEach(function (content) {
          params.Delete.Objects.push({ Key: content.Key });
        });
        s3.deleteObjects(params, function (err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);
        });
      });
    });

    res.send('success');
  } else {
    console.log(1);
  }
}
