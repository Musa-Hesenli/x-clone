import { S3Client } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsService {
  private readonly awsAccessKey: string;
  private readonly awsSecretKey: string;
  private s3Client: S3Client | null = null;
  private readonly privateKey : string;

  private constructor() {
    this.privateKey = this.loadPrivateKey();
  }
  public getS3Client() {
    if (this.s3Client == null) {
      this.s3Client = new S3Client({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS
        },
        region: process.env.AWS_REGION
      });
    }
    return this.s3Client;
  }

  public signImageUrl(imageName: string) {
    console.log(process.env.CLOUDFRONT_DOMAIN + imageName, process.env.KEY_PAIR_ID)
    return getSignedUrl({
      keyPairId: process.env.KEY_PAIR_ID,
      url: process.env.CLOUDFRONT_DOMAIN + imageName,
      privateKey: this.privateKey,
      dateLessThan: new Date(Date.now() + (1000 * 60)).toString()
    });
  }

  private loadPrivateKey(): string {
    try {
      console.log('Reading contents')
      return fs.readFileSync(path.join(process.cwd(), 'private-key.pem'), 'utf-8');
    } catch (error) {
      throw new Error('Failed to load private key from file.');
    }
  }
}