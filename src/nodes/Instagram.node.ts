import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

import { InstagramClient } from '../lib/client';

export class Instagram implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Instagram',
    name: 'instagram',
    icon: 'fa:instagram',
    group: ['social media'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Instagram using private API',
    defaults: {
      name: 'Instagram',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'instagramApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Post',
            value: 'post',
          },
          {
            name: 'User',
            value: 'user',
          },
          {
            name: 'Media',
            value: 'media',
          },
        ],
        default: 'post',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['post'],
          },
        },
        options: [
          {
            name: 'Post Image',
            value: 'postImage',
            description: 'Post an image to Instagram',
            action: 'Post an image',
          },
          {
            name: 'Like Post',
            value: 'likePost',
            description: 'Like a post',
            action: 'Like a post',
          },
          {
            name: 'Comment on Post',
            value: 'commentPost',
            description: 'Comment on a post',
            action: 'Comment on a post',
          },
          {
            name: 'Get Posts by Hashtag',
            value: 'getPostsByHashtag',
            description: 'Get posts by hashtag',
            action: 'Get posts by hashtag',
          },
        ],
        default: 'postImage',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['user'],
          },
        },
        options: [
          {
            name: 'Get Followers',
            value: 'getFollowers',
            description: 'Get followers of a user',
            action: 'Get followers',
          },
          {
            name: 'Get Following',
            value: 'getFollowing',
            description: 'Get following list of a user',
            action: 'Get following',
          },
          {
            name: 'Get User Info',
            value: 'getUserInfo',
            description: 'Get user information',
            action: 'Get user info',
          },
        ],
        default: 'getFollowers',
      },
      {
        displayName: 'Image Buffer',
        name: 'imageBuffer',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['postImage'],
          },
        },
        default: '',
        placeholder: 'Binary data or base64 encoded image',
        description: 'The image data to post',
      },
      {
        displayName: 'Caption',
        name: 'caption',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['postImage'],
          },
        },
        default: '',
        placeholder: 'Image caption',
        description: 'Caption for the image post',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getFollowers', 'getFollowing'],
          },
        },
        default: '',
        placeholder: '12345678',
        description: 'Instagram user ID',
      },
      {
        displayName: 'Username',
        name: 'username',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getUserInfo'],
          },
        },
        default: '',
        placeholder: 'instagram_username',
        description: 'Instagram username',
      },
      {
        displayName: 'Media ID',
        name: 'mediaId',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['likePost', 'commentPost'],
          },
        },
        default: '',
        placeholder: '12345678901234567_12345678',
        description: 'Instagram media ID',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['commentPost'],
          },
        },
        default: '',
        placeholder: 'Your comment here',
        description: 'Comment text',
      },
      {
        displayName: 'Hashtag',
        name: 'hashtag',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getPostsByHashtag'],
          },
        },
        default: '',
        placeholder: 'nature',
        description: 'Hashtag to search for (without #)',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getPostsByHashtag', 'getFollowers', 'getFollowing'],
          },
        },
        default: 10,
        description: 'Number of results to return',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const credentials = await this.getCredentials('instagramApi');
    const client = new InstagramClient();

    try {
      await client.login(credentials.username as string, credentials.password as string);

      for (let i = 0; i < items.length; i++) {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;

        let responseData: any;

        try {
          if (resource === 'post') {
            if (operation === 'postImage') {
              responseData = await handlePostImage.call(this, client, i);
            } else if (operation === 'likePost') {
              responseData = await handleLikePost.call(this, client, i);
            } else if (operation === 'commentPost') {
              responseData = await handleCommentPost.call(this, client, i);
            } else if (operation === 'getPostsByHashtag') {
              responseData = await handleGetPostsByHashtag.call(this, client, i);
            }
          } else if (resource === 'user') {
            if (operation === 'getFollowers') {
              responseData = await handleGetFollowers.call(this, client, i);
            } else if (operation === 'getFollowing') {
              responseData = await handleGetFollowing.call(this, client, i);
            } else if (operation === 'getUserInfo') {
              responseData = await handleGetUserInfo.call(this, client, i);
            }
          }

          const executionData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray(responseData),
            { itemData: { item: i } },
          );

          returnData.push(...executionData);
        } catch (error) {
          if (this.continueOnFail()) {
            returnData.push({
              json: {
                error: (error as Error).message,
              },
              pairedItem: {
                item: i,
              },
            });
            continue;
          }
          throw error;
        }
      }

      return [returnData];
    } catch (error) {
      throw new NodeOperationError(this.getNode(), `Instagram operation failed: ${(error as Error).message}`);
    }
  }
}

async function handlePostImage(this: IExecuteFunctions, client: InstagramClient, itemIndex: number): Promise<any> {
  const imageData = this.getNodeParameter('imageBuffer', itemIndex) as string;
  const caption = this.getNodeParameter('caption', itemIndex, '') as string;

  if (!imageData) {
    throw new NodeOperationError(this.getNode(), 'Image data is required');
  }

  let imageBuffer: Buffer;

  // Handle different image data formats
  if (imageData.startsWith('data:image/')) {
    // Base64 data URL
    const base64Data = imageData.split(',')[1];
    imageBuffer = Buffer.from(base64Data, 'base64');
  } else if (this.helpers.getBinaryDataBuffer) {
    // Binary data
    const binaryData = await this.helpers.getBinaryDataBuffer(itemIndex, 'data');
    imageBuffer = binaryData;
  } else {
    // Assume it's base64 encoded
    imageBuffer = Buffer.from(imageData, 'base64');
  }

  return await client.postImage(imageBuffer, caption);
}

async function handleGetFollowers(this: IExecuteFunctions, client: InstagramClient, itemIndex: number): Promise<any> {
  const userId = this.getNodeParameter('userId', itemIndex, '') as string;
  const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
  return await client.getFollowers(userId, limit);
}

async function handleGetFollowing(this: IExecuteFunctions, client: InstagramClient, itemIndex: number): Promise<any> {
  const userId = this.getNodeParameter('userId', itemIndex, '') as string;
  const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
  return await client.getFollowing(userId, limit);
}

async function handleLikePost(this: IExecuteFunctions, client: InstagramClient, itemIndex: number): Promise<any> {
  const mediaId = this.getNodeParameter('mediaId', itemIndex) as string;
  return await client.likePost(mediaId);
}

async function handleCommentPost(this: IExecuteFunctions, client: InstagramClient, itemIndex: number): Promise<any> {
  const mediaId = this.getNodeParameter('mediaId', itemIndex) as string;
  const comment = this.getNodeParameter('comment', itemIndex) as string;
  return await client.commentOnPost(mediaId, comment);
}

async function handleGetUserInfo(this: IExecuteFunctions, client: InstagramClient, itemIndex: number): Promise<any> {
  const username = this.getNodeParameter('username', itemIndex) as string;
  return await client.getUserInfo(username);
}

async function handleGetPostsByHashtag(this: IExecuteFunctions, client: InstagramClient, itemIndex: number): Promise<any> {
  const hashtag = this.getNodeParameter('hashtag', itemIndex) as string;
  const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
  return await client.getPostsByHashtag(hashtag, limit);
}