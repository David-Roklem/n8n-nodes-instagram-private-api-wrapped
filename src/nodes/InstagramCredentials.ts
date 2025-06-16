import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class InstagramApi implements ICredentialType {
  name = 'instagramApi';
  displayName = 'Instagram API';
  documentationUrl = 'https://developers.facebook.com/docs/instagram-api';
  properties: INodeProperties[] = [
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      required: true,
      description: 'Instagram username',
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
      description: 'Instagram password',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://www.instagram.com',
      url: '/accounts/login/ajax/',
      method: 'POST',
    },
  };
}