import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { async } from 'rxjs';
import axios from 'axios';

// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const axios = require('axios');

const client = new S3Client({ region: 'ap-northeast-2' });

const main = async () => {
  const { data } = await axios.get(
    'https://i.namu.wiki/i/slmFMXb1Fchs2zN0ZGOzqfuPDvhRS-H9eBp7Gp613-DNKi6i6Ct7eFkTUpauqv5HAYR97mrNqrvvcCDEyBdL_g.webp',
    {
      responseType: 'arraybuffer',
    },
  ); // 이 객체에 데이터를 받아올 수 있음(버퍼 형식임)
  const params = {
    Bucket: '1street',
    Key: '/images/**.png',
    Body: data,
  };
  const command = new PutObjectCommand(params);
  const response = await client.send(command);

  return response;
};

main();
