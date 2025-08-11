import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { API_URL } from "../utils/constants";

interface PurchaseVerificationResult {
  success: boolean;
  tier?: any;
  error?: string;
  details?: string;
}

interface PurchaseContextType {
  verifyPurchase: (txHash: string, buyer: string, expectedTierId?: number) => Promise<PurchaseVerificationResult>;
  verifying: boolean;
  lastResult: PurchaseVerificationResult | null;
  fetchInventory: (walletAddress: string) => Promise<{ [tierId: number]: number }>;

}

const PurchaseContext = createContext<PurchaseContextType>({
  verifyPurchase: async () => ({ success: false, error: "Not implemented" }),
  verifying: false,
  lastResult: null,
  fetchInventory: async () => ({}),
});

export const usePurchaseContext = () => useContext(PurchaseContext);

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [verifying, setVerifying] = useState(false);
  const [lastResult, setLastResult] = useState<PurchaseVerificationResult | null>(null);

  const verifyPurchase = async (txHash: string, buyer: string, expectedTierId?: number): Promise<PurchaseVerificationResult> => {
    setVerifying(true);
    setLastResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/purchase/verify`,
        { txHash, buyer, expectedTierId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLastResult(res.data);
      setVerifying(false);
      return res.data;
    } catch (err: any) {
      const errorResult = {
        success: false,
        error: err.response?.data?.error || "Error verificando la compra",
        details: err.response?.data?.details,
      };
      setLastResult(errorResult);
      setVerifying(false);
      return errorResult;
    }
  };

  const fetchInventory = async (walletAddress: string): Promise<{ [tierId: number]: number }> => {
    if (!walletAddress) return {};
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/purchase/inventory/${walletAddress}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const inventoryMap: { [tierId: number]: number } = {};
      if (res.data && res.data.inventory) {
        res.data.inventory.forEach((item: any) => {
          inventoryMap[item.tierId] = item.count;
        });
      }
      return inventoryMap;
    } catch (err) {
      return {};
    }
  };

  return (
    <PurchaseContext.Provider value={{ verifyPurchase, verifying, lastResult, fetchInventory }}>
      {children}
    </PurchaseContext.Provider>
  );
};
