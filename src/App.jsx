import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import { Html5Qrcode } from "html5-qrcode";

const G = {
  dark: "#0a1a0d", mid: "#1a3320", card: "#112214", border: "#2a4a2e",
  green: "#2E7D32", bright: "#4CAF50", light: "#81C784", accent: "#A5D6A7",
  text: "#e8f5e9", muted: "#7cb87f", red: "#ef5350", orange: "#FFA726",
  gold: "#FFD54F", white: "#ffffff",
};

const fmt = v => `₱${Number(v).toFixed(2)}`;

const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    scan: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    box: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
    utang: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    minus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    camera: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    pay: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    barcode: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14M21 5v14"/><rect x="2" y="4" width="20" height="16" rx="1" strokeWidth="1.5" fill="none"/></svg>,
    history: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95L1 10"/><polyline points="12,7 12,12 15,15"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    cart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    cash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>,
    cloud: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  };
  return icons[name] || null;
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"rgba(0,0,0,0.8)" }}>
      <div style={{ background:G.card,border:`1px solid ${G.border}`,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto" }}>
        <div style={{ padding:"16px 20px 14px",borderBottom:`1px solid ${G.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ color:G.text,fontWeight:700,fontSize:17 }}>{title}</span>
          <button onClick={onClose} style={{ background:G.mid,border:"none",cursor:"pointer",color:G.muted,padding:6,borderRadius:8,display:"flex" }}>
            <Icon name="x" size={18} color={G.muted}/>
          </button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type="text", placeholder="", autoFocus=false }) => (
  <div style={{ marginBottom:14 }}>
    {label && <div style={{ color:G.muted,fontSize:11,marginBottom:6,fontWeight:700,letterSpacing:1,textTransform:"uppercase" }}>{label}</div>}
    <input autoFocus={autoFocus} type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%",background:G.mid,border:`1.5px solid ${G.border}`,borderRadius:10,padding:"11px 14px",color:G.text,fontSize:15,outline:"none",boxSizing:"border-box" }}/>
  </div>
);

const Btn = ({ children, onClick, color=G.green, full=false, small=false, disabled=false, style={} }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ background:disabled?"#1e3a22":color,color:disabled?G.muted:G.white,border:"none",borderRadius:small?8:12,
      padding:small?"8px 14px":"13px 20px",fontWeight:700,fontSize:small?13:15,cursor:disabled?"not-allowed":"pointer",
      width:full?"100%":"auto",display:"flex",alignItems:"center",gap:8,justifyContent:"center",...style }}>
    {children}
  </button>
);

// ─── REAL CAMERA SCANNER VIEW ────────────────────────────────────────────────
const ScannerView = ({ onScan, onClose }) => {
  const [manualCode, setManualCode] = useState("");
  const [status, setStatus] = useState("starting"); // starting | scanning | error
  const [errorMsg, setErrorMsg] = useState("");
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);
  const SCANNER_ID = "jens-qr-reader";

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;
    let isRunning = false;

    scanner.start(
      { facingMode: "environment" },           // rear/back camera
      {
        fps: 15,
        qrbox: { width: 260, height: 120 },   // wider box for barcodes
        formatsToSupport: [
          0,  // QR_CODE
          1,  // AZTEC
          4,  // CODE_39
          5,  // CODE_93
          6,  // CODE_128
          7,  // DATA_MATRIX
          8,  // MAXICODE
          9,  // ITF
          10, // EAN_13
          11, // EAN_8
          12, // PDF_417
          13, // RSS_14
          14, // RSS_EXPANDED
          15, // UPC_A
          16, // UPC_E
          17, // UPC_EAN_EXTENSION
        ],
      },
      (decodedText) => {
        if (scannedRef.current) return; // prevent duplicate scans
        scannedRef.current = true;
        // Vibrate on success (mobile)
        if (navigator.vibrate) navigator.vibrate(100);
        // Stop scanner then call onScan — use setTimeout to ensure
        // React state updates (onScan) are not blocked by stop()
        if (isRunning) {
          scanner.stop()
            .catch(() => {})
            .finally(() => {
              isRunning = false;
              setTimeout(() => onScan(decodedText), 0);
            });
        } else {
          setTimeout(() => onScan(decodedText), 0);
        }
      },
      () => {} // ignore per-frame errors silently
    )
      .then(() => { isRunning = true; setStatus("scanning"); })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(String(err));
      });

    return () => {
      if (isRunning) {
        scanner.stop().catch(() => {});
        isRunning = false;
      }
    };
  }, []);

  const handleManual = () => {
    const code = manualCode.trim();
    if (!code) return;
    if (navigator.vibrate) navigator.vibrate(100);
    onScan(code);
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:200,background:"#000",display:"flex",flexDirection:"column" }}>
      {/* ── Camera viewport ── */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>

        {/* Status messages */}
        {status === "starting" && (
          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",zIndex:10 }}>
            <div style={{ color:"rgba(255,255,255,0.7)",fontSize:14,marginBottom:8 }}>📷 Starting camera...</div>
            <div style={{ width:28,height:28,border:"2px solid rgba(255,255,255,0.2)",borderTop:`2px solid ${G.bright}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto" }}/>
          </div>
        )}

        {status === "error" && (
          <div style={{ textAlign:"center",padding:"0 30px" }}>
            <div style={{ fontSize:36,marginBottom:12 }}>📵</div>
            <div style={{ color:G.red,fontSize:15,fontWeight:700,marginBottom:6 }}>Camera unavailable</div>
            <div style={{ color:"rgba(255,255,255,0.4)",fontSize:11,marginBottom:4 }}>
              Make sure you allow camera permission
            </div>
            <div style={{ color:"rgba(255,255,255,0.25)",fontSize:10 }}>{errorMsg}</div>
          </div>
        )}

        {/* The actual camera feed renders here */}
        <div
          id={SCANNER_ID}
          style={{
            width:"100%",
            maxWidth:420,
            // hide html5-qrcode's default UI chrome
            "--qr-border-color": G.bright,
          }}
        />

        {/* Overlay: scan guide corners */}
        {status === "scanning" && (
          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:280,height:120,pointerEvents:"none" }}>
            {[
              { top:0,left:0,borderTop:`3px solid ${G.bright}`,borderLeft:`3px solid ${G.bright}` },
              { top:0,right:0,borderTop:`3px solid ${G.bright}`,borderRight:`3px solid ${G.bright}` },
              { bottom:0,left:0,borderBottom:`3px solid ${G.bright}`,borderLeft:`3px solid ${G.bright}` },
              { bottom:0,right:0,borderBottom:`3px solid ${G.bright}`,borderRight:`3px solid ${G.bright}` },
            ].map((s,i) => (
              <div key={i} style={{ position:"absolute",width:28,height:28,...s }}/>
            ))}
            {/* Animated scan line */}
            <div style={{ position:"absolute",left:8,right:8,height:2,background:`linear-gradient(90deg,transparent,${G.bright},transparent)`,animation:"scanline 1.2s ease-in-out infinite",top:"50%" }}/>
          </div>
        )}

        {status === "scanning" && (
          <p style={{ position:"absolute",bottom:24,color:"rgba(255,255,255,0.65)",fontSize:13,textAlign:"center",letterSpacing:0.3 }}>
            Point at barcode · Hold steady
          </p>
        )}
      </div>

      {/* ── Bottom controls ── */}
      <div style={{ padding:"16px 20px 28px",gap:10,display:"flex",flexDirection:"column",background:"rgba(0,0,0,0.6)" }}>
        <div style={{ color:"rgba(255,255,255,0.4)",fontSize:11,textAlign:"center",marginBottom:2,letterSpacing:0.5 }}>
          OR TYPE MANUALLY
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <input
            value={manualCode}
            onChange={e=>setManualCode(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleManual()}
            placeholder="Type barcode number..."
            inputMode="numeric"
            style={{ flex:1,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:10,padding:"11px 14px",color:"white",fontSize:14,outline:"none" }}
          />
          <Btn onClick={handleManual} color={G.green} small disabled={!manualCode.trim()}>Go</Btn>
        </div>
        <Btn onClick={onClose} color="transparent" full style={{ border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)" }}>
          Cancel
        </Btn>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scanline { 0%{top:8%} 50%{top:88%} 100%{top:8%} }
        /* Hide html5-qrcode default header & footer UI */
        #jens-qr-reader__header_message,
        #jens-qr-reader__status_span,
        #jens-qr-reader__camera_permission_button,
        #jens-qr-reader__dashboard { display: none !important; }
        #jens-qr-reader video { border-radius: 0 !important; }
        #jens-qr-reader { border: none !important; padding: 0 !important; }
      `}</style>
    </div>
  );
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("pos");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [debts, setDebts] = useState([]);
  const [sales, setSales] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);

  const [newProductModal, setNewProductModal] = useState(null);
  const [editProductModal, setEditProductModal] = useState(null);
  const [utangModal, setUtangModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [debtPayModal, setDebtPayModal] = useState(null);
  const [debtHistModal, setDebtHistModal] = useState(null);

  const [newProd, setNewProd] = useState({ name:"", price:"" });
  const [utangName, setUtangName] = useState("");
  const [cashInput, setCashInput] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [editForm, setEditForm] = useState({});
  const [editDebtModal, setEditDebtModal] = useState(null);
  const [editDebtName, setEditDebtName] = useState("");
  const [timbangModal, setTimbangModal] = useState(null); // product to timbang
  const [timbangQty, setTimbangQty] = useState("");

  // ─── SHOW TOAST ──────────────────────────────────────────────────────────
  const showToast = (msg, color = G.bright) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── LOAD ALL DATA FROM SUPABASE ─────────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, debtRes, salesRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at"),
        supabase.from("debts").select("*, debt_history(*)").order("created_at"),
        supabase.from("sales").select("*").order("date", { ascending: false }),
      ]);

      if (prodRes.data)  setProducts(prodRes.data);
      if (debtRes.data)  setDebts(debtRes.data.map(d => ({ ...d, history: d.debt_history || [] })));
      if (salesRes.data) setSales(salesRes.data);
    } catch (e) {
      showToast("⚠️ Dili ma-connect sa database", G.red);
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { if(editProductModal) setEditForm({name:editProductModal.name,price:String(editProductModal.price),is_timbang:!!editProductModal.is_timbang}); },[editProductModal]);

  const cartTotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const totalDebt = debts.reduce((s,d) => s + Number(d.balance), 0);
  const todaySales = sales.filter(s=>s.date?.startsWith(new Date().toISOString().slice(0,10))).reduce((s,r)=>s+Number(r.total),0);
  const cash = parseFloat(cashInput)||0;

  // ─── HANDLERS ────────────────────────────────────────────────────────────
  const addToCart = (product, customPrice = null, customLabel = null) => {
    // Timbang items always added as new line (different qty/price each time)
    if (customPrice !== null) {
      const timbangItem = {
        ...product,
        barcode: product.barcode + "_" + Date.now(), // unique key
        price: customPrice,
        qty: 1,
        label: customLabel || product.name,
      };
      setCart(prev => [...prev, timbangItem]);
      return;
    }
    setCart(prev => {
      const ex = prev.find(i => i.barcode === product.barcode);
      if (ex) return prev.map(i => i.barcode===product.barcode ? {...i,qty:i.qty+1} : i);
      return [...prev, { ...product, qty:1 }];
    });
  };

  const handleScan = (code) => {
    const found = products.find(p => p.barcode === code);
    if (found) {
      setScanning(false);
      if (found.is_timbang) {
        setTimbangModal(found);
        setTimbangQty("");
      } else {
        addToCart(found);
        showToast(`✅ ${found.name} added!`);
      }
    } else {
      setNewProductModal(code);
      setNewProd({ name:"", price:"", is_timbang: false });
      setScanning(false);
    }
  };

  const saveNewProduct = async () => {
    if (!newProd.name || !newProd.price) return;
    setSyncing(true);
    const { data, error } = await supabase
      .from("products")
      .insert({ barcode: newProductModal, name: newProd.name, price: parseFloat(newProd.price), is_timbang: !!newProd.is_timbang })
      .select()
      .single();

    if (data) {
      setProducts(prev => [...prev, data]);
      addToCart(data);
      showToast("✅ Product saved to cloud!");
    } else {
      showToast("❌ Error saving product", G.red);
      console.error(error);
    }
    setNewProductModal(null);
    setSyncing(false);
  };

  const updateQty = (barcode, delta) =>
    setCart(prev => prev.map(i => i.barcode===barcode ? {...i,qty:Math.max(0,i.qty+delta)} : i).filter(i=>i.qty>0));

  const processCash = async () => {
    setSyncing(true);
    const { data, error } = await supabase
      .from("sales")
      .insert({ items: cart, total: cartTotal, type: "cash", date: new Date().toISOString() })
      .select()
      .single();

    if (data) {
      setSales(prev => [data, ...prev]);
      showToast("✅ Sale recorded!");
    } else {
      showToast("❌ Error saving sale", G.red);
      console.error(error);
    }
    setCart([]); setPaymentModal(false); setCashInput("");
    setSyncing(false);
  };

  const processUtang = async () => {
    if (!utangName.trim()) return;
    setSyncing(true);

    const { data: saleData } = await supabase
      .from("sales")
      .insert({ items: cart, total: cartTotal, type: "utang", date: new Date().toISOString() })
      .select()
      .single();

    if (saleData) setSales(prev => [saleData, ...prev]);

    const ex = debts.find(d => d.name.toLowerCase() === utangName.toLowerCase());

    if (ex) {
      const newBalance = Number(ex.balance) + cartTotal;
      await supabase.from("debts").update({ balance: newBalance }).eq("id", ex.id);
      const histEntry = { debt_id: ex.id, items: cart, total: cartTotal, date: new Date().toISOString() };
      const { data: histData } = await supabase.from("debt_history").insert(histEntry).select().single();
      setDebts(prev => prev.map(d => d.id === ex.id ? {
        ...d, balance: newBalance,
        history: [histData || histEntry, ...d.history]
      } : d));
    } else {
      const { data: debtData } = await supabase
        .from("debts")
        .insert({ name: utangName, balance: cartTotal })
        .select()
        .single();

      if (debtData) {
        const histEntry = { debt_id: debtData.id, items: cart, total: cartTotal, date: new Date().toISOString() };
        const { data: histData } = await supabase.from("debt_history").insert(histEntry).select().single();
        setDebts(prev => [...prev, { ...debtData, history: [histData || histEntry] }]);
      }
    }

    showToast(`✅ Utang ni ${utangName} recorded!`, G.orange);
    setCart([]); setUtangModal(false); setUtangName("");
    setSyncing(false);
  };

  const payDebt = async () => {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) return;
    setSyncing(true);

    const newBalance = Math.max(0, Number(debtPayModal.balance) - amt);

    if (newBalance === 0) {
      await supabase.from("debts").delete().eq("id", debtPayModal.id);
      setDebts(prev => prev.filter(d => d.id !== debtPayModal.id));
      showToast(`✅ ${debtPayModal.name} fully paid!`);
    } else {
      await supabase.from("debts").update({ balance: newBalance }).eq("id", debtPayModal.id);
      setDebts(prev => prev.map(d => d.id === debtPayModal.id ? { ...d, balance: newBalance } : d));
      showToast(`✅ Payment recorded. Remaining: ${fmt(newBalance)}`, G.orange);
    }

    setDebtPayModal(null); setPayAmount("");
    setSyncing(false);
  };

  const saveDebtName = async () => {
    if (!editDebtName.trim()) return;
    setSyncing(true);
    await supabase.from("debts").update({ name: editDebtName.trim() }).eq("id", editDebtModal.id);
    setDebts(prev => prev.map(d => d.id === editDebtModal.id ? { ...d, name: editDebtName.trim() } : d));
    showToast("✅ Name updated!");
    setEditDebtModal(null); setEditDebtName("");
    setSyncing(false);
  };

  const saveEdit = async () => {
    if (!editForm.name || !editForm.price) return;
    setSyncing(true);
    await supabase.from("products")
      .update({ name: editForm.name, price: parseFloat(editForm.price) })
      .eq("id", editProductModal.id);

    setProducts(prev => prev.map(p => p.id === editProductModal.id
      ? { ...p, name: editForm.name, price: parseFloat(editForm.price) }
      : p
    ));
    showToast("✅ Product updated!");
    setEditProductModal(null);
    setSyncing(false);
  };

  const deleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts(prev => prev.filter(x => x.id !== id));
    showToast("🗑️ Product deleted", G.red);
  };

  // ─── STYLES ──────────────────────────────────────────────────────────────
  const sApp = { minHeight:"100vh",background:G.dark,color:G.text,fontFamily:"'DM Sans',system-ui,sans-serif",maxWidth:480,margin:"0 auto",position:"relative",paddingBottom:68 };
  const sHeader = { background:G.mid,padding:"14px 16px",borderBottom:`1px solid ${G.border}`,position:"sticky",top:0,zIndex:10 };
  const sNav = { position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:G.mid,borderTop:`1px solid ${G.border}`,display:"flex",zIndex:50 };
  const sNavBtn = (a) => ({ flex:1,padding:"10px 0 7px",background:"none",border:"none",cursor:"pointer",color:a?G.bright:G.muted,display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontSize:10,fontWeight:a?700:500 });
  const sCard = { background:G.card,border:`1px solid ${G.border}`,borderRadius:14,padding:16,marginBottom:10 };
  const sSection = { padding:"12px 14px 0" };

  // ─── LOADING SCREEN ───────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ ...sApp,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh" }}>
      <div style={{ fontSize:40,marginBottom:16 }}>🏪</div>
      <div style={{ color:G.bright,fontSize:18,fontWeight:700,marginBottom:8 }}>Jen's Mini Mart</div>
      <div style={{ display:"flex",alignItems:"center",gap:8,color:G.muted,fontSize:13 }}>
        <Icon name="cloud" size={16} color={G.muted}/>
        Connecting to cloud...
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ marginTop:20,width:24,height:24,border:`2px solid ${G.border}`,borderTop:`2px solid ${G.bright}`,borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>
    </div>
  );

  // ─── POS TAB ─────────────────────────────────────────────────────────────
  const POSTab = () => {
    const [search, setSearch] = useState("");
    const searchRef = useRef(null);
    const results = search.trim().length > 0
      ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      : [];

    return (
      <div style={{ display:"flex",flexDirection:"column",height:"calc(100vh - 68px)",overflow:"hidden" }}>
        <div style={{ ...sHeader,flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
            <div style={{ background:G.green,borderRadius:10,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <span style={{ fontSize:18 }}>🏪</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800,fontSize:18,color:G.text,letterSpacing:-0.5 }}>Jen's Mini Mart</div>
              <div style={{ color:G.muted,fontSize:11,display:"flex",alignItems:"center",gap:4 }}>
                <Icon name="cloud" size={10} color={G.bright}/>
                <span style={{ color:G.bright }}>Cloud Sync ON</span>
                {" · "}
                {new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"})}
              </div>
            </div>
            <button onClick={()=>setScanning(true)}
              style={{ background:G.green,border:"none",borderRadius:12,padding:"9px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:G.white,fontWeight:700,fontSize:13,flexShrink:0 }}>
              <Icon name="camera" size={17} color={G.white}/>
              Scan
            </button>
          </div>

          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}>
              <Icon name="search" size={16} color={G.muted}/>
            </div>
            <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search product by name..."
              style={{ width:"100%",background:G.dark,border:`1.5px solid ${search?G.bright:G.border}`,borderRadius:10,padding:"10px 12px 10px 36px",color:G.text,fontSize:14,outline:"none",boxSizing:"border-box",transition:"border-color 0.2s" }}/>
            {search && (
              <button onClick={()=>setSearch("")} style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:2 }}>
                <Icon name="x" size={15} color={G.muted}/>
              </button>
            )}
          </div>

          {results.length > 0 && (
            <div style={{ marginTop:8,background:G.dark,border:`1px solid ${G.bright}44`,borderRadius:10,overflow:"hidden",maxHeight:180,overflowY:"auto" }}>
              {results.map(p=>(
                <button key={p.id} onClick={()=>{ addToCart(p); setSearch(""); }}
                  style={{ width:"100%",background:"none",border:"none",borderBottom:`1px solid ${G.border}`,padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left" }}>
                  <div>
                    <div style={{ color:G.text,fontWeight:600,fontSize:14 }}>{p.label || p.name}</div>
                    <div style={{ color:G.muted,fontSize:11,fontFamily:"monospace",marginTop:1 }}>{p.barcode}</div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <span style={{ color:G.bright,fontWeight:700,fontSize:15 }}>{fmt(p.price)}</span>
                    <div style={{ background:G.green,borderRadius:6,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <Icon name="plus" size={14} color={G.white}/>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {search.trim().length > 1 && results.length === 0 && (
            <div style={{ marginTop:8,background:G.dark,border:`1px solid ${G.border}`,borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ color:G.muted,fontSize:13 }}>"{search}" not found</span>
              <Btn onClick={()=>{ setNewProductModal("MANUAL-"+Date.now()); setNewProd({name:search,price:""}); setSearch(""); }} color={G.green} small>
                <Icon name="plus" size={13} color={G.white}/> Add
              </Btn>
            </div>
          )}
        </div>

        <div style={{ flex:1,overflowY:"auto",padding:"10px 14px 0" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign:"center",padding:"40px 20px",color:G.muted }}>
              <div style={{ marginBottom:12,opacity:0.4 }}><Icon name="cart" size={56} color={G.muted}/></div>
              <div style={{ fontSize:15,fontWeight:700,color:G.muted }}>Cart is empty</div>
              <div style={{ fontSize:13,marginTop:4,color:`${G.muted}77` }}>Scan a barcode or search by name above</div>
            </div>
          ) : (
            <>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                <span style={{ color:G.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1 }}>
                  {cart.length} item{cart.length!==1?"s":""} · {cart.reduce((s,i)=>s+i.qty,0)} pcs
                </span>
                <button onClick={()=>setCart([])} style={{ background:"none",border:"none",cursor:"pointer",color:G.red,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4 }}>
                  <Icon name="trash" size={12} color={G.red}/> Clear all
                </button>
              </div>
              {cart.map(item=>(
                <div key={item.barcode} style={{ ...sCard,padding:"12px 14px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ color:G.text,fontWeight:700,fontSize:15 }}>{item.name}</div>
                      <div style={{ color:G.muted,fontSize:11,fontFamily:"monospace",marginTop:1 }}>{item.barcode}</div>
                    </div>
                    <div style={{ color:G.bright,fontWeight:800,fontSize:16,minWidth:80,textAlign:"right" }}>
                      {fmt(item.price * item.qty)}
                    </div>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <span style={{ color:G.muted,fontSize:12 }}>{fmt(item.price)} each</span>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <button onClick={()=>updateQty(item.barcode,-1)}
                        style={{ background:G.mid,border:`1px solid ${G.border}`,borderRadius:7,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <Icon name="minus" size={13} color={G.text}/>
                      </button>
                      <span style={{ color:G.text,fontWeight:800,fontSize:16,minWidth:22,textAlign:"center" }}>{item.qty}</span>
                      <button onClick={()=>updateQty(item.barcode,1)}
                        style={{ background:G.green,border:"none",borderRadius:7,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <Icon name="plus" size={13} color={G.white}/>
                      </button>
                      <button onClick={()=>setCart(prev=>prev.filter(i=>i.barcode!==item.barcode))}
                        style={{ background:"rgba(239,83,80,0.12)",border:"none",borderRadius:7,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:4 }}>
                        <Icon name="trash" size={13} color={G.red}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ flexShrink:0,borderTop:`2px solid ${G.border}`,background:G.mid,padding:14 }}>
          {cart.length > 0 && (
            <div style={{ marginBottom:10,display:"flex",gap:6,flexWrap:"wrap" }}>
              {cart.map(i=>(
                <span key={i.barcode} style={{ background:G.card,color:G.muted,fontSize:11,padding:"2px 8px",borderRadius:20,border:`1px solid ${G.border}` }}>
                  {i.name} ×{i.qty}
                </span>
              ))}
            </div>
          )}
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <div>
              <div style={{ color:G.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1 }}>Total</div>
              <div style={{ color:G.bright,fontSize:36,fontWeight:900,letterSpacing:-2,lineHeight:1 }}>{fmt(cartTotal)}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:G.muted,fontSize:11 }}>Items</div>
              <div style={{ color:G.text,fontSize:22,fontWeight:800 }}>{cart.reduce((s,i)=>s+i.qty,0)}</div>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            <Btn onClick={()=>{ if(cart.length) setPaymentModal(true); }} color={G.green}
              disabled={cart.length===0||syncing} style={{ borderRadius:10,fontSize:14 }}>
              <Icon name="cash" size={16} color={G.white}/> Cash
            </Btn>
            <Btn onClick={()=>{ if(cart.length) setUtangModal(true); }} color={G.orange}
              disabled={cart.length===0||syncing} style={{ borderRadius:10,fontSize:14 }}>
              <Icon name="utang" size={16} color={G.white}/> Utang
            </Btn>
          </div>
        </div>
      </div>
    );
  };

  // ─── HOME TAB ─────────────────────────────────────────────────────────────
  const HomeTab = () => (
    <div>
      <div style={sHeader}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
          <div style={{ background:G.green,borderRadius:10,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{ fontSize:20 }}>🏪</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800,fontSize:19,color:G.text }}>Jen's Mini Mart</div>
            <div style={{ color:G.muted,fontSize:12 }}>{new Date().toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric"})}</div>
          </div>
          <button onClick={loadData} style={{ background:G.card,border:`1px solid ${G.border}`,borderRadius:8,padding:"7px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:G.muted,fontSize:12 }}>
            <Icon name="refresh" size={13} color={G.muted}/> Sync
          </button>
        </div>
        <div style={{ background:`${G.bright}15`,border:`1px solid ${G.bright}30`,borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8 }}>
          <Icon name="cloud" size={14} color={G.bright}/>
          <span style={{ color:G.bright,fontSize:12,fontWeight:600 }}>Cloud Sync Active — Data shared across all devices</span>
        </div>
      </div>
      <div style={sSection}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12 }}>
          {[
            { label:"Today's Sales",val:fmt(todaySales),icon:"chart",color:G.bright },
            { label:"Total Utang",val:fmt(totalDebt),icon:"utang",color:G.orange },
            { label:"Customers w/ Utang",val:debts.length,icon:"user",color:G.accent },
            { label:"Products",val:products.length,icon:"box",color:G.light },
          ].map((stat,i)=>(
            <div key={i} style={{ ...sCard,marginBottom:0,display:"flex",flexDirection:"column",gap:4 }}>
              <div style={{ background:`${stat.color}22`,borderRadius:8,padding:7,display:"flex",width:"fit-content" }}>
                <Icon name={stat.icon} size={16} color={stat.color}/>
              </div>
              <div style={{ color:stat.color,fontSize:22,fontWeight:800,letterSpacing:-1,marginTop:4 }}>{stat.val}</div>
              <div style={{ color:G.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5 }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{ ...sCard,marginBottom:12 }}>
          <div style={{ color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:12 }}>Quick Actions</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
            <Btn onClick={()=>setTab("pos")} color={G.green} style={{ borderRadius:10,fontSize:14 }}>
              <Icon name="cart" size={16} color={G.white}/> Open POS
            </Btn>
            <Btn onClick={()=>setTab("utang")} color={G.mid} style={{ border:`1px solid ${G.border}`,borderRadius:10,fontSize:14 }}>
              <Icon name="utang" size={16} color={G.orange}/> Utang
            </Btn>
            <Btn onClick={()=>setTab("products")} color={G.mid} style={{ border:`1px solid ${G.border}`,borderRadius:10,fontSize:14 }}>
              <Icon name="box" size={16} color={G.accent}/> Products
            </Btn>
            <Btn onClick={()=>setTab("sales")} color={G.mid} style={{ border:`1px solid ${G.border}`,borderRadius:10,fontSize:14 }}>
              <Icon name="chart" size={16} color={G.light}/> Sales
            </Btn>
          </div>
        </div>
        {sales.length > 0 && (
          <div style={sCard}>
            <div style={{ color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10 }}>Recent Transactions</div>
            {sales.slice(0,5).map(sale=>(
              <div key={sale.id} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${G.border}` }}>
                <div>
                  <div style={{ color:G.text,fontSize:13,fontWeight:600 }}>
                    {sale.items.map(i=>i.name).join(", ").slice(0,28)}{sale.items.map(i=>i.name).join("").length>28?"...":""}
                  </div>
                  <div style={{ color:G.muted,fontSize:11,marginTop:2 }}>{new Date(sale.date).toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"})}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:sale.type==="utang"?G.orange:G.bright,fontWeight:700,fontSize:14 }}>{fmt(sale.total)}</div>
                  <div style={{ color:G.muted,fontSize:10,textTransform:"uppercase" }}>{sale.type}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ─── PRODUCTS TAB ─────────────────────────────────────────────────────────
  const ProductsTab = () => {
    const [search, setSearch] = useState("");
    const filtered = products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
    return (
      <div>
        <div style={sHeader}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <div style={{ fontWeight:700,fontSize:18,color:G.text }}>Products <span style={{ color:G.muted,fontSize:14,fontWeight:500 }}>({products.length})</span></div>
            <Btn onClick={()=>{setNewProductModal("MANUAL-"+Date.now());setNewProd({name:"",price:""}); }} color={G.green} small>
              <Icon name="plus" size={14} color={G.white}/> Add
            </Btn>
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
            style={{ width:"100%",background:G.dark,border:`1.5px solid ${G.border}`,borderRadius:10,padding:"9px 14px",color:G.text,fontSize:14,outline:"none",boxSizing:"border-box" }}/>
        </div>
        <div style={sSection}>
          {filtered.length===0 ? (
            <div style={{ textAlign:"center",padding:"50px 20px",color:G.muted }}>
              <Icon name="box" size={48} color={G.border}/>
              <div style={{ marginTop:12,fontSize:15,fontWeight:600 }}>No products yet</div>
              <div style={{ fontSize:13,marginTop:4,color:`${G.muted}77` }}>Scan a barcode or add manually</div>
            </div>
          ) : filtered.map(p=>(
            <div key={p.id} style={{ ...sCard,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <div style={{ color:G.text,fontWeight:700,fontSize:15 }}>{p.name}</div>
                  {p.is_timbang && <span style={{ fontSize:12,background:`${G.orange}22`,color:G.orange,borderRadius:6,padding:"1px 6px",fontWeight:700 }}>⚖️ /kilo</span>}
                </div>
                <div style={{ color:G.muted,fontSize:11,fontFamily:"monospace",marginTop:2 }}>{p.barcode}</div>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <div style={{ color:G.bright,fontWeight:700,fontSize:16,minWidth:70,textAlign:"right" }}>{fmt(p.price)}{p.is_timbang && <span style={{ color:G.orange,fontSize:11,fontWeight:600 }}>/kg</span>}</div>
                <button onClick={()=>setEditProductModal(p)} style={{ background:G.mid,border:`1px solid ${G.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",display:"flex" }}>
                  <Icon name="edit" size={14} color={G.muted}/>
                </button>
                <button onClick={()=>deleteProduct(p.id)} style={{ background:"rgba(239,83,80,0.1)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",display:"flex" }}>
                  <Icon name="trash" size={14} color={G.red}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── UTANG TAB ────────────────────────────────────────────────────────────
  const UtangTab = () => {
    const [search, setSearch] = useState("");
    const filtered = debts.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
    return (
      <div>
        <div style={sHeader}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
            <div style={{ fontWeight:700,fontSize:18,color:G.text }}>Utang List</div>
            <div style={{ color:G.muted,fontSize:13 }}>Total: <span style={{ color:G.orange,fontWeight:700 }}>{fmt(totalDebt)}</span></div>
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name..."
            style={{ width:"100%",background:G.dark,border:`1.5px solid ${G.border}`,borderRadius:10,padding:"9px 14px",color:G.text,fontSize:14,outline:"none",boxSizing:"border-box" }}/>
        </div>
        <div style={sSection}>
          {debts.length===0 ? (
            <div style={{ textAlign:"center",padding:"50px 20px",color:G.muted }}>
              <Icon name="utang" size={48} color={G.border}/>
              <div style={{ marginTop:12,fontSize:15,fontWeight:600 }}>No utang records</div>
            </div>
          ) : filtered.length===0 ? (
            <div style={{ textAlign:"center",padding:"40px 20px",color:G.muted,fontSize:14 }}>No match for "{search}"</div>
          ) : filtered.map(d=>(
            <div key={d.id} style={sCard}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0 }}>
                  <div style={{ background:`${G.orange}22`,borderRadius:20,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <Icon name="user" size={18} color={G.orange}/>
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <div style={{ color:G.text,fontWeight:700,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.name}</div>
                      <button onClick={()=>{setEditDebtModal(d);setEditDebtName(d.name);}}
                        style={{ background:G.mid,border:`1px solid ${G.border}`,borderRadius:6,padding:"3px 6px",cursor:"pointer",display:"flex",flexShrink:0 }}>
                        <Icon name="edit" size={12} color={G.muted}/>
                      </button>
                    </div>
                    <div style={{ color:G.muted,fontSize:11 }}>{(d.history||[]).length} purchase{(d.history||[]).length!==1?"s":""}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right",flexShrink:0,marginLeft:8 }}>
                  <div style={{ color:G.orange,fontWeight:800,fontSize:18 }}>{fmt(d.balance)}</div>
                  <div style={{ color:G.muted,fontSize:10,textTransform:"uppercase" }}>UNPAID</div>
                </div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                <Btn onClick={()=>{setDebtPayModal(d);setPayAmount("");}} color={G.green} small>
                  <Icon name="pay" size={13} color={G.white}/> Pay
                </Btn>
                <Btn onClick={()=>setDebtHistModal(d)} color={G.mid} small style={{ border:`1px solid ${G.border}` }}>
                  <Icon name="history" size={13} color={G.muted}/> History
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── SALES TAB ────────────────────────────────────────────────────────────
  const SalesTab = () => {
    const totalCash = sales.filter(s=>s.type==="cash").reduce((s,r)=>s+Number(r.total),0);
    const totalUtang = sales.filter(s=>s.type==="utang").reduce((s,r)=>s+Number(r.total),0);
    return (
      <div>
        <div style={sHeader}>
          <div style={{ fontWeight:700,fontSize:18,color:G.text }}>Sales History</div>
        </div>
        <div style={sSection}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12 }}>
            {[
              { label:"All Sales",val:fmt(sales.reduce((s,r)=>s+Number(r.total),0)),color:G.bright },
              { label:"Cash",val:fmt(totalCash),color:G.light },
              { label:"Utang",val:fmt(totalUtang),color:G.orange },
            ].map((s,i)=>(
              <div key={i} style={{ background:G.card,border:`1px solid ${G.border}`,borderRadius:12,padding:12 }}>
                <div style={{ color:s.color,fontWeight:800,fontSize:15,letterSpacing:-0.5 }}>{s.val}</div>
                <div style={{ color:G.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {sales.length===0 ? (
            <div style={{ textAlign:"center",padding:"50px 20px",color:G.muted }}>
              <Icon name="chart" size={48} color={G.border}/>
              <div style={{ marginTop:12,fontSize:15,fontWeight:600 }}>No sales yet</div>
            </div>
          ) : sales.map(sale=>(
            <div key={sale.id} style={sCard}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
                <div>
                  <div style={{ color:G.text,fontWeight:700,fontSize:13 }}>{sale.items.map(i=>`${i.name} ×${i.qty}`).join(", ").slice(0,40)}{sale.items.length>2?"...":""}</div>
                  <div style={{ color:G.muted,fontSize:11,marginTop:2 }}>{new Date(sale.date).toLocaleString("en-PH",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:sale.type==="utang"?G.orange:G.bright,fontWeight:800,fontSize:15 }}>{fmt(sale.total)}</div>
                  <div style={{ background:sale.type==="utang"?`${G.orange}22`:`${G.bright}22`,color:sale.type==="utang"?G.orange:G.bright,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,marginTop:2,textTransform:"uppercase" }}>{sale.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={sApp}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#0a1a0d}input::placeholder{color:#4a7a4e}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#2a4a2e;border-radius:2px}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {toast && (
        <div style={{ position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,background:G.card,border:`1px solid ${toast.color}44`,borderRadius:12,padding:"10px 18px",color:toast.color,fontWeight:700,fontSize:13,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.5)" }}>
          {toast.msg}
        </div>
      )}

      {syncing && (
        <div style={{ position:"fixed",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${G.bright},${G.accent},${G.bright})`,backgroundSize:"200% 100%",animation:"shimmer 1s linear infinite",zIndex:999 }}/>
      )}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {scanning && <ScannerView onScan={handleScan} onClose={()=>setScanning(false)}/>}

      {tab==="pos"      && <POSTab/>}
      {tab==="home"     && <HomeTab/>}
      {tab==="products" && <ProductsTab/>}
      {tab==="utang"    && <UtangTab/>}
      {tab==="sales"    && <SalesTab/>}

      <nav style={sNav}>
        {[
          {id:"pos",icon:"cart",label:"POS"},
          {id:"home",icon:"home",label:"Home"},
          {id:"products",icon:"box",label:"Products"},
          {id:"utang",icon:"utang",label:"Utang"},
          {id:"sales",icon:"chart",label:"Sales"},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={sNavBtn(tab===t.id)}>
            <Icon name={t.icon} size={22} color={tab===t.id?G.bright:G.muted}/>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* TIMBANG MODAL */}
      {timbangModal && (() => {
        const FRACTIONS = [
          { label:"¼", val:0.25 }, { label:"½", val:0.5 }, { label:"¾", val:0.75 },
          { label:"1", val:1 }, { label:"1¼", val:1.25 }, { label:"1½", val:1.5 },
          { label:"1¾", val:1.75 }, { label:"2", val:2 }, { label:"2½", val:2.5 },
          { label:"3", val:3 },
        ];
        const qty = parseFloat(timbangQty) || 0;
        const computed = qty * timbangModal.price;
        return (
          <Modal open={!!timbangModal} onClose={()=>setTimbangModal(null)} title={timbangModal.name}>
            <div style={{ background:`${G.green}11`,border:`1px solid ${G.green}33`,borderRadius:10,padding:"10px 14px",marginBottom:14,textAlign:"center" }}>
              <div style={{ color:G.muted,fontSize:12,marginBottom:2 }}>Price per kilo/unit</div>
              <div style={{ color:G.bright,fontSize:22,fontWeight:800 }}>{fmt(timbangModal.price)}</div>
            </div>
            {/* Fraction quick buttons */}
            <div style={{ marginBottom:12 }}>
              <div style={{ color:G.muted,fontSize:12,marginBottom:8 }}>Quick select (kilo):</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                {FRACTIONS.map(f=>(
                  <button key={f.label} onClick={()=>setTimbangQty(String(f.val))}
                    style={{ background: parseFloat(timbangQty)===f.val ? G.green : G.mid,
                      border:`1.5px solid ${parseFloat(timbangQty)===f.val ? G.bright : G.border}`,
                      borderRadius:10,padding:"8px 14px",color: parseFloat(timbangQty)===f.val ? G.white : G.text,
                      fontWeight:700,fontSize:15,cursor:"pointer",minWidth:52,textAlign:"center" }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Manual input */}
            <Input label="Or type quantity (kilo/pcs)" value={timbangQty} onChange={setTimbangQty} type="number" placeholder="e.g. 2.25"/>
            {/* Computed price */}
            {qty > 0 && (
              <div style={{ background:`${G.bright}11`,border:`1px solid ${G.bright}33`,borderRadius:12,padding:"12px 16px",textAlign:"center",marginBottom:14 }}>
                <div style={{ color:G.muted,fontSize:12 }}>{qty} × {fmt(timbangModal.price)}</div>
                <div style={{ color:G.bright,fontSize:30,fontWeight:900 }}>{fmt(computed)}</div>
              </div>
            )}
            <Btn onClick={()=>{
              if (!qty) return;
              const label = `${timbangModal.name} (${timbangQty}kg)`;
              addToCart(timbangModal, computed, label);
              showToast(`✅ ${label} added!`);
              setTimbangModal(null); setTimbangQty("");
            }} color={G.green} full disabled={!qty}>
              <Icon name="check" size={16} color={G.white}/> Add to Cart — {qty > 0 ? fmt(computed) : "₱0.00"}
            </Btn>
          </Modal>
        );
      })()}

      {/* NEW PRODUCT MODAL */}
      <Modal open={!!newProductModal} onClose={()=>setNewProductModal(null)} title="New Product">
        <div style={{ background:`${G.green}11`,border:`1px solid ${G.green}33`,borderRadius:10,padding:"9px 13px",marginBottom:14,fontFamily:"monospace",fontSize:12,color:G.muted }}>
          {newProductModal}
        </div>
        <Input label="Product Name" value={newProd.name} onChange={v=>setNewProd(p=>({...p,name:v}))} placeholder="e.g. Sardines 555" autoFocus/>
        <Input label={newProd.is_timbang ? "Price per kilo (₱)" : "Price (₱)"} value={newProd.price} onChange={v=>setNewProd(p=>({...p,price:v}))} type="number" placeholder="0.00"/>
        {/* Timbang toggle */}
        <button onClick={()=>setNewProd(p=>({...p,is_timbang:!p.is_timbang}))}
          style={{ width:"100%",background:newProd.is_timbang?`${G.orange}22`:G.mid,border:`1.5px solid ${newProd.is_timbang?G.orange:G.border}`,borderRadius:10,padding:"11px 14px",color:newProd.is_timbang?G.orange:G.muted,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:14,textAlign:"left",display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:18 }}>{newProd.is_timbang?"⚖️":"📦"}</span>
          {newProd.is_timbang ? "Timbang Product (by kilo)" : "Regular Product (fixed price)"}
        </button>
        <Btn onClick={saveNewProduct} color={G.green} full disabled={!newProd.name||!newProd.price||syncing}>
          <Icon name="check" size={16} color={G.white}/> {syncing?"Saving...":"Save & Add to Cart"}
        </Btn>
      </Modal>

      {/* EDIT PRODUCT */}
      <Modal open={!!editProductModal} onClose={()=>setEditProductModal(null)} title="Edit Product">
        <Input label="Name" value={editForm.name||""} onChange={v=>setEditForm(f=>({...f,name:v}))} autoFocus/>
        <Input label={editForm.is_timbang ? "Price per kilo (₱)" : "Price (₱)"} value={editForm.price||""} onChange={v=>setEditForm(f=>({...f,price:v}))} type="number"/>
        <button onClick={()=>setEditForm(f=>({...f,is_timbang:!f.is_timbang}))}
          style={{ width:"100%",background:editForm.is_timbang?`${G.orange}22`:G.mid,border:`1.5px solid ${editForm.is_timbang?G.orange:G.border}`,borderRadius:10,padding:"11px 14px",color:editForm.is_timbang?G.orange:G.muted,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:14,textAlign:"left",display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:18 }}>{editForm.is_timbang?"⚖️":"📦"}</span>
          {editForm.is_timbang ? "Timbang Product (by kilo)" : "Regular Product (fixed price)"}
        </button>
        <Btn onClick={saveEdit} color={G.green} full disabled={syncing}>
          <Icon name="check" size={16} color={G.white}/> {syncing?"Saving...":"Save"}
        </Btn>
      </Modal>

      {/* CASH PAYMENT */}
      <Modal open={paymentModal} onClose={()=>setPaymentModal(false)} title="Cash Payment">
        <div style={{ textAlign:"center",marginBottom:16 }}>
          <div style={{ color:G.muted,fontSize:12,marginBottom:4 }}>Total</div>
          <div style={{ color:G.bright,fontSize:40,fontWeight:900,letterSpacing:-2 }}>{fmt(cartTotal)}</div>
        </div>
        <Input label="Cash Received (₱)" value={cashInput} onChange={setCashInput} type="number" placeholder="0.00" autoFocus/>
        {cash>0 && cash>=cartTotal && (
          <div style={{ background:`${G.bright}11`,border:`1px solid ${G.bright}33`,borderRadius:12,padding:"12px 16px",textAlign:"center",marginBottom:14 }}>
            <div style={{ color:G.muted,fontSize:12 }}>Change</div>
            <div style={{ color:G.bright,fontSize:30,fontWeight:900 }}>{fmt(cash-cartTotal)}</div>
          </div>
        )}
        <Btn onClick={processCash} color={G.green} full disabled={cash<cartTotal||syncing}>
          <Icon name="check" size={16} color={G.white}/> {syncing?"Saving...":"Confirm Payment"}
        </Btn>
      </Modal>

      {/* UTANG MODAL */}
      <Modal open={utangModal} onClose={()=>setUtangModal(false)} title="Record as Utang">
        <div style={{ textAlign:"center",marginBottom:14 }}>
          <div style={{ color:G.orange,fontSize:34,fontWeight:900,letterSpacing:-1 }}>{fmt(cartTotal)}</div>
        </div>
        <Input label="Customer Name" value={utangName} onChange={setUtangName} placeholder="Enter name..." autoFocus/>
        {/* Suggestions — show matching existing debtors */}
        {utangName.trim().length>0 && (() => {
          const matches = debts.filter(d=>d.name.toLowerCase().includes(utangName.toLowerCase()));
          const exactMatch = debts.find(d=>d.name.toLowerCase()===utangName.toLowerCase());
          return matches.length>0 && !exactMatch ? (
            <div style={{ background:G.mid,border:`1px solid ${G.border}`,borderRadius:10,marginBottom:12,overflow:"hidden" }}>
              {matches.map(d=>(
                <button key={d.id} onClick={()=>setUtangName(d.name)}
                  style={{ width:"100%",background:"none",border:"none",borderBottom:`1px solid ${G.border}`,padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left" }}>
                  <div>
                    <div style={{ color:G.text,fontWeight:700,fontSize:14 }}>{d.name}</div>
                    <div style={{ color:G.muted,fontSize:11 }}>{(d.history||[]).length} purchase{(d.history||[]).length!==1?"s":""}</div>
                  </div>
                  <div style={{ color:G.orange,fontWeight:700,fontSize:14 }}>{fmt(d.balance)}</div>
                </button>
              ))}
            </div>
          ) : null;
        })()}
        {utangName && debts.find(d=>d.name.toLowerCase()===utangName.toLowerCase()) && (
          <div style={{ background:`${G.orange}11`,border:`1px solid ${G.orange}33`,borderRadius:10,padding:"9px 13px",marginBottom:12,fontSize:13,color:G.orange }}>
            Existing — balance: {fmt(debts.find(d=>d.name.toLowerCase()===utangName.toLowerCase())?.balance)}
          </div>
        )}
        <Btn onClick={processUtang} color={G.orange} full disabled={!utangName.trim()||syncing}>
          <Icon name="utang" size={16} color={G.white}/> {syncing?"Saving...":"Confirm Utang"}
        </Btn>
      </Modal>

      {/* PAY DEBT */}
      <Modal open={!!debtPayModal} onClose={()=>setDebtPayModal(null)} title={`Pay — ${debtPayModal?.name}`}>
        <div style={{ textAlign:"center",marginBottom:14 }}>
          <div style={{ color:G.muted,fontSize:12 }}>Balance</div>
          <div style={{ color:G.orange,fontSize:34,fontWeight:900,letterSpacing:-1 }}>{fmt(debtPayModal?.balance||0)}</div>
        </div>
        <Input label="Amount to Pay (₱)" value={payAmount} onChange={setPayAmount} type="number" placeholder="0.00" autoFocus/>
        {parseFloat(payAmount)>0 && (
          <div style={{ background:`${G.bright}11`,border:`1px solid ${G.bright}33`,borderRadius:12,padding:"12px 16px",textAlign:"center",marginBottom:12 }}>
            <div style={{ color:G.muted,fontSize:12 }}>Remaining</div>
            <div style={{ color:parseFloat(payAmount)>=(debtPayModal?.balance||0)?G.bright:G.orange,fontSize:26,fontWeight:900 }}>
              {fmt(Math.max(0,(debtPayModal?.balance||0)-parseFloat(payAmount)))}
            </div>
          </div>
        )}
        <Btn onClick={payDebt} color={G.green} full disabled={!parseFloat(payAmount)||syncing}>
          <Icon name="check" size={16} color={G.white}/> {syncing?"Saving...":"Confirm Payment"}
        </Btn>
      </Modal>

      {/* EDIT DEBT NAME */}
      <Modal open={!!editDebtModal} onClose={()=>setEditDebtModal(null)} title="Edit Name">
        <Input label="Customer Name" value={editDebtName} onChange={setEditDebtName} autoFocus/>
        <Btn onClick={saveDebtName} color={G.orange} full disabled={!editDebtName.trim()||syncing}>
          <Icon name="check" size={16} color={G.white}/> {syncing?"Saving...":"Save Name"}
        </Btn>
      </Modal>

      {/* DEBT HISTORY */}
      <Modal open={!!debtHistModal} onClose={()=>setDebtHistModal(null)} title={`History — ${debtHistModal?.name}`}>
        <div style={{ marginBottom:12 }}>
          <div style={{ color:G.muted,fontSize:11,marginBottom:4 }}>TOTAL BALANCE</div>
          <div style={{ color:G.orange,fontSize:28,fontWeight:900 }}>{fmt(debtHistModal?.balance||0)}</div>
        </div>
        {(debtHistModal?.history||[]).map((h,i)=>(
          <div key={i} style={{ borderBottom:`1px solid ${G.border}`,padding:"10px 0" }}>
            <div style={{ display:"flex",justifyContent:"space-between" }}>
              <div style={{ color:G.text,fontSize:13 }}>{h.items?.map(x=>`${x.name} ×${x.qty}`).join(", ").slice(0,36)}</div>
              <div style={{ color:G.orange,fontWeight:700 }}>{fmt(h.total)}</div>
            </div>
            <div style={{ color:G.muted,fontSize:11,marginTop:3 }}>{new Date(h.date).toLocaleString("en-PH",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
          </div>
        ))}
      </Modal>
    </div>
  );
}
