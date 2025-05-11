import React, { useState } from "react";

interface CalculatorProblemBlockProps {
    question: string;
    which?: string;
    options?: any[];
    correct_answer?: any[];
    explanation?: string;
    diagram_config?: any;
    content?: any;
    type?: string;
    img?: string;
    alt?: string;
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

const CalculatorProblemBlock: React.FC<CalculatorProblemBlockProps> = ({
    question,
    content,
}) => {
    // Extract config from content if present
    let n = 29, g = 17;
    if (content && content.config && Array.isArray(content.config.sections)) {
        for (const section of content.config.sections) {
            if (section.elements) {
                for (const el of section.elements) {
                    if (el.label === "n" && el.value) n = Number(el.value);
                    if (el.label === "g" && el.value) g = Number(el.value);
                }
            }
        }
    }
    // State for calculator fields
    const [sk, setSk] = useState("");
    const [pk, setPk] = useState("");
    const [m, setM] = useState("");
    const [sig, setSig] = useState("");
    const [pkmResult, setPkmResult] = useState("");
    const [siggResult, setSiggResult] = useState("");

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

    // Calculate pk when sk changes
    React.useEffect(() => {
        if (sk !== "") {
            setPk(modPow(g, Number(sk), n).toString());
        } else {
            setPk("");
        }
    }, [sk, g, n]);

    // Calculate sig when m or sk changes
    React.useEffect(() => {
        if (sk !== "" && m !== "") {
            setSig((Number(sk) * Number(m) % n).toString());
        } else {
            setSig("");
        }
    }, [sk, m, n]);

    // Verification
    const checkPkm = () => {
        if (pk !== "" && m !== "") {
            setPkmResult(((Number(pk) * Number(m)) % n).toString());
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
            <div style={{ marginBottom: 10, fontWeight: 600, textAlign: "center" }}>{question}</div>
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
                    <input style={defaultStyles.input} type="number" value={sk} onChange={e => setSk(e.target.value)} />
                    <label style={defaultStyles.label}>furaha furan (pk)</label>
                    <input style={defaultStyles.input} type="number" value={pk} disabled />
                </div>
                {/* Sending a Message */}
                <div style={{ ...defaultStyles.section, marginLeft: 10 }}>
                    <div style={{ fontWeight: 600, marginBottom: 10 }}>DIRIDDA FARRIINTA</div>
                    <label style={defaultStyles.label}>farriin (m)</label>
                    <input style={defaultStyles.input} type="number" value={m} onChange={e => setM(e.target.value)} />
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

export default CalculatorProblemBlock; 