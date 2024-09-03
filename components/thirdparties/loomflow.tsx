"use client";
import React, { useEffect } from 'react';

declare global {
  interface Window {
    LoomFlows: any;
  }
}

interface LoomFlowsWidgetProps {
  accessToken: string;
}

const LoomFlowsWidget: React.FC<LoomFlowsWidgetProps> = ({ accessToken }) => {
  useEffect(() => {
    window.LoomFlows = window.LoomFlows || {};
    window.LoomFlows.access_token = accessToken;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://loomflows.com/widget/widget.umd.js';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [accessToken]);

  return null;
};

export default LoomFlowsWidget;
