
import React from 'react';

const RegistrationGuide: React.FC = () => {
  const steps = [
    {
      id: '01',
      title: 'Step 1',
      color: 'border-amber-500',
      numColor: 'bg-amber-500',
      items: [
        'Download a Wallet',
        'Download Trust Wallet or MetaMask.',
        'Keep at least $5 USDT in your wallet.',
        'Also keep a minimum of $1 BNB (BEP20) for gas fees.'
      ]
    },
    {
      id: '02',
      title: 'Step 2',
      color: 'border-blue-600',
      numColor: 'bg-blue-600',
      items: [
        'Use the Wallet Browser',
        'Open the built-in browser in Trust Wallet or MetaMask.',
        'Paste the 20XBET referral link in the top-right address bar.'
      ]
    },
    {
      id: '03',
      title: 'Step 3',
      color: 'border-green-500',
      numColor: 'bg-green-500',
      items: [
        'Change Network',
        'Click on the three dots (⋮) at the top.',
        'Select EVM Chain',
        'Switch the network to Binance Smart Chain (BEP20).'
      ]
    },
    {
      id: '04',
      title: 'Step 4',
      color: 'border-rose-600',
      numColor: 'bg-rose-600',
      items: [
        'Complete Registration',
        'After setting everything correctly, complete your registration.'
      ]
    }
  ];

  return (
    <div className="mt-20 w-full max-w-6xl mx-auto px-4">
      <h2 className="text-4xl md:text-6xl font-logo text-crumpled text-center mb-16 tracking-tight uppercase">
        How to Register?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div key={step.id} className="relative pt-6 group">
            {/* Step Number Badge */}
            <div className={`absolute top-0 left-6 w-12 h-12 ${step.numColor} rounded-full flex items-center justify-center text-white font-logo text-xl z-20 shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-slate-950`}>
              {step.id}
            </div>
            
            {/* Card Content */}
            <div className={`bg-slate-900/40 backdrop-blur-sm border-2 ${step.color} rounded-2xl p-6 h-full transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`}>
              <div className="bg-white rounded-lg py-2 mb-6 shadow-md text-center">
                 <h3 className="text-slate-900 font-logo text-2xl uppercase tracking-tighter">{step.title}</h3>
              </div>
              
              <ul className="space-y-3">
                {step.items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 mr-3 shrink-0"></span>
                    <span className="text-xs md:text-sm font-bold text-slate-100 leading-relaxed text-left">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex justify-center opacity-40">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent w-full"></div>
      </div>
    </div>
  );
};

export default RegistrationGuide;
