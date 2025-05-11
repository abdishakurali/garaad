import React, { useState } from "react";

interface SignatureCalculatorProps {
    n?: number;
    g?: number;
    defaultSk?: number;
    defaultM?: number;
    config?: any; // Accepts the options.view JSON
}

const defaultStyles = {
    input: {
        width: "180px",
        border: "1px solid black",
        height: "25px",
        marginBottom: "10px",
        textAlign: "center" as const,
    },
    label: {
        display: "block",
        marginBottom: "5px",
        textAlign: "center" as const,
    },
    section: {
        border: "1px solid black",
        display: "flex",
        padding: "15px",
        flexGrow: 1,
        alignItems: "flex-start",
        flexDirection: "column" as const,
        margin: "10px",
        background: "#fff",
        borderRadius: "8px",
    },
    button: {
        width: "80px",
        border: "1px solid gray",
        height: "30px",
        borderRadius: "5px",
        backgroundColor: "#D3D3D3",
        marginTop: "5px",
    },
};

function extractCalculatorConfig(config: any) {
    let n = 29, g = 17, sk = 35, m = 7;
    if (config && Array.isArray(config.sections)) {
        for (const section of config.sections) {
            if (section.elements) {
                for (const el of section.elements) {
                    if (el.label === "n" && el.value) n = Number(el.value);
                    if (el.label === "g" && el.value) g = Number(el.value);
                    if (el.label === "furaha qarsoon (sk)" && el.value) sk = Number(el.value);
                    if (el.label === "farriin (m)" && el.value) m = Number(el.value);
                }
            }
        }
    }
    return { n, g, sk, m };
}

export const SignatureCalculator: React.FC<SignatureCalculatorProps> = ({
    n: propN,
    g: propG,
    defaultSk,
    defaultM,
    config,
}) => {
    // If config is provided, extract values from it
    const { n, g, sk, m } = config ? extractCalculatorConfig(config) : {
        n: propN ?? 29,
        g: propG ?? 17,
        sk: defaultSk ?? 35,
        m: defaultM ?? 7,
    };
    // Debug: log config and extracted values
    console.log('[DEBUG] SignatureCalculator config:', config);
    console.log('[DEBUG] SignatureCalculator extracted:', { n, g, sk, m });

    // State
    const [skState, setSk] = useState<number | ''>(sk);
    const [pk, setPk] = useState<number | ''>("");
    const [mState, setM] = useState<number | ''>(m);
    const [sig, setSig] = useState<number | ''>("");
    const [pkmResult, setPkmResult] = useState<string>("");
    const [siggResult, setSiggResult] = useState<string>("");

    // Calculate pk when sk changes
    React.useEffect(() => {
        if (skState !== "") {
            setPk(modPow(g, Number(skState), n));
        } else {
            setPk("");
        }
    }, [skState, g, n]);

    // Calculate sig when m or sk changes
    React.useEffect(() => {
        if (skState !== "" && mState !== "") {
            setSig((Number(skState) * Number(mState)) % n);
        } else {
            setSig("");
        }
    }, [skState, mState, n]);

    // Modular exponentiation
    function modPow(base: number, exponent: number, modulus: number) {
        let result = 1;
        base = base % modulus;
        while (exponent > 0) {
            if (exponent % 2 === 1) result = (result * base) % modulus;
            exponent = Math.floor(exponent / 2);
            base = (base * base) % modulus;
        }
        return result;
    }

    // Verification
    const checkPkm = () => {
        if (pk !== "" && mState !== "") {
            setPkmResult(((Number(pk) * Number(mState)) % n).toString());
        } else {
            setPkmResult("");
        }
    };
    const checkSigg = () => {
        if (sig !== "" && g !== undefined) {
            setSiggResult(((Number(sig) * g) % n).toString());
        } else {
            setSiggResult("");
        }
    };

    return (
        <div style={{ width: 450, border: "2px solid black", height: 580, display: "flex", flexDirection: "column", background: "#F0F0F0", padding: 15, boxSizing: "border-box" }}>
            {/* System Parameters */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 15 }}>
                <div style={{ marginRight: 30, textAlign: "center" }}>
                    <label style={defaultStyles.label}>n</label>
                    <input style={{ ...defaultStyles.input, width: 80 }} value={n} disabled />
                </div>
                <div style={{ textAlign: "center" }}>
                    <label style={defaultStyles.label}>g</label>
                    <input style={{ ...defaultStyles.input, width: 80 }} value={g} disabled />
                </div>
            </div>
            {/* User Identity & Sending a Message */}
            <div style={{ display: "flex", flexGrow: 1, marginBottom: 15 }}>
                {/* User Identity */}
                <div style={{ ...defaultStyles.section, marginRight: 10 }}>
                    <div style={{ fontWeight: 600, marginBottom: 10 }}>AQOONSIGA ISTICMAALAHA</div>
                    <label style={defaultStyles.label}>furaha qarsoon (sk)</label>
                    <input style={defaultStyles.input} type="number" value={skState} onChange={e => setSk(e.target.value === "" ? "" : Number(e.target.value))} />
                    <label style={defaultStyles.label}>furaha furan (pk)</label>
                    <input style={defaultStyles.input} type="number" value={pk} disabled />
                </div>
                {/* Sending a Message */}
                <div style={{ ...defaultStyles.section, marginLeft: 10 }}>
                    <div style={{ fontWeight: 600, marginBottom: 10 }}>DIRIDDA FARRIINTA</div>
                    <label style={defaultStyles.label}>farriin (m)</label>
                    <input style={defaultStyles.input} type="number" value={mState} onChange={e => setM(e.target.value === "" ? "" : Number(e.target.value))} />
                    <label style={defaultStyles.label}>saxiix (sig)</label>
                    <input style={defaultStyles.input} type="number" value={sig} disabled />
                </div>
            </div>
            {/* Verification */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: 15 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 10 }}>
                    <label style={defaultStyles.label}>(pk x m) mod n</label>
                    <input style={defaultStyles.input} type="text" value={pkmResult} readOnly />
                    <button style={defaultStyles.button} onClick={checkPkm}>HUBI</button>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "gray", margin: "0 10px" }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 10 }}>
                    <label style={defaultStyles.label}>(sig x g) mod n</label>
                    <input style={defaultStyles.input} type="text" value={siggResult} readOnly />
                    <button style={defaultStyles.button} onClick={checkSigg}>HUBI</button>
                </div>
            </div>
        </div>
    );
};

export default SignatureCalculator; 