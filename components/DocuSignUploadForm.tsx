import { useState } from 'react';

export default function DocuSignUploadForm() {
  const [file, setFile] = useState(null);
  const [signerEmail, setSignerEmail] = useState('');
  const [signerName, setSignerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Hanya file PDF yang diperbolehkan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !signerEmail || !signerName) {
      alert('Semua field harus diisi');
      return;
    }
    
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('document', file);
    formData.append('signerEmail', signerEmail);
    formData.append('signerName', signerName);
    
    try {
      const response = await fetch('/api/docusign/send-envelope', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Reset form
        setFile(null);
        setSignerEmail('');
        setSignerName('');
        document.getElementById('fileInput').value = '';
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Terjadi kesalahan saat mengirim dokumen'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Dokumen untuk Tanda Tangan</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700">
            Pilih Dokumen PDF
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
            required
          />
          {file && (
            <p className="mt-2 text-sm text-green-600">
              File terpilih: {file.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signerName" className="block text-sm font-medium text-gray-700">
            Nama Penandatangan
          </label>
          <input
            id="signerName"
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <div>
          <label htmlFor="signerEmail" className="block text-sm font-medium text-gray-700">
            Email Penandatangan
          </label>
          <input
            id="signerEmail"
            type="email"
            value={signerEmail}
            onChange={(e) => setSignerEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="email@example.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                     ${isLoading 
                       ? 'bg-gray-400 cursor-not-allowed' 
                       : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                     }`}
        >
          {isLoading ? 'Mengirim...' : 'Kirim untuk Ditandatangani'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="text-sm">{result.message}</p>
          {result.success && result.envelopeId && (
            <p className="text-xs mt-2">Envelope ID: {result.envelopeId}</p>
          )}
        </div>
      )}
    </div>
  );
}