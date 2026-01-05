import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Csv from './pages/Csv'

import LenisScroll from './components/lenis-scroll'
import Table from './pages/Table'
import { Routes } from 'react-router'
import { Route } from 'react-router'
import { useNavigate } from 'react-router'
import Api from './pages/Api'
import Home from './pages/Home'
import Result from './pages/Result'
import Chatbot from './pages/Chatbot'
function App() {
  const [result, setResult] = useState();
//   {
//     "status": "success",
//     "genai_insights": {
//         "data_quality_issues": {
//             "Completeness": {
//                 "issue": "Some columns have high null ratios",
//                 "affected_columns": [
//                     "customer_id",
//                     "amount",
//                     "kyc_address"
//                 ],
//                 "description": "The columns customer_id, amount, and kyc_address have null ratios of 0.0012, 0.0005, and 0.22 respectively, indicating some missing values."
//             },
//             "Accuracy": {
//                 "issue": "No specific accuracy issues detected",
//                 "affected_columns": [],
//                 "description": "No specific accuracy issues detected, but some data may be incorrect or inconsistent."
//             },
//             "Consistency": {
//                 "issue": "Inconsistent data formats",
//                 "affected_columns": [
//                     "currency"
//                 ],
//                 "description": "The currency column has both 'INR' and 'inr' values, indicating inconsistent data formats."
//             },
//             "Validity": {
//                 "issue": "Some values may not be valid",
//                 "affected_columns": [
//                     "amount",
//                     "txn_timestamp"
//                 ],
//                 "description": "The amount column has a negative value ratio of 0.015 and a min value of -50.0, indicating some potentially invalid values. The txn_timestamp column has a future timestamp ratio of 0.02 and a stale record ratio of 0.18."
//             },
//             "Timeliness": {
//                 "issue": "Some records may be stale or have future timestamps",
//                 "affected_columns": [
//                     "txn_timestamp"
//                 ],
//                 "description": "The txn_timestamp column has a future timestamp ratio of 0.02 and a stale record ratio of 0.18, indicating some records may not be up-to-date."
//             },
//             "Uniqueness": {
//                 "issue": "Some columns have low uniqueness ratios",
//                 "affected_columns": [
//                     "customer_id",
//                     "amount",
//                     "kyc_address"
//                 ],
//                 "description": "The columns customer_id, amount, and kyc_address have unique ratios of 0.42, 0.23, and 0.76 respectively, indicating some duplicate values."
//             },
//             "Integrity": {
//                 "issue": "No specific integrity issues detected",
//                 "affected_columns": [],
//                 "description": "No specific integrity issues detected."
//             }
//         },
//         "remediation_actions": [
//             {
//                 "action": "Validate and correct inconsistent data formats",
//                 "priority": 1,
//                 "description": "Validate and correct inconsistent data formats in the currency column."
//             },
//             {
//                 "action": "Verify and correct potentially invalid values",
//                 "priority": 2,
//                 "description": "Verify and correct potentially invalid values in the amount and txn_timestamp columns."
//             },
//             {
//                 "action": "Handle missing values",
//                 "priority": 3,
//                 "description": "Handle missing values in the customer_id, amount, and kyc_address columns."
//             }
//         ],
//         "regulatory_compliance_risks": [
//             "KYC and AML regulations may be impacted by inconsistent or invalid data in the kyc_address and customer_id columns."
//         ],
//         "composite_dqs": 0.72,
//         "dimension_scores": {
//             "Completeness": 0.7,
//             "Validity": 0.75,
//             "Consistency": 0.8,
//             "Timeliness": 0.85,
//             "Uniqueness": 0.9,
//             "Accuracy": 0.0
//         }
//     }
// }
  const navigate = useNavigate();

  const handleFinishedAnalysis = (data) => {
    console.log("Analysis received:", data);
    setResult(data);
    navigate('/result');
  };

  return (
    <div>

      <LenisScroll />
      <Navbar />
      <Routes>
        <Route path="/csv" element={<Csv onResult={handleFinishedAnalysis} />} />

        <Route path="/table" element={<Table onResult={handleFinishedAnalysis} />} />
        <Route path="/api" element={<Api onResult={handleFinishedAnalysis} />} />
        <Route path="/chat" element={<Chatbot auditContext={result} />} />
        <Route path="/result" element={<Result result={result} onResult={handleFinishedAnalysis} />} />
        <Route path="/" element={<Home />} />
      </Routes>



    </div>
  );
}

export default App

