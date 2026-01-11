import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputFieldWithLabelProps {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  inputStyles?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
  labelPosition?: string;
  disabled?: boolean;
}

interface VerificationModuleProps {
  id: string;
  label: string;
  value: string;
  action: string;
  buttonLabel: string;
  onAction: () => void;
  inputStyles?: React.CSSProperties;
  buttonStyles?: React.CSSProperties;
  moduleStyles?: React.CSSProperties;
}

interface CalculatorProblemBlockProps {
  question: string;
  which?: string;
  view: any;
  onContinue: () => void;
}

const InputFieldWithLabel: React.FC<InputFieldWithLabelProps> = ({
  id,
  label,
  value,
  onChange,
  labelPosition = "top",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col items-center gap-2 mb-4 w-full sm:w-auto">
      <label
        htmlFor={id}
        className="text-sm font-bold text-slate-400 tracking-wide"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-[120px] h-10 text-center rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground dark:text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all",
          disabled && "bg-transparent text-primary font-bold border-primary/20"
        )}
      />
    </div>
  );
};

const VerificationModule: React.FC<VerificationModuleProps> = ({
  id,
  label,
  value,
  buttonLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center gap-3 w-full sm:w-auto p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
      <label className="text-sm font-bold text-slate-400 tracking-wide">
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-[180px] h-8 text-center rounded-lg bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 text-primary font-mono text-sm outline-none"
      />
      <Button
        onClick={onAction}
        variant="secondary"
        size="sm"
        className="h-8 px-6 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-slate-800 dark:text-white border-none text-xs font-bold"
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

const CalculatorProblemBlock: React.FC<CalculatorProblemBlockProps> = ({
  view,
  onContinue,
}) => {
  // State for calculator values
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, string>>({});

  // Initialize values from view configuration
  useEffect(() => {
    if (view && view.sections) {
      const initialValues: Record<string, string> = {};

      view.sections.forEach((section: any) => {
        if (section.elements) {
          section.elements.forEach((element: any) => {
            if (
              element.type === "input_field_with_label" ||
              element.type === "input_field"
            ) {
              initialValues[element.id] = element.value || "";
            } else if (element.type === "verification_module") {
              initialValues[element.id] = element.value || "";
            } else if (element.type === "section") {
              // Handle nested sections
              element.elements?.forEach((nestedElement: any) => {
                if (
                  nestedElement.type === "input_field_with_label" ||
                  nestedElement.type === "input_field"
                ) {
                  initialValues[nestedElement.id] = nestedElement.value || "";
                }
              });
            }
          });
        }
      });

      setValues(initialValues);
    }
  }, [view]);

  // Handle input change
  const handleInputChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  // Modular exponentiation for calculations
  const modPow = (base: number, exponent: number, modulus: number) => {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }
      exponent = Math.floor(exponent / 2);
      base = (base * base) % modulus;
    }
    return result;
  };

  // Handle special calculations based on calculator type
  useEffect(() => {
    console.log("TYPE OF CALCULATOR", view?.type);
    if (view?.type === "calculator_interface") {
      // ElGamal signature calculator logic
      const n = parseInt(values.param_n) || 29;
      const g = parseInt(values.param_g) || 17;
      const sk = parseInt(values.sk_field) || 0;
      const m = parseInt(values.message_field) || 0;

      // Calculate public key
      if (sk > 0) {
        const pk = modPow(g, sk, n);
        handleInputChange("pk_field", pk.toString());
      }

      // Calculate signature
      if (sk > 0 && m > 0) {
        const sig = (sk * m) % n;
        handleInputChange("signature_field", sig.toString());
      }
    } else if (view?.type === "modular_arithmetic_calculator") {
      // Simple modular arithmetic calculator
      const a = parseInt(values.input_a) || 0;
      const b = parseInt(values.input_b) || 0;
      const n = parseInt(values.input_n) || 0;

      if (a > 0 && b > 0 && n > 0) {
        const result = (a * b) % n;
        handleInputChange("result_field", result.toString());
      }
    }
  }, [values, view?.type]);

  // Handle verification actions
  const handleVerification = (actionType: string) => {
    const n = parseInt(values.param_n) || 29;
    const g = parseInt(values.param_g) || 17;

    if (actionType === "check_pk_m_mod_n") {
      const pk = parseInt(values.pk_field) || 0;
      const m = parseInt(values.message_field) || 0;
      if (pk > 0 && m > 0) {
        const result = (pk * m) % n;
        setResults({ ...results, pk_m_verification: result.toString() });
      }
    } else if (actionType === "check_sig_g_mod_n") {
      const sig = parseInt(values.signature_field) || 0;
      if (sig > 0) {
        const result = (sig * g) % n;
        setResults({ ...results, sig_g_verification: result.toString() });
      }
    }
  };

  // Render calculator based on view type
  const renderCalculator = () => {
    if (!view) return null;

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white/5 dark:bg-black/40 backdrop-blur-sm rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-500 hover:bg-black/5 dark:hover:bg-black/50 p-8 md:p-10 space-y-8">
          {view.sections.map((section: any, sectionIndex: number) => (
            <div key={sectionIndex} className="space-y-6">
              {section.title && (
                <div className="text-xl font-bold text-foreground tracking-tight border-b border-black/5 dark:border-white/5 pb-4">
                  {section.title}
                </div>
              )}
              <div className="flex flex-wrap items-center justify-center gap-6 w-full">
                {section.elements.map((element: any, elementIndex: number) => {
                  if (element.type === "input_field_with_label") {
                    return (
                      <InputFieldWithLabel
                        key={elementIndex}
                        id={element.id}
                        label={element.label}
                        value={values[element.id] || ""}
                        onChange={(value) => handleInputChange(element.id, value)}
                        disabled={
                          element.id === "pk_field" ||
                          element.id === "signature_field" ||
                          element.id === "result_field"
                        }
                      />
                    );
                  } else if (element.type === "verification_module") {
                    return (
                      <VerificationModule
                        key={elementIndex}
                        id={element.id}
                        label={element.label}
                        value={results[element.id] || ""}
                        action={element.action}
                        buttonLabel={element.buttonLabel}
                        onAction={() => handleVerification(element.action)}
                      />
                    );
                  } else if (element.type === "circular_indicator") {
                    return (
                      <div
                        key={elementIndex}
                        className="w-4 h-4 rounded-full bg-primary/20 border border-primary/40 animate-pulse"
                      />
                    );
                  } else if (element.type === "section") {
                    return (
                      <div key={elementIndex} className="w-full p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-4">
                        {element.title && (
                          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            {element.title}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                          {element.elements.map(
                            (nestedElement: any, nestedIndex: number) => {
                              if (nestedElement.type === "input_field_with_label") {
                                return (
                                  <InputFieldWithLabel
                                    key={`nested-${nestedIndex}`}
                                    id={nestedElement.id}
                                    label={nestedElement.label}
                                    value={values[nestedElement.id] || ""}
                                    onChange={(value) =>
                                      handleInputChange(nestedElement.id, value)
                                    }
                                    disabled={
                                      nestedElement.id === "pk_field" ||
                                      nestedElement.id === "signature_field"
                                    }
                                  />
                                );
                              }
                              return null;
                            }
                          )}
                        </div>
                      </div>
                    );
                  } else if (element.type === "text_label") {
                    return (
                      <div
                        key={elementIndex}
                        className="text-sm font-medium text-slate-400 italic"
                      >
                        {element.text}
                      </div>
                    );
                  } else if (element.type === "input_field") {
                    return (
                      <input
                        key={elementIndex}
                        type="text"
                        value={values[element.id] || ""}
                        onChange={(e) =>
                          handleInputChange(element.id, e.target.value)
                        }
                        className="w-16 h-8 text-center rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground dark:text-white outline-none"
                        readOnly={element.id === "result_field"}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <Button
              onClick={onContinue}
              className="w-full h-12 rounded-xl text-md font-bold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              Sii wado
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      {renderCalculator()}
    </div>
  );
};

export default CalculatorProblemBlock;
