'use client';

import Image from 'next/image';

export default function Letterhead() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #f8f9fa;
          padding: 40px 20px;
        }

        .letterhead-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .header {
          background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
          padding: 50px 60px;
          position: relative;
          overflow: hidden;
        }

        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 400px;
          height: 400px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }

        .header::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -5%;
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 50%;
        }

        .header-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 40px;
        }

        .logo-section {
          flex: 0 0 auto;
        }

        .logo {
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          padding: 8px;
        }

        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .company-info {
          flex: 1;
          color: white;
          text-align: right;
        }

        .company-name {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .tagline {
          font-size: 15px;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.95;
          margin-bottom: 30px;
        }

        .divider {
          height: 2px;
          width: 80px;
          background: rgba(255, 255, 255, 0.4);
          margin: 20px 0 20px auto;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-top: 25px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          font-size: 14px;
          line-height: 1.6;
        }

        .contact-item svg {
          width: 18px;
          height: 18px;
          fill: white;
          opacity: 0.9;
        }

        .contact-item a {
          color: white;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .contact-item a:hover {
          opacity: 0.8;
        }

        .body-content {
          padding: 60px;
          min-height: 400px;
          background: white;
        }

        .date {
          color: #6B7280;
          font-size: 14px;
          margin-bottom: 30px;
        }

        .salutation {
          font-size: 16px;
          color: #1F2937;
          margin-bottom: 20px;
        }

        .content-area {
          color: #374151;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 30px;
        }

        .content-area p {
          margin-bottom: 16px;
        }

        .signature-section {
          margin-top: 50px;
        }

        .regards {
          color: #374151;
          margin-bottom: 60px;
        }

        .signature-name {
          font-weight: 600;
          color: #DC2626;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .signature-title {
          color: #6B7280;
          font-size: 14px;
        }

        .footer {
          background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
          padding: 30px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          font-size: 12px;
        }

        .footer-address {
          line-height: 1.6;
          opacity: 0.9;
        }

        .footer-right {
          text-align: right;
          line-height: 1.6;
          opacity: 0.9;
        }

        .accent-bar {
          height: 4px;
          background: linear-gradient(90deg, #DC2626 0%, #EF4444 50%, #DC2626 100%);
        }

        @media (max-width: 768px) {
          .header {
            padding: 40px 30px;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .company-info {
            text-align: left;
          }

          .company-name {
            font-size: 28px;
          }

          .divider {
            margin-left: 0;
          }

          .contact-item {
            justify-content: flex-start;
          }

          .body-content {
            padding: 40px 30px;
          }

          .footer {
            flex-direction: column;
            gap: 20px;
            text-align: center;
            padding: 30px;
          }

          .footer-right {
            text-align: center;
          }
        }

        @media print {
          body {
            background: white;
            padding: 0;
          }

          .letterhead-container {
            box-shadow: none;
            border-radius: 0;
          }
        }
      `}</style>

      <div className="letterhead-container">
        <div className="accent-bar"></div>

        <div className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
                <img src="/assets/icons/drmhope-icon.png" alt="DRMHOPE SOFTWARE Logo" />
              </div>
            </div>

            <div className="company-info">
              <h1 className="company-name">DRMHOPE SOFTWARE</h1>
              <p className="tagline">Empowering businesses with intelligent AI agents</p>
              <div className="divider"></div>

              <div className="contact-grid">
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Nagpur, Maharashtra, India</span>
                </div>

                <div className="contact-item">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <a href="tel:+919373111709">+91 937-3111-709</a>
                </div>

                <div className="contact-item">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href="mailto:murali@drmhope.com">murali@drmhope.com</a>
                </div>

                <div className="contact-item">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                  </svg>
                  <a href="https://www.drmhope.com" target="_blank" rel="noopener noreferrer">www.drmhope.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="body-content">
          <div className="date">{currentDate}</div>

          <div className="salutation">
            Dear [Recipient Name],
          </div>

          <div className="content-area">
            <p>
              [Your letter content goes here. This is a professionally designed letterhead template for DRMHOPE SOFTWARE,
              featuring modern styling and comprehensive contact information.]
            </p>
            <p>
              [Add additional paragraphs as needed for your correspondence. The template is designed to be both
              professional and visually appealing, suitable for all business communications.]
            </p>
            <p>
              [Thank you for your consideration and we look forward to serving your digital innovation needs.]
            </p>
          </div>

          <div className="signature-section">
            <div className="regards">
              Best Regards,
            </div>
            <div className="signature-name">Murali</div>
            <div className="signature-title">DRMHOPE SOFTWARE</div>
          </div>
        </div>

        <div className="footer">
          <div className="footer-address">
            <strong>DRMHOPE SOFTWARE</strong><br />
            Nagpur, Maharashtra, India
          </div>
          <div className="footer-right">
            Mobile: +91 937-3111-709 | Email: murali@drmhope.com<br />
            Empowering businesses with intelligent AI agents
          </div>
        </div>

        <div className="accent-bar"></div>
      </div>
    </>
  );
}
