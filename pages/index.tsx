// pages/docusign-upload.js
import DocuSignUploadForm from '@/components/DocuSignUploadForm';

export default function DocuSignUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            DocuSign Integration
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Upload dokumen dan kirim untuk ditandatangani secara digital
          </p>
        </div>
        <DocuSignUploadForm />
      </div>
    </div>
  );
}