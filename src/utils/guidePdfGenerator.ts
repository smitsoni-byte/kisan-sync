import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getManualTranslation } from '../data/userManualTranslations';

export interface GuideSectionData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  steps: { num: string; title: string; desc: string; extra?: string }[];
  keyPoints?: string[];
  helpline: string;
}

export const getGuideSectionData = (sectionId: string, langCode: string): GuideSectionData => {
  const trans = getManualTranslation(langCode);
  const section = (trans.sections as any)[sectionId] || trans.sections.quickstart;

  return {
    id: section.id,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    steps: section.steps,
    keyPoints: section.keyPoints,
    helpline: trans.helplineNumber,
  };
};

export const generateGuidePDF = async (
  sectionId: string,
  langCodeOrIsGu: string | boolean,
  currentLanguage: { code: string; nativeName: string }
): Promise<{ pdfFile: File; fileName: string; sectionData: GuideSectionData }> => {
  const langCode = typeof langCodeOrIsGu === 'string' ? langCodeOrIsGu : (langCodeOrIsGu ? 'gu' : currentLanguage.code || 'en');
  const sectionData = getGuideSectionData(sectionId, langCode);
  const trans = getManualTranslation(langCode);

  // 1. Create a pristine styled container
  const container = document.createElement('div');
  container.id = 'kisansync-pdf-render-target';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // ~A4 width in 96 DPI
  container.style.background = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Anek Gujarati', 'Noto Sans Gurmukhi', system-ui, -apple-system, sans-serif";
  container.style.padding = '36px 40px';
  container.style.boxSizing = 'border-box';

  const stepsHtml = sectionData.steps
    .map(
      (s) => `
    <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
        <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #ea580c; color: #ffffff; font-weight: 800; font-size: 11pt;">${s.num}</span>
        <h3 style="font-size: 13pt; font-weight: 700; color: #0f172a; margin: 0;">${s.title}</h3>
      </div>
      <p style="font-size: 11pt; color: #334155; line-height: 1.55; margin: 0; padding-left: 36px;">${s.desc}</p>
    </div>`
    )
    .join('');

  const keyPointsHtml = sectionData.keyPoints
    ? `
    <div style="background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 14px 18px; margin-top: 18px;">
      <h4 style="font-size: 11pt; font-weight: 700; color: #c2410c; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">
        ${langCode === 'gu' ? 'મુખ્ય વિશેષતાઓ & લાભ:' : langCode === 'hi' ? 'मुख्य विशेषताएं एवं लाभ:' : 'Key Highlights & Benefits:'}
      </h4>
      <ul style="margin: 0; padding-left: 20px; color: #7c2d12; font-size: 10.5pt; line-height: 1.6;">
        ${sectionData.keyPoints.map((k) => `<li>${k}</li>`).join('')}
      </ul>
    </div>`
    : '';

  container.innerHTML = `
    <div style="border-bottom: 3px solid #ea580c; padding-bottom: 18px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <div style="font-size: 24pt; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">KisanSync 🌱</div>
        <div style="color: #ea580c; font-size: 10pt; font-weight: 700; text-transform: uppercase; margin-top: 2px;">
          ${trans.modalTitle}
        </div>
      </div>
      <div style="text-align: right; font-size: 9.5pt; color: #64748b;">
        <span style="display: inline-block; background: #ffedd5; color: #c2410c; font-weight: 700; padding: 3px 10px; border-radius: 9999px; font-size: 9pt; margin-bottom: 4px;">
          ${trans.versionBadge}
        </span>
        <div>${langCode === 'gu' ? 'ભાષા:' : langCode === 'hi' ? 'भाषा:' : 'Language:'} ${currentLanguage.nativeName} (${currentLanguage.code.toUpperCase()})</div>
        <div>${langCode === 'gu' ? 'તારીખ:' : langCode === 'hi' ? 'दिनांक:' : 'Date:'} ${new Date().toLocaleDateString()}</div>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <div style="display: inline-block; background: #0f172a; color: #ffffff; font-size: 9pt; font-weight: 700; padding: 3px 10px; border-radius: 6px; text-transform: uppercase; margin-bottom: 8px;">
        ${langCode === 'gu' ? 'માર્ગદર્શિકા વિભાગ' : langCode === 'hi' ? 'मार्गदर्शिका भाग' : 'Guide Module'}
      </div>
      <h1 style="font-size: 19pt; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; line-height: 1.3;">
        ${sectionData.title}
      </h1>
      <p style="font-size: 11.5pt; color: #ea580c; font-weight: 600; margin: 0 0 10px 0;">
        ${sectionData.subtitle}
      </p>
      <p style="font-size: 11pt; color: #334155; line-height: 1.6; margin: 0;">
        ${sectionData.description}
      </p>
    </div>

    <div style="margin-top: 18px;">
      <h2 style="font-size: 13pt; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px;">
        ${langCode === 'gu' ? 'વિગતવાર પગલાં & પદ્ધતિ:' : langCode === 'hi' ? 'विस्तृत चरण एवं विधि:' : 'Detailed Step-by-Step Instructions:'}
      </h2>
      ${stepsHtml}
    </div>

    ${keyPointsHtml}

    <div style="background: #f1f5f9; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px 18px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: #0f172a; font-size: 10.5pt;">${trans.farmerHelplineLabel}</strong>
        <span style="color: #ea580c; font-weight: 700; font-size: 11pt; margin-left: 6px;">${sectionData.helpline}</span>
      </div>
      <div style="color: #475569; font-size: 9.5pt;">
        portal: <strong>https://kisansync.ai</strong>
      </div>
    </div>

    <div style="margin-top: 24px; border-top: 1.5px solid #e2e8f0; padding-top: 12px; font-size: 9pt; color: #94a3b8; display: flex; justify-content: space-between;">
      <div>KisanSync Autonomous Agricultural Platform • Verified Documentation</div>
      <div>Page 1 of 1</div>
    </div>
  `;

  document.body.appendChild(container);

  // Allow web fonts to render
  await new Promise((resolve) => setTimeout(resolve, 200));

  // 2. Render to high-DPI canvas
  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  document.body.removeChild(container);

  // 3. Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210; // A4 mm
  const pageHeight = 297; // A4 mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const pdfBlob = pdf.output('blob');
  const safeTitle = sectionData.id;
  const fileName = `KisanSync_Guide_${safeTitle}_${currentLanguage.code}.pdf`;
  const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

  return { pdfFile, fileName, sectionData };
};
