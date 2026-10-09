import { useState, useEffect } from 'react';
import { ShieldCheck, PhoneCall, Clock, Eye, Globe } from 'lucide-react';
import './GovHeader.css';

// SVG Official Emblem of Tamil Nadu (Temple Gopuram + Ashoka Lions Crest Motif)
export function TamilNaduEmblem({ size = 50 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circular Seal Border */}
      <circle cx="50" cy="50" r="47" stroke="#002147" strokeWidth="2.5" fill="#f8fafc" />
      <circle cx="50" cy="50" r="43" stroke="#b45309" strokeWidth="1" strokeDasharray="2 2" fill="none" />

      {/* Top Banner Arch / Arc text placeholder lines */}
      <path d="M 20 28 A 36 36 0 0 1 80 28" stroke="#002147" strokeWidth="1" fill="none" />

      {/* Temple Gopuram Tower Silhouette (Tamil Nadu State Symbol) */}
      <path
        d="M 50 18 L 47 22 L 53 22 Z
           M 46 22 L 45 26 L 55 26 L 54 22 Z
           M 44 26 L 43 32 L 57 32 L 56 26 Z
           M 41 32 L 39 40 L 61 40 L 59 32 Z
           M 38 40 L 35 52 L 65 52 L 62 40 Z
           M 33 52 L 30 68 L 70 68 L 67 52 Z"
        fill="#991b1b"
        stroke="#002147"
        strokeWidth="1.2"
      />

      {/* Gopuram Kalasam (Pinnacles) */}
      <circle cx="50" cy="16" r="2" fill="#b45309" />
      <circle cx="47" cy="17" r="1.5" fill="#b45309" />
      <circle cx="53" cy="17" r="1.5" fill="#b45309" />

      {/* Gopuram Entrance Portal / Gateway */}
      <path d="M 44 68 L 44 56 C 44 52, 56 52, 56 56 L 56 68 Z" fill="#f8fafc" stroke="#002147" strokeWidth="1.2" />

      {/* Ashoka Lion Motif base & Satyameva Jayate Banner */}
      <rect x="22" y="72" width="56" height="8" rx="2" fill="#002147" />
      <text x="50" y="78" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#ffffff" letterSpacing="0.5">
        வாய்மையே வெல்லும்
      </text>

      {/* Bottom Circular Arc with TAMIL NADU */}
      <text x="50" y="90" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#002147" letterSpacing="1">
        TAMIL NADU
      </text>

      {/* Decorative side leaf sprigs */}
      <path d="M 12 50 Q 16 65 24 72" stroke="#138808" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 88 50 Q 84 65 76 72" stroke="#138808" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// SVG Emblem of India (Lion Capital of Ashoka)
export function AshokaEmblem({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Central Lion */}
      <circle cx="50" cy="30" r="11" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
      {/* Left Lion */}
      <circle cx="34" cy="33" r="9" fill="#d97706" stroke="#78350f" strokeWidth="1.2" />
      {/* Right Lion */}
      <circle cx="66" cy="33" r="9" fill="#d97706" stroke="#78350f" strokeWidth="1.2" />

      {/* Mane & Details */}
      <path d="M 44 38 C 47 44, 53 44, 56 38 Z" fill="#78350f" />
      <path d="M 28 40 C 31 45, 37 45, 40 40 Z" fill="#78350f" />
      <path d="M 60 40 C 63 45, 69 45, 72 40 Z" fill="#78350f" />

      {/* Capital Platform / Abacus */}
      <rect x="22" y="52" width="56" height="14" rx="2" fill="#002147" />

      {/* Ashoka Chakra in Center */}
      <circle cx="50" cy="59" r="5" stroke="#ffffff" strokeWidth="1" fill="#002147" />
      <circle cx="50" cy="59" r="1" fill="#ffffff" />
      {/* Chakra spokes */}
      <line x1="50" y1="54" x2="50" y2="64" stroke="#ffffff" strokeWidth="0.8" />
      <line x1="45" y1="59" x2="55" y2="59" stroke="#ffffff" strokeWidth="0.8" />

      {/* Bull and Horse symbols */}
      <circle cx="32" cy="59" r="2.5" fill="#f59e0b" />
      <circle cx="68" cy="59" r="2.5" fill="#f59e0b" />

      {/* Lotus Base / Bell */}
      <path d="M 28 66 Q 50 75 72 66 L 68 76 Q 50 82 32 76 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />

      {/* Satyameva Jayate */}
      <text x="50" y="93" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#002147" letterSpacing="0.8">
        सत्यमेव जयते
      </text>
    </svg>
  );
}

export default function GovHeader() {
  const [timeStr, setTimeStr] = useState('');
  const [fontSizeOffset, setFontSizeOffset] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTimeStr(new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST');
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const adjustFontSize = (delta) => {
    let newOffset = fontSizeOffset + delta;
    if (newOffset > 2) newOffset = 2;
    if (newOffset < -2) newOffset = -2;
    if (delta === 0) newOffset = 0;
    setFontSizeOffset(newOffset);
    document.documentElement.style.fontSize = `${16 + newOffset}px`;
  };

  return (
    <header className="gov-header" role="banner">
      {/* 1. National Tricolor Top Ribbon */}
      <div className="gov-tricolor-strip" aria-hidden="true" />

      {/* 2. Top Utility & Accessibility Bar */}
      <div className="gov-top-utility">
        <div className="gov-top-left">
          <div className="gov-top-item">
            <PhoneCall size={13} color="#ff9933" />
            <span>Toll-Free Helpline: <strong>1800-425-4567</strong></span>
          </div>
          <div className="gov-top-item">
            <span>Control Room: <strong>1077</strong></span>
          </div>
          <div className="gov-top-item">
            <Clock size={13} color="#cbd5e1" />
            <span>{timeStr || 'Loading Indian Standard Time...'}</span>
          </div>
        </div>

        <div className="gov-top-right">
          <div className="gov-top-item">
            <Eye size={13} />
            <span>Accessibility</span>
          </div>
          <div className="gov-access-btn-group" title="Adjust Font Size">
            <button className="gov-access-btn" onClick={() => adjustFontSize(-1)}>A-</button>
            <button className="gov-access-btn" onClick={() => adjustFontSize(0)}>A</button>
            <button className="gov-access-btn" onClick={() => adjustFontSize(1)}>A+</button>
          </div>
          <div className="gov-lang-badge" title="Language Switcher">
            <Globe size={11} style={{ display: 'inline', marginRight: 4 }} />
            <span>தமிழ் / ENG</span>
          </div>
        </div>
      </div>

      {/* 3. Main Official Department Branding */}
      <div className="gov-brand-container">
        <div className="gov-brand-left">
          <div className="gov-emblem-wrap" title="State Emblem of Tamil Nadu">
            <TamilNaduEmblem size={52} />
          </div>

          <div className="gov-brand-titles">
            <div className="gov-state-name">
              <span className="tamil">தமிழ்நாடு அரசு</span>
              <span>• GOVERNMENT OF TAMIL NADU</span>
            </div>
            <div className="gov-dept-name">
              <span className="tamil-dept">உள்துறை, மதுவிலக்கு மற்றும் ஆயத்தீர்வைத் துறை</span> &nbsp;|&nbsp; Department of Prohibition and Excise
            </div>
            <div className="gov-portal-name">
              <span className="gov-portal-badge">SADMS</span>
              <span>ஸ்மார்ட் மது விநியோக மேலாண்மை அமைப்பு • Smart Alcohol Distribution Management System</span>
            </div>
          </div>
        </div>

        <div className="gov-brand-right">
          <div className="gov-badge-box">
            <div className="gov-initiative-tag">
              An Official e-Governance Portal
            </div>
            <div className="gov-statute-ref">
              Under Tamil Nadu Prohibition Act, 1937
            </div>
          </div>
          <div className="gov-india-emblem-wrap" title="National Emblem of India">
            <AshokaEmblem size={44} />
          </div>
        </div>
      </div>

      {/* 4. Official Gazette & Security Status Ribbon */}
      <div className="gov-gazette-strip">
        <div className="gov-gazette-left">
          <span className="gov-gazette-pill">GAZETTE NOTIFIED</span>
          <span>Centralized Alcohol Ration Quota Ledger • Regulated Citizen Distribution System</span>
        </div>
        <div className="gov-gazette-right">
          <span className="gov-secure-indicator">
            <ShieldCheck size={14} /> 256-Bit SSL Encrypted &amp; GIGW 3.0 Verified
          </span>
          <span>State Data Centre (TNSDC), Chennai</span>
        </div>
      </div>
    </header>
  );
}
