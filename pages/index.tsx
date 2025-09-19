// pages/index.tsx
import DocuSignUploadForm from '@/components/DocuSignUploadForm';
import Head from 'next/head';

const DocuSignUploadPage = () => {
  return (
    <div className="">
      <Head>
        <title>Rental Agreement PDF Generator</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <div className="min-h-screen bg-[var(--color-background)] py-12">
        <DocuSignUploadForm />
      </div>
    </div>

  );
}

export default DocuSignUploadPage;