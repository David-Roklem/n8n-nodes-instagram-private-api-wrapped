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
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Instagram username or email',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Instagram password',
		},
		{
			displayName: 'Proxy URL',
			name: 'proxyUrl',
			type: 'string',
			default: '',
			description: 'Optional HTTP proxy URL for requests',
			placeholder: 'http://proxy.example.com:8080',
		},
		{
			displayName: 'Session Data',
			name: 'sessionData',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Optional: Saved session data to avoid repeated logins (advanced users only)',
			placeholder: 'Leave empty for normal username/password authentication',
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