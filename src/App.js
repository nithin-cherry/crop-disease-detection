import React, { useState } from 'react';
import './App.css';

const translations = {
  en: {
    appName: "CropGuard",
    analyze: "Analyze Crop",
    tips: "Best Practices",
    schemes: "Govt Schemes",
    pesticides: "Pesticides",
    uploadImage: "Upload Crop Image",
    dragDrop: "Drag & drop or click to select",
    supported: "Supported: JPG, PNG, WEBP",
    analyzeBtn: " Analyze Disease",
    analyzing: "Analyzing with AI...",
    analysisResult: "Analysis Result",
    errorMsg: "Something went wrong. Please try again.",
    tipsTitle: " Best Practices for Good Crop Yield",
    tipsSubtitle: "Follow these important precautions to get maximum yield",
  },
  te: {
    appName: "క్రాప్‌గార్డ్ AI",
    analyze: "పంట విశ్లేషణ",
    tips: "ఉత్తమ పద్ధతులు",
    schemes: "ప్రభుత్వ పథకాలు",
    pesticides: "పురుగు మందులు",
    uploadImage: "పంట చిత్రం అప్‌లోడ్ చేయండి",
    dragDrop: "డ్రాగ్ చేయండి లేదా క్లిక్ చేయండి",
    supported: "మద్దతు: JPG, PNG, WEBP",
    analyzeBtn: " వ్యాధి విశ్లేషించండి",
    analyzing: "AIతో విశ్లేషిస్తోంది...",
    analysisResult: "విశ్లేషణ ఫలితం",
    errorMsg: "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    tipsTitle: " మంచి పంట దిగుబడి కోసం ఉత్తమ పద్ధతులు",
    tipsSubtitle: "గరిష్ట దిగుబడి కోసం ఈ జాగ్రత్తలు పాటించండి",
  }
};

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");
  const [activePage, setActivePage] = useState("analyze");

  const t = translations[language];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("language", language);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || t.errorMsg);
      }
    } catch (err) {
      setError(t.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
             <span>{t.appName}</span>
          </div>

          <div className="nav-links">
            <a href="#" className={`nav-link ${activePage === 'analyze' ? 'active' : ''}`} onClick={() => setActivePage('analyze')}>{t.analyze}</a>
            <a href="#" className={`nav-link ${activePage === 'tips' ? 'active' : ''}`} onClick={() => setActivePage('tips')}>{t.tips}</a>
            <a href="#" className={`nav-link ${activePage === 'schemes' ? 'active' : ''}`} onClick={() => setActivePage('schemes')}>{t.schemes}</a>
            <a href="#" className={`nav-link ${activePage === 'pesticides' ? 'active' : ''}`} onClick={() => setActivePage('pesticides')}>{t.pesticides}</a>
          </div>

          <div className="language-selector">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">🇬🇧 English</option>
              <option value="te">🇮🇳 తెలుగు</option>
            </select>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* ANALYZE PAGE */}
        {activePage === 'analyze' && (
          <>
            <div className="upload-card">
              <div className="upload-area">
                <input type="file" accept="image/*" onChange={handleImageChange} id="image-upload" className="hidden" />
                <label htmlFor="image-upload" className="upload-label">
                  <div className="upload-icon"></div>
                  <h3>{t.uploadImage}</h3>
                  <p>{t.dragDrop}</p>
                  <span className="supported">{t.supported}</span>
                </label>
              </div>

              {preview && (
                <div className="preview-container">
                  <img src={preview} alt="Preview" className="preview-image" />
                </div>
              )}

              <button onClick={handleAnalyze} disabled={!image || loading} className="analyze-btn">
                {loading ? (
                  <><span className="spinner"></span> {t.analyzing}</>
                ) : (
                  t.analyzeBtn
                )}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {result && (
              <div className="results">
                <h2 className="results-title">{t.analysisResult}</h2>
                <div className="cards-grid">
                  <div className="card crop-card">
                    <div className="card-header">{language === 'te' ? 'పంట' : 'Crop'}</div>
                    <p className="card-value">{result.cropName}</p>
                  </div>
                  <div className="card disease-card">
                    <div className="card-header">{language === 'te' ? 'వ్యాధి' : 'Disease'}</div>
                    <p className="card-value">{result.disease}</p>
                  </div>
                  <div className="card symptoms-card full-width">
                    <div className="card-header">{language === 'te' ? 'లక్షణాలు' : 'Symptoms'}</div>
                    <p className="card-content">{result.symptoms}</p>
                  </div>
                  <div className="card treatment-card">
                    <div className="card-header">{language === 'te' ? 'చికిత్స' : 'Treatment'}</div>
                    <p className="card-content">{result.treatment}</p>
                  </div>
                  <div className="card prevention-card">
                    <div className="card-header">{language === 'te' ? 'నివారణ' : 'Prevention'}</div>
                    <p className="card-content">{result.prevention}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

       {/* Tips Page */}
{activePage === 'tips' && (
  <div className="tips-page">
    <h2 className="page-title">{t.tipsTitle}</h2>
    <p className="page-subtitle">{t.tipsSubtitle}</p>

    <div className="tips-grid large-grid">
      <div className="tip-card">
        <div className="tip-icon"></div>
        <h3>{language === 'te' ? 'నేల ఆరోగ్యం' : 'Soil Health'}</h3>
        <ul>
          <li>{language === 'te' ? 'ప్రతి సీజన్‌కు ముందు నేల పరీక్ష చేయించండి' : 'Test soil before every season'}</li>
          <li>{language === 'te' ? 'సేంద్రియ ఎరువు, కంపోస్ట్ వాడండి' : 'Use organic manure and compost'}</li>
          <li>{language === 'te' ? 'మైక్రోన్యూట్రియెంట్ల లోపం ఉందో లేదో తెలుసుకోండి' : 'Check for micronutrient deficiency'}</li>
        </ul>
      </div>

      <div className="tip-card">
        <div className="tip-icon"></div>
        <h3>{language === 'te' ? 'విత్తనాల ఎంపిక' : 'Seed Selection'}</h3>
        <ul>
          <li>{language === 'te' ? 'ప్రామాణిక ధృవీకృత విత్తనాలు వాడండి' : 'Use certified seeds only'}</li>
          <li>{language === 'te' ? 'స్థానిక వాతావరణానికి తగిన రకాన్ని ఎంచుకోండి' : 'Choose varieties suited to local climate'}</li>
          <li>{language === 'te' ? 'విత్తన శుద్ధి తప్పనిసరి' : 'Treat seeds before sowing'}</li>
        </ul>
      </div>

      <div className="tip-card">
        <div className="tip-icon"></div>
        <h3>{language === 'te' ? 'నీటి నిర్వహణ' : 'Water Management'}</h3>
        <ul>
          <li>{language === 'te' ? 'అధిక నీరు పెట్టకండి' : 'Avoid over-watering'}</li>
          <li>{language === 'te' ? 'డ్రిప్ లేదా స్ప్రింక్లర్ విధానాలు ఉపయోగించండి' : 'Use drip or sprinkler systems where possible'}</li>
          <li>{language === 'te' ? 'పంట దశనుబట్టి నీటి పరిమాణం మార్చండి' : 'Adjust irrigation by crop stage'}</li>
        </ul>
      </div>

      <div className="tip-card">
        <div className="tip-icon"></div>
        <h3>{language === 'te' ? 'ఎరువుల నిర్వహణ' : 'Nutrient Management'}</h3>
        <ul>
          <li>{language === 'te' ? 'NPK ను సమతుల్యంగా వాడండి' : 'Apply balanced NPK nutrients'}</li>
          <li>{language === 'te' ? 'అవసరమైతే ఫోలియర్ స్ప్రే వాడండి' : 'Use foliar sprays when required'}</li>
          <li>{language === 'te' ? 'మట్టి పరీక్ష నివేదిక ఆధారంగా ఎరువులు వేయండి' : 'Apply fertilizer based on soil report'}</li>
        </ul>
      </div>

      <div className="tip-card">
        <div className="tip-icon"></div>
        <h3>{language === 'te' ? 'కీటకాలు & వ్యాధుల పర్యవేక్షణ' : 'Pest & Disease Monitoring'}</h3>
        <ul>
          <li>{language === 'te' ? 'ప్రతి వారం పొలాన్ని పరిశీలించండి' : 'Inspect the field weekly'}</li>
          <li>{language === 'te' ? 'మొదటి లక్షణాలు కనిపించగానే చర్య తీసుకోండి' : 'Act at the first visible symptoms'}</li>
          <li>{language === 'te' ? 'అవసరమైతే మాత్రమే మందులు వాడండి' : 'Use chemicals only when necessary'}</li>
        </ul>
      </div>

      <div className="tip-card">
        <div className="tip-icon"></div>
        <h3>{language === 'te' ? 'కలుపు నియంత్రణ' : 'Weed Control'}</h3>
        <ul>
          <li>{language === 'te' ? 'ప్రారంభ దశలోనే కలుపును తొలగించండి' : 'Remove weeds at early stage'}</li>
          <li>{language === 'te' ? 'మల్చింగ్ ఉపయోగించండి' : 'Use mulching to suppress weeds'}</li>
          <li>{language === 'te' ? 'పంటతో పోటీ తగ్గించండి' : 'Reduce nutrient competition'}</li>
        </ul>
      </div>

      <div className="tip-card">
        <div className="tip-icon"></div>
        <h3>{language === 'te' ? 'సహజ వ్యవసాయం' : 'Natural Farming'}</h3>
        <ul>
          <li>{language === 'te' ? 'వేప ఆధారిత ద్రావణాలు వాడండి' : 'Use neem-based solutions where possible'}</li>
          <li>{language === 'te' ? 'రసాయన వినియోగాన్ని తగ్గించండి' : 'Reduce unnecessary pesticide use'}</li>
          <li>{language === 'te' ? 'స్థానిక వ్యవసాయ అధికారుల సలహాలు పాటించండి' : 'Follow local agriculture officer guidance'}</li>
        </ul>
      </div>

      <div className="tip-card">
        <div className="tip-icon"></div>
        <h3>{language === 'te' ? 'కోత & నిల్వ' : 'Harvest & Storage'}</h3>
        <ul>
          <li>{language === 'te' ? 'సరైన తేమ శాతం వద్ద కోత కోయండి' : 'Harvest at proper maturity and moisture'}</li>
          <li>{language === 'te' ? 'పంటను బాగా ఆరబెట్టండి' : 'Dry produce properly before storage'}</li>
          <li>{language === 'te' ? 'పురుగులు రాని విధంగా నిల్వ చేయండి' : 'Store in clean, pest-free containers'}</li>
        </ul>
      </div>
    </div>
  </div>
)}

{/* Govt Schemes Page */}
{activePage === 'schemes' && (
  <div className="schemes-page">
    <h2 className="page-title">
      {language === 'te' ? 'ఆంధ్రప్రదేశ్ రైతు పథకాలు (2026)' : 'Andhra Pradesh Farmer Schemes (2026)'}
    </h2>
    <p className="page-subtitle">
      {language === 'te'
        ? 'ప్రధాన ఆర్థిక సహాయం, బీమా, యంత్రాలు మరియు సాగు మద్దతు పథకాలు'
        : 'Major financial assistance, insurance, machinery and cultivation support schemes'}
    </p>

    <div className="schemes-grid detailed-grid">
      <div className="scheme-card">
        <h4>Annadata Sukhibhava + PM-KISAN</h4>
        <p>{language === 'te' ? 'ఏటా రైతులకు ఆర్థిక సహాయం' : 'Annual income support for farmers'}</p>
        <ul>
          <li>{language === 'te' ? 'విడతల వారీగా జమ' : 'Paid in installments'}</li>
          <li>{language === 'te' ? 'పంట సీజన్‌కు ఉపయోగకరం' : 'Useful before key crop seasons'}</li>
        </ul>
      </div>

      <div className="scheme-card">
        <h4>{language === 'te' ? 'వడ్డీ లేని రుణాలు' : 'Interest-Free Crop Loans'}</h4>
        <p>{language === 'te' ? 'చిన్న మరియు మధ్య తరగతి రైతులకు ఉపశమనం' : 'Relief for small and medium farmers'}</p>
        <ul>
          <li>{language === 'te' ? 'ఇన్‌పుట్ ఖర్చులకు ఉపయుక్తం' : 'Helps manage input costs'}</li>
          <li>{language === 'te' ? 'సకాలంలో చెల్లింపు ముఖ్యం' : 'Timely repayment matters'}</li>
        </ul>
      </div>

      <div className="scheme-card">
        <h4>{language === 'te' ? 'పంట బీమా' : 'Crop Insurance'}</h4>
        <p>{language === 'te' ? 'వర్షాభావం, వరదలు, నష్టాలపై భద్రత' : 'Protection against drought, floods and crop loss'}</p>
        <ul>
          <li>{language === 'te' ? 'నమోదు తప్పనిసరి' : 'Enrollment required'}</li>
          <li>{language === 'te' ? 'ప్రకృతి విపత్తుల సమయంలో ఉపయోగపడుతుంది' : 'Useful during natural calamities'}</li>
        </ul>
      </div>

      <div className="scheme-card">
        <h4>{language === 'te' ? 'వ్యవసాయ యంత్రీకరణ సబ్సిడీ' : 'Farm Mechanization Subsidy'}</h4>
        <p>{language === 'te' ? 'యంత్రాల కొనుగోలుపై సబ్సిడీ' : 'Subsidy on purchase of farm machinery'}</p>
        <ul>
          <li>{language === 'te' ? 'స్ప్రేయర్లు, రోటావేటర్లు, ఇతర పరికరాలు' : 'Sprayers, rotavators and other equipment'}</li>
          <li>{language === 'te' ? 'కొన్ని వర్గాలకు ఎక్కువ సబ్సిడీ' : 'Higher subsidy for eligible categories'}</li>
        </ul>
      </div>

      <div className="scheme-card">
        <h4>{language === 'te' ? 'మైక్రో ఇరిగేషన్ మద్దతు' : 'Micro Irrigation Support'}</h4>
        <p>{language === 'te' ? 'నీటి ఆదా మరియు దిగుబడి మెరుగుదల' : 'Supports water saving and better yield'}</p>
        <ul>
          <li>{language === 'te' ? 'డ్రిప్, స్ప్రింక్లర్ వ్యవస్థలకు మద్దతు' : 'Support for drip and sprinkler systems'}</li>
          <li>{language === 'te' ? 'నీటి కొరత ప్రాంతాలకు అనుకూలం' : 'Useful in water-stressed regions'}</li>
        </ul>
      </div>

      <div className="scheme-card">
        <h4>{language === 'te' ? 'విత్తన సబ్సిడీ' : 'Seed Subsidy'}</h4>
        <p>{language === 'te' ? 'నాణ్యమైన విత్తనాలను తక్కువ ధరలో పొందండి' : 'Access quality seeds at subsidized rates'}</p>
        <ul>
          <li>{language === 'te' ? 'ధృవీకృత విత్తనాలకు ప్రాధాన్యం' : 'Focus on certified seeds'}</li>
          <li>{language === 'te' ? 'సీజన్ ప్రారంభానికి ముందు తెలుసుకోవాలి' : 'Check availability before season starts'}</li>
        </ul>
      </div>

      <div className="scheme-card">
        <h4>{language === 'te' ? 'సహజ వ్యవసాయం మద్దతు' : 'Natural Farming Support'}</h4>
        <p>{language === 'te' ? 'రసాయన వినియోగాన్ని తగ్గించే చర్యలు' : 'Support for reducing chemical dependence'}</p>
        <ul>
          <li>{language === 'te' ? 'స్థిరమైన సాగుకు ఉపయోగకరం' : 'Useful for sustainable cultivation'}</li>
          <li>{language === 'te' ? 'శిక్షణ మరియు ఫీల్డ్ సపోర్ట్ లభించవచ్చు' : 'Training and field support may be available'}</li>
        </ul>
      </div>

      <div className="scheme-card">
        <h4>{language === 'te' ? 'ఉచిత విద్యుత్ & సాగు మద్దతు' : 'Free Power & Cultivation Support'}</h4>
        <p>{language === 'te' ? 'పంపుసెట్లు మరియు సాగు ఖర్చులకు ఉపశమనం' : 'Reduces irrigation and cultivation costs'}</p>
        <ul>
          <li>{language === 'te' ? 'పారుదల ఆధారిత సాగుకు ముఖ్యమైన మద్దతు' : 'Important for irrigated farming'}</li>
          <li>{language === 'te' ? 'ప్రాంతానుసారం స్థానిక వివరాలు చెక్ చేయండి' : 'Verify local eligibility details'}</li>
        </ul>
      </div>
    </div>
  </div>
)}

{/* Pesticides Page */}
{activePage === 'pesticides' && (
  <div className="pesticides-page">
    <h2 className="page-title">
      {language === 'te' ? 'పురుగు మందుల సూచనలు & జాగ్రత్తలు' : 'Pesticide Recommendations & Precautions'}
    </h2>
    <p className="page-subtitle">
      {language === 'te'
        ? 'సాధారణ పంటల కోసం సూచనలు • ధరలు ప్రాంతానుసారం మారవచ్చు'
        : 'Suggestions for common crops • Prices may vary by location'}
    </p>

    <div className="pesticides-grid detailed-grid">
      <div className="pesticide-card">
        <h4>{language === 'te' ? 'వరి - లీఫ్ బ్లాస్ట్' : 'Rice - Leaf Blast'}</h4>
        <p><strong>Tricyclazole 75% WP</strong> → ₹480-580 / 250g</p>
        <ul>
          <li>{language === 'te' ? 'ఆకు మీద మచ్చలు కనిపించినప్పుడు వాడుతారు' : 'Used when leaf blast symptoms appear'}</li>
          <li>{language === 'te' ? 'మోతాదును తప్పనిసరిగా ధృవీకరించండి' : 'Always verify dose before spraying'}</li>
        </ul>
      </div>

      <div className="pesticide-card">
        <h4>{language === 'te' ? 'వరి - స్టెమ్ బోరర్' : 'Rice - Stem Borer'}</h4>
        <p><strong>Chlorpyrifos 20% EC</strong> → ₹290-360 / litre</p>
        <ul>
          <li>{language === 'te' ? 'పిల్ల పురుగుల దశలో నియంత్రణ ముఖ్యం' : 'Early-stage control is more effective'}</li>
          <li>{language === 'te' ? 'రక్షణ పరికరాలు ధరించండి' : 'Use protective gear while spraying'}</li>
        </ul>
      </div>

      <div className="pesticide-card">
        <h4>{language === 'te' ? 'మిరప - ఫ్రూట్ బోరర్' : 'Chilli - Fruit Borer'}</h4>
        <p><strong>Emamectin Benzoate</strong> → ₹950-1200 / 100g</p>
        <ul>
          <li>{language === 'te' ? 'ఫలదశలో ఎక్కువగా కనిపిస్తుంది' : 'Common during fruiting stage'}</li>
          <li>{language === 'te' ? 'పంటపై అవశేషకాలం చెక్ చేయండి' : 'Check waiting period before harvest'}</li>
        </ul>
      </div>

      <div className="pesticide-card">
        <h4>{language === 'te' ? 'పత్తి - సక్కింగ్ పెస్ట్స్' : 'Cotton - Sucking Pests'}</h4>
        <p><strong>Imidacloprid / Thiamethoxam</strong> → {language === 'te' ? 'స్థానిక ధరల ప్రకారం' : 'As per local market price'}</p>
        <ul>
          <li>{language === 'te' ? 'ఆరంభ దశలో పర్యవేక్షణ అవసరం' : 'Regular scouting is essential in early stages'}</li>
          <li>{language === 'te' ? 'ఒకే మందును పదేపదే వాడకండి' : 'Avoid repeated use of the same molecule'}</li>
        </ul>
      </div>

      <div className="pesticide-card">
        <h4>{language === 'te' ? 'టమోటా - ఎర్లీ/లేట్ బ్లైట్' : 'Tomato - Early/Late Blight'}</h4>
        <p><strong>Mancozeb / Metalaxyl combinations</strong></p>
        <ul>
          <li>{language === 'te' ? 'తేమ ఎక్కువగా ఉన్నప్పుడు రిస్క్ పెరుగుతుంది' : 'Risk rises in wet and humid conditions'}</li>
          <li>{language === 'te' ? 'పంట మార్పిడి ఉపయోగకరం' : 'Crop rotation helps reduce recurrence'}</li>
        </ul>
      </div>

      <div className="pesticide-card">
        <h4>{language === 'te' ? 'సేంద్రియ ప్రత్యామ్నాయం' : 'Organic Option'}</h4>
        <p><strong>Neem Oil / Neem-based formulations</strong> → ₹200-280 / litre</p>
        <ul>
          <li>{language === 'te' ? 'సాధారణ కీటకాలపై ప్రారంభ దశలో ఉపయుక్తం' : 'Useful against mild infestations at early stage'}</li>
          <li>{language === 'te' ? 'IPM విధానాలతో కలిపి వాడితే మంచిది' : 'Works better with IPM practices'}</li>
        </ul>
      </div>

      <div className="pesticide-card full-width">
        <h4>{language === 'te' ? 'ముఖ్య జాగ్రత్తలు' : 'Important Safety Notes'}</h4>
        <ul>
          <li>{language === 'te' ? 'లేబుల్‌లో ఉన్న సూచనలు తప్పనిసరిగా చదవండి' : 'Read the product label carefully'}</li>
          <li>{language === 'te' ? 'స్థానిక వ్యవసాయ అధికారి సలహా తీసుకోండి' : 'Consult the local agriculture officer'}</li>
          <li>{language === 'te' ? 'రక్షణ గ్లౌవ్స్, మాస్క్ వాడండి' : 'Wear gloves, mask and protective clothing'}</li>
          <li>{language === 'te' ? 'ఖాళీ సీసాలను నీటిలో, పొలంలో పారేయకండి' : 'Do not dump empty containers in fields or water bodies'}</li>
        </ul>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default App;