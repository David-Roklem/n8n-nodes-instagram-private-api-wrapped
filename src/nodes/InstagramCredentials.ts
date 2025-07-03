import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export class InstagramCredentials implements ICredentialType {
	name = 'instagramApi';
	displayName = 'Instagram API';
	documentationUrl = 'https://github.com/tiagohintz/n8n-nodes-instagram-private-api-wrapped';
	properties: INodeProperties[] = [
		{
			displayName: 'Session Data',
			name: 'sessionData',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Instagram session data (JSON format). Use the extract-session.sh script to obtain this data.',
			placeholder: '{"cookies":[...],"sessionId":"..."}',
		},
		{
			displayName: 'Proxy URL',
			name: 'proxyUrl',
			type: 'string',
			default: '',
			description: 'Optional HTTP proxy URL for requests',
			placeholder: 'http://proxy.example.com:8080',
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://www.instagram.com',
			url: '/',
			method: 'GET',
		},
	};
}