import React from 'react';
import DocumentVisualizer from './components/DocumentVisualizer';
import jsonData from './darshanpurohit_resume.json';
import './App.css';

export default function App() {
  return <DocumentVisualizer jsonData={jsonData} />;
}