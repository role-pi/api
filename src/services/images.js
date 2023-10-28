import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const spacesEndpoint = new AWS.Endpoint('https://nyc3.digitaloceanspaces.com');

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'DO003AX98C64AXUJHNMA',
  secretAccessKey: process.env.SPACES_SECRET,
});

export const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'role',
      acl: 'public-read',
      metadata: function (req, file, callback) {
        callback(null, { fieldName: file.fieldname });
      },
      key: function (req, file, callback) {
        callback(null, Date.now().toString() + '-' + file.originalname);
      },
    }),
});