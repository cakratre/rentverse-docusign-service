import formidable from 'formidable';
import fs from 'fs';
import docusign from 'docusign-esign';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const file = files.document[0];
    const signerEmail = fields.signerEmail[0];
    const signerName = fields.signerName[0];
    
    // Read file
    const fileBuffer = fs.readFileSync(file.filepath);
    const fileBase64 = fileBuffer.toString('base64');
    
    // Initialize DocuSign client
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH);
    
    // Get access token (simplified - dalam production gunakan proper OAuth flow)
    const accessToken = await getAccessToken();
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    
    // Create envelope
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    
    const envelope = {
      emailSubject: 'Mohon tanda tangan dokumen',
      documents: [{
        documentBase64: fileBase64,
        name: file.originalFilename,
        fileExtension: file.originalFilename.split('.').pop(),
        documentId: '1'
      }],
      recipients: {
        signers: [{
          email: signerEmail,
          name: signerName,
          recipientId: '1',
          tabs: {
            signHereTabs: [{
              documentId: '1',
              pageNumber: '1',
              xPosition: '100',
              yPosition: '100'
            }]
          }
        }]
      },
      status: 'sent'
    };
    
    const result = await envelopesApi.createEnvelope(
      process.env.DOCUSIGN_ACCOUNT_ID,
      { envelopeDefinition: envelope }
    );
    
    // Clean up temp file
    fs.unlinkSync(file.filepath);
    
    res.status(200).json({
      success: true,
      envelopeId: result.envelopeId,
      message: 'Dokumen berhasil dikirim untuk ditandatangani'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengirim dokumen'
    });
  }
}

async function getAccessToken() {
  // Implementasi JWT Grant untuk mendapatkan access token
  // Atau gunakan Authorization Code Grant flow
  // Ini contoh sederhana - dalam production harus lebih secure
  
  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath(process.env.DOCUSIGN_OAUTH_BASE_PATH);
  
  const privateKey = fs.readFileSync('path/to/your/private.key');
  
  const response = await apiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATION_KEY,
    process.env.DOCUSIGN_USER_ID,
    ['signature'],
    privateKey,
    3600
  );
  
  return response.body.access_token;
}