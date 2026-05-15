export type Language = 'id' | 'en';

export const translations = {
  id: {
    nav: {
      home: 'Beranda',
      analyze: 'Analisis',
      radar: 'Radar',
      education: 'Edukasi',
      about: 'Tentang',
    },
    hero: {
      title: 'Pikirkan sebelum percaya.',
      subtitle: 'Veriq.id membantu menganalisis pesan mencurigakan, scam digital, dan manipulasi online menggunakan Veriq Intelligence.',
      cta: 'Mulai Analisis',
    },
    analysis: {
      placeholder: 'Tempel teks mencurigakan, email, SMS, atau tawaran di sini...',
      button: 'Mulai Neural Scan',
      analyzing: [
        'Menganalisis pola manipulasi...',
        'Memindai risiko scan...',
        'Mendeteksi anomali teks/gambar...',
        'Menghubungkan neural analysis...',
        'Memeriksa bukti visual/phishing...'
      ],
      resultTitle: 'Hasil Analisis',
      riskScore: 'Tingkat Risiko',
      riskHigh: 'Risiko Tinggi',
      riskMedium: 'Waspada',
      riskLow: 'Aman',
      probability: 'Probabilitas Scam',
      explanationTitle: 'Analisis Neural',
      highlightsTitle: 'Pola Mencurigakan',
      recommendationsTitle: 'Rekomendasi Keamanan',
      uploadDragText: 'Tarik & Lepas Gambar',
      uploadBrowseText: 'atau klik untuk menelusuri',
      tabText: 'Teks',
      tabImage: 'Gambar',
    },
    features: {
      title: 'Kemampuan Veriq.id',
      items: [
        { title: 'Veriq Scam Analysis', desc: 'Mendeteksi upaya phishing, impersonasi, dan taktik urgensi palsu.' },
        { title: 'Pemindaian Gambar', desc: 'Unggah screenshot chat, email, atau halaman login untuk diurai oleh Veriq.' },
        { title: 'Deteksi Manipulasi', desc: 'Mengenali rekayasa sosial, tekanan emosional, dan tautan berbahaya.' },
        { title: 'Sorotan Pola', desc: 'Menyoroti area mencurigakan beserta penjelasan logis.' }
      ]
    },
    about: {
      title: 'Tentang Veriq.id',
      desc: 'Veriq.id dikembangkan sebagai inisiatif keamanan digital untuk melindungi masyarakat dari manipulasi online dan penipuan digital yang semakin canggih. Didukung oleh Veriq Intelligence tingkat lanjut, sistem kami mampu mengurai pola bahasa yang menipu dalam hitungan detik.',
      missionTitle: 'Misi Kami',
      missionDesc: 'Membangun ulang kepercayaan di era digital.',
      visionTitle: 'Visi Jaringan',
      visionDesc: 'Menciptakan ekosistem internet yang lebih aman, transparan, dan terhindar dari ancaman manipulatif.'
    },
    error: {
      empty: 'Mohon masukkan teks untuk dianalisis.',
      failed: 'Gagal menganalisis teks. Silakan coba lagi.',
      quota: 'Sistem sedang sibuk atau limit tercapai. Silakan coba beberapa saat lagi.',
      noImage: 'Mohon pilih gambar untuk dianalisis.',
      invalidImage: 'Mohon unggah file gambar (PNG, JPG, dll).',
    }
  },
  en: {
    nav: {
      home: 'Home',
      analyze: 'Analyze',
      radar: 'Radar',
      education: 'Education',
      about: 'About',
    },
    hero: {
      title: 'Think before you trust.',
      subtitle: 'Veriq.id helps analyze suspicious messages, digital scams, and online manipulation using Veriq Intelligence.',
      cta: 'Start Analysis',
    },
    analysis: {
      placeholder: 'Paste suspicious text, email, SMS, or offer here...',
      button: 'Start Neural Scan',
      analyzing: [
        'Analyzing manipulation patterns...',
        'Scanning visual risks...',
        'Detecting text/image anomalies...',
        'Connecting neural analysis...',
        'Checking phishing patterns...'
      ],
      resultTitle: 'Analysis Results',
      riskScore: 'Risk Level',
      riskHigh: 'High Risk',
      riskMedium: 'Caution',
      riskLow: 'Safe',
      probability: 'Scam Probability',
      explanationTitle: 'Neural Analysis',
      highlightsTitle: 'Suspicious Patterns',
      recommendationsTitle: 'Security Recommendations',
      uploadDragText: 'Drag & Drop Image',
      uploadBrowseText: 'or click to browse',
      tabText: 'Text',
      tabImage: 'Image',
    },
    features: {
      title: 'Veriq.id Capabilities',
      items: [
        { title: 'Veriq Scam Analysis', desc: 'Detects phishing attempts, impersonation, and fake urgency tactics.' },
        { title: 'Image Scanning', desc: 'Upload chat screenshots, emails, or login pages to be analyzed by Veriq.' },
        { title: 'Manipulation Detection', desc: 'Recognizes social engineering, emotional pressure, and malicious links.' },
        { title: 'Pattern Highlights', desc: 'Highlights suspicious areas along with logical explanations.' }
      ]
    },
    about: {
      title: 'About Veriq.id',
      desc: 'Veriq.id was developed as a digital security initiative to protect society from increasingly sophisticated online manipulation and digital scams. Powered by advanced Veriq Intelligence, our system decodes deceptive language patterns in seconds.',
      missionTitle: 'Our Mission',
      missionDesc: 'Rebuilding trust in the digital age.',
      visionTitle: 'Network Vision',
      visionDesc: 'Creating a safer, more transparent internet ecosystem free from manipulative threats.'
    },
    error: {
      empty: 'Please enter text to analyze.',
      failed: 'Failed to analyze text. Please try again.',
      quota: 'System is busy or quota exceeded. Please try again later.',
      noImage: 'Please select an image to analyze.',
      invalidImage: 'Please upload an image file (PNG, JPG, etc).',
    }
  }
};
