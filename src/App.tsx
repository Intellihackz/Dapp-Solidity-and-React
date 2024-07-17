import { useState } from 'react';
import { contract } from './web3config';
import './App.css'; 
interface CertificateData {
  0: boolean;  // isValid - Note the index notation for tuple elements
  1: string;   // issuer
  2: string;   // issueDate (as a string for easier formatting)
}

function App() {
  const [certId, setCertId] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!certId) {
      setVerificationResult('Please enter a certificate ID.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await contract.methods.verifyCertificate(certId).call();
      // Type assertion to ensure TypeScript compatibility
      const { 0: isValid, 1: issuer, 2: issueDate } = result as unknown as CertificateData;

      if (isValid) {
        const formattedDate = new Date(Number(issueDate) * 1000).toLocaleDateString();
        setVerificationResult(`Certificate is valid! Issued by ${issuer} on ${formattedDate}`);
      } else {
        setVerificationResult('Certificate not found.');
      }
    } catch (error) {
      setVerificationResult('Error verifying certificate.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
        <h1>Certificate Verification</h1>

        <input 
            type="text" 
            value={certId}
            onChange={(e) => setCertId(e.target.value)} 
            placeholder="Enter certificate ID" 
        />

        <button onClick={handleVerify} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
        </button>

        <p>{verificationResult}</p>
    </div>
);

}

export default App;
