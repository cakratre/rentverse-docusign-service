import 'dotenv/config';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import docusign from 'docusign-esign';
import { allowCors } from '@/utils/cors';

export const config = {
  api: {
    bodyParser: false,
  },
};

type ApiResp = {
  success: boolean;
  message: string;
  envelopeId?: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const requiredEnvVars = ['DOCUSIGN_API_ACCOUNT_ID', 'DOCUSIGN_INTEGRATION_KEY', 'DOCUSIGN_USER_ID', 'DOCUSIGN_PRIVATE_KEY'];
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      console.error(`Missing required environment variable: ${varName}`);
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }
  }

  try {
    const form = formidable({});
    const [fields] = await form.parse(req);

    const getField = (name: string) => (fields[name] ? fields[name][0] : '');

    const tenantName = getField('tenantName');
    const tenantEmail = getField('tenantEmail');
    const tenantAddress = getField('tenantAddress');
    const ownerName = getField('ownerName');
    const ownerEmail = getField('ownerEmail');
    const ownerAddress = getField('ownerAddress');
    const propertyAddress = getField('propertyAddress');
    const propertyType = getField('propertyType');
    const size = getField('size');
    const numberOfRoom = getField('numberOfRoom');
    const furnished = getField('furnished').toLowerCase() === 'true';
    const startDate = getField('startDate');
    const duration = getField('duration');
    const price = getField('price');

    const templatePath = path.resolve(process.cwd(), 'public/templates/templatePdf.pdf');
    const fileBuffer = fs.readFileSync(templatePath);
    const fileBase64 = fileBuffer.toString('base64');

    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi');
    const accessToken = await getAccessToken();
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    const envelopeDefinition = {
      emailSubject: 'Action Required: Your Rental Agreement',
      documents: [{
        documentBase64: fileBase64,
        name: 'Rental Agreement',
        fileExtension: 'pdf',
        documentId: '1'
      }],
      recipients: {
        signers: [
          {
            email: tenantEmail,
            name: tenantName,
            recipientId: '1',
            routingOrder: '1',
            tabs: {
              signHereTabs: [{ anchorString: '//sig_tenant//' }],
              textTabs: [
                { anchorString: '[Owner Name]', value: ownerName, locked: 'true' },
                { anchorString: '[Owner Address]', value: ownerAddress, locked: 'true' },
                { anchorString: '[Tenant Name]', value: tenantName, locked: 'true' },
                { anchorString: '[Tenant Address]', value: tenantAddress, locked: 'true' },
                { anchorString: '[Property Address]', value: propertyAddress, locked: 'true' },
                { anchorString: '[Property Type]', value: propertyType, locked: 'true' },
                { anchorString: '[Size]', value: size, locked: 'true' },
                { anchorString: '[Number of Rooms]', value: numberOfRoom, locked: 'true' },
                { anchorString: '[Furnished Status]', value: furnished ? 'Yes' : 'No', locked: 'true' },
                { anchorString: '[Start Date]', value: startDate, locked: 'true' },
                { anchorString: '[Duration in Days]', value: duration, locked: 'true' },
                { anchorString: '[Total Rental Price]', value: price, locked: 'true' },
              ]
            }
          },
          {
            email: ownerEmail,
            name: ownerName,
            recipientId: '2',
            routingOrder: '1',
            tabs: { signHereTabs: [{ anchorString: '//sig_owner//' }] }
          }
        ]
      },
      status: 'sent'
    };

    const result = await envelopesApi.createEnvelope(
      process.env.DOCUSIGN_API_ACCOUNT_ID as string,
      { envelopeDefinition }
    );

    res.status(200).json({
      success: true,
      envelopeId: result.envelopeId,
      message: 'Agreement sent successfully to all parties.'
    });

  } catch (error: any) {
    const errBody = error?.response?.body;
    const errMsg = errBody?.message || 'An error occurred while sending the document.';
    console.error('DocuSign Error Body:', errBody || 'No response body from DocuSign.');
    res.status(400).json({ success: false, message: errMsg });
  }
}

async function getAccessToken(): Promise<string> {
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY as string;
  const userId = process.env.DOCUSIGN_USER_ID as string;
  const oauthBase = (process.env.DOCUSIGN_OAUTH_BASE_PATH || 'account-d.docusign.com');

  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath(oauthBase);

  const privateKeyPem = Buffer.from((process.env.DOCUSIGN_PRIVATE_KEY as string).replace(/\\n/g, '\n'));

  const results = await apiClient.requestJWTUserToken(
    integrationKey,
    userId,
    ['signature', 'impersonation'],
    privateKeyPem,
    3600
  );
  return results.body.access_token as string;
}

export default allowCors(handler);
