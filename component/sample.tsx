"use client"
import { MyDocument } from '@/lib/pdf/TestDocument';
import { PDFViewer } from '@react-pdf/renderer';

export function Sample(){
    return <PDFViewer><MyDocument /></PDFViewer>;
}