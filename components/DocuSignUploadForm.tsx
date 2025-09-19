// components/DocuSignUploadForm.tsx
import { useState } from 'react';

type ApiResult = {
  success: boolean;
  message: string;
  envelopeId?: string;
} | null;

const DocuSignForm = () => {
  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [size, setSize] = useState('50');
  const [numberOfRoom, setNumberOfRoom] = useState('2');
  const [furnished, setFurnished] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('30');
  const [price, setPrice] = useState('5000000');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResult>(null);

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-[var(--color-border)] rounded-full text-black focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append('tenantName', tenantName);
    formData.append('tenantEmail', tenantEmail);
    formData.append('tenantAddress', tenantAddress);
    formData.append('ownerName', ownerName);
    formData.append('ownerEmail', ownerEmail);
    formData.append('ownerAddress', ownerAddress);
    formData.append('propertyAddress', propertyAddress);
    formData.append('propertyType', propertyType);
    formData.append('size', size);
    formData.append('numberOfRoom', numberOfRoom);
    formData.append('furnished', String(furnished));
    formData.append('startDate', startDate);
    formData.append('duration', duration);
    formData.append('price', price);
    
    try {
      const response = await fetch('/api/docusign/send-envelope', {
        method: 'POST',
        body: formData,
      });
      
      const data: ApiResult = await response.json();
      setResult(data);
      
      if (data?.success) {
        console.log("Success");
      }
    } catch (error) {
      setResult({ success: false, message: 'A network error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-[var(--color-background)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)] text-center">Rental Agreement Generator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Tenant Details */}
        <fieldset className="border border-[var(--color-border)] p-5 rounded-3xl">
          <legend className="text-lg font-semibold px-2 text-gray-700">Tenant Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                className={inputStyle}
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className={inputStyle}
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
                placeholder="example@mail.com"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Current Address</label>
              <input
                className={inputStyle}
                value={tenantAddress}
                onChange={(e) => setTenantAddress(e.target.value)}
                placeholder="Enter current address"
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Owner Details */}
        <fieldset className="border border-[var(--color-border)] p-5 rounded-3xl">
          <legend className="text-lg font-semibold px-2 text-gray-700">Landlord Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                className={inputStyle}
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className={inputStyle}
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="example@mail.com"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                className={inputStyle}
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
                placeholder="Enter address"
                required
              />
            </div>
          </div>
        </fieldset>
        
        {/* Property & Rent Details */}
        <fieldset className="border border-[var(--color-border)] p-5 rounded-3xl">
          <legend className="text-lg font-semibold px-2 text-gray-700">Property & Rent Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Property Address</label>
              <input
                className={inputStyle}
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="Enter property address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                className={inputStyle}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select start date"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
              <input
                type="number"
                className={inputStyle}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter number of days"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Rent Price</label>
              <input
                type="number"
                className={inputStyle}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter total rent price"
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center p-5 rounded-full text-white
            ${isLoading 
              ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]' 
              : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]'
            }`}
        >
          {isLoading ? 'Sending...' : 'Generate & Send for Signature'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-bold">{result.success ? 'Success!' : 'Error'}</p>
          <p className="text-sm">{result.message}</p>
          {result.success && result.envelopeId && (
            <p className="text-xs mt-2">Envelope ID: {result.envelopeId}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DocuSignForm;
