import React from 'react';
import { useLocation } from 'react-router-dom';

const PrintStyles = () => {
  const location = useLocation();
  const isPrintView = new URLSearchParams(location.search).has('print');

  if (!isPrintView) return null;

  return (
    <style>
      {`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
          }
          table {
            page-break-inside: avoid;
          }
        }
      `}
    </style>
  );
};

export default PrintStyles;