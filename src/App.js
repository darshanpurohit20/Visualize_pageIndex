import React, { useState } from 'react';
import DocumentVisualizer from './components/DocumentVisualizer';
import './App.css';

// Import all JSON files from results
import darshanpurohitResume from './results/darshanpurohit_resume.json';
import harshRedasaniResume from './results/harsh_redasani_resume.json';
import chandanSinghResume from './results/chandan_singh_resume.json';
import annualReport2023 from './results/2023-annual-report_structure.json';
import annualReport2023Truncated from './results/2023-annual-report-truncated_structure.json';
import prmlStructure from './results/PRML_structure.json';
import earthmoverStructure from './results/earthmover_structure.json';
import fourLecturesStructure from './results/four-lectures_structure.json';
import q1Fy25Earnings from './results/q1-fy25-earnings_structure.json';
import regBestInterestInterpretive from './results/Regulation Best Interest_Interpretive release_structure.json';
import regBestInterestProposed from './results/Regulation Best Interest_proposed rule_structure.json';

const JSON_FILES = [
  { label: 'Darshan Purohit Resume', data: darshanpurohitResume },
  { label: 'Harsh Redasani Resume', data: harshRedasaniResume },
   { label: 'Chandan Singh Resume', data: chandanSinghResume },
  { label: '2023 Annual Report', data: annualReport2023 },
  { label: '2023 Annual Report (Truncated)', data: annualReport2023Truncated },
  { label: 'PRML Structure', data: prmlStructure },
  { label: 'Earthmover Structure', data: earthmoverStructure },
  { label: 'Four Lectures', data: fourLecturesStructure },
  { label: 'Q1 FY25 Earnings', data: q1Fy25Earnings },
  { label: 'Reg Best Interest — Interpretive Release', data: regBestInterestInterpretive },
  { label: 'Reg Best Interest — Proposed Rule', data: regBestInterestProposed },
];

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <DocumentVisualizer
      key={selectedIndex}
      jsonData={JSON_FILES[selectedIndex].data}
      jsonFiles={JSON_FILES}
      selectedIndex={selectedIndex}
      onSelectFile={setSelectedIndex}
    />
  );
}