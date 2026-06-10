"use client";

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BulkUpload({ onUploadComplete }: { onUploadComplete: (data: any[]) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus('parsing');
    setError(null);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let data: any[] = [];

      if (extension === 'csv') {
        data = await parseCSV(file);
      } else if (extension === 'xlsx' || extension === 'xls') {
        data = await parseExcel(file);
      } else {
        throw new Error('Unsupported file format. Please upload CSV or Excel.');
      }

      // Basic validation
      validateData(data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStatus('success');
      onUploadComplete(data);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const parseCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error)
      });
    });
  };

  const parseExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const ab = e.target?.result;
          const wb = XLSX.read(ab, { type: 'array' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const validateData = (data: any[]) => {
    if (data.length === 0) throw new Error('File is empty.');
    const required = ['name', 'tier', 'lat', 'lng'];
    const firstRow = data[0];
    const missing = required.filter(col => !(col in firstRow));
    if (missing.length > 0) {
      throw new Error(`Missing required columns: ${missing.join(', ')}`);
    }
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        accept=".csv,.xlsx,.xls" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer glass-panel border-dashed border-2 p-8 rounded-xl flex flex-col items-center justify-center gap-4 transition-all ${
          status === 'error' ? 'border-critical/50 bg-critical/5' : 
          status === 'success' ? 'border-success/50 bg-success/5' : 
          'border-white/10 hover:border-glow-blue/50'
        }`}
      >
        {isUploading ? (
          <Loader2 className="w-10 h-10 text-glow-blue animate-spin" />
        ) : status === 'success' ? (
          <CheckCircle2 className="w-10 h-10 text-success" />
        ) : status === 'error' ? (
          <AlertCircle className="w-10 h-10 text-critical" />
        ) : (
          <Upload className="w-10 h-10 text-slate-400" />
        )}

        <div className="text-center">
          <p className="font-header text-sm text-white uppercase tracking-wider">
            {isUploading ? 'Analyzing Supply Chain Data...' : 
             status === 'success' ? 'Upload Complete' : 
             status === 'error' ? 'Validation Failed' : 
             'Drop Supply Chain CSV or Excel'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono">
            {error || 'Auto-mapping: Name, Tier, Coordinates'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
