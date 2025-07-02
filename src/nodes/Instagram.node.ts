import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { IInstagramCredentials } from '../lib/types';

// Import the Instagram Client class
import { InstagramClient } from '../lib/client';

export class Instagram implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instagram Private API',
		name: 'instagram',
		icon: 'file:instagram.svg',
		group: ['social'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Instagram using private API methods',
		defaults: {
			name: 'Instagram Private API',
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
						name: 'User',
						value: 'user',
					},
					{
						name: 'Media',
						value: 'media',
					},
					{
						name: 'Feed',
						value: 'feed',
					},
				],
				default: 'user',
			},
			// User Operations
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
						name: 'Get Profile Info',
						value: 'getUserInfo',
						description: 'Get user profile information',
						action: 'Get user profile information',
					},
					{
						name: 'Search Users',
						value: 'searchUsers',
						description: 'Search for users by username',
						action: 'Search for users by username',
					},
					{
						name: 'Get Followers',
						value: 'getFollowers',
						description: 'Get user followers',
						action: 'Get user followers',
					},
					{
						name: 'Get Following',
						value: 'getFollowing',
						description: 'Get users that a user is following',
						action: 'Get users that a user is following',
					},
				],
				default: 'getUserInfo',
			},
			// Media Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['media'],
					},
				},
				options: [
					{
						name: 'Get User Media',
						value: 'getUserMedia',
						description: 'Get media posts from a user',
						action: 'Get media posts from a user',
					},
					{
						name: 'Get Media Info',
						value: 'getMediaInfo',
						description: 'Get detailed information about a media item',
						action: 'Get detailed information about a media item',
					},
					{
						name: 'Like Media',
						value: 'likeMedia',
						description: 'Like a media post',
						action: 'Like a media post',
					},
					{
						name: 'Unlike Media',
						value: 'unlikeMedia',
						description: 'Unlike a media post',
						action: 'Unlike a media post',
					},
				],
				default: 'getUserMedia',
			},
			// Feed Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['feed'],
					},
				},
				options: [
					{
						name: 'Get Timeline Feed',
						value: 'getTimelineFeed',
						description: 'Get posts from timeline feed',
						action: 'Get posts from timeline feed',
					},
				],
				default: 'getTimelineFeed',
			},
			// Common Parameters
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getUserInfo', 'getFollowers', 'getFollowing'],
					},
				},
				default: '',
				description: 'Instagram username (without @)',
				required: true,
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['getUserMedia'],
					},
				},
				default: '',
				description: 'Instagram username (without @)',
				required: true,
			},
			{
				displayName: 'Search Query',
				name: 'query',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['searchUsers'],
					},
				},
				default: '',
				description: 'Search term for finding users',
				required: true,
			},
			{
				displayName: 'Media ID',
				name: 'mediaId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['getMediaInfo', 'likeMedia', 'unlikeMedia'],
					},
				},
				default: '',
				description: 'Instagram media ID',
				required: true,
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['media', 'user', 'feed'],
						operation: ['getUserMedia', 'getFollowers', 'getFollowing', 'getTimelineFeed'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 20,
				description: 'Maximum number of items to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('instagramApi') as IInstagramCredentials;

		// Initialize Instagram client
		const client = new InstagramClient(credentials);
		await client.authenticate(credentials);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				if (resource === 'user') {
					if (operation === 'getUserInfo') {
						const username = this.getNodeParameter('username', i) as string;
						responseData = await client.getUserInfo(username);
					} else if (operation === 'searchUsers') {
						const query = this.getNodeParameter('query', i) as string;
						responseData = await client.searchUsers(query);
					} else if (operation === 'getFollowers') {
						const username = this.getNodeParameter('username', i) as string;
						const limit = this.getNodeParameter('limit', i, 20) as number;
						// First get user info to get the user ID
						const userInfo = await client.getUserInfo(username);
						responseData = await client.getFollowers(userInfo.pk, limit);
					} else if (operation === 'getFollowing') {
						const username = this.getNodeParameter('username', i) as string;
						const limit = this.getNodeParameter('limit', i, 20) as number;
						// First get user info to get the user ID
						const userInfo = await client.getUserInfo(username);
						responseData = await client.getFollowing(userInfo.pk, limit);
					}
				} else if (resource === 'media') {
					if (operation === 'getUserMedia') {
						const username = this.getNodeParameter('username', i) as string;
						const limit = this.getNodeParameter('limit', i, 20) as number;
						// First get user info to get the user ID
						const userInfo = await client.getUserInfo(username);
						responseData = await client.getUserMedia(userInfo.pk, limit);
					} else if (operation === 'getMediaInfo') {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						responseData = await client.getMediaInfo(mediaId);
					} else if (operation === 'likeMedia') {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						await client.likeMedia(mediaId);
						responseData = { success: true };
					} else if (operation === 'unlikeMedia') {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						await client.unlikeMedia(mediaId);
						responseData = { success: true };
					}
				} else if (resource === 'feed') {
					if (operation === 'getTimelineFeed') {
						const maxId = this.getNodeParameter('maxId', i, undefined) as string | undefined;
						responseData = await client.getTimelineFeed(maxId);
					}
				}

				if (responseData === undefined) {
					throw new NodeOperationError(
						this.getNode(),
						`The operation "${operation}" is not supported for resource "${resource}"`,
						{ itemIndex: i }
					);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{
						itemData: { item: i },
					}
				);

				returnData.push(...executionData);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: errorMessage }),
						{ itemData: { item: i } }
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}