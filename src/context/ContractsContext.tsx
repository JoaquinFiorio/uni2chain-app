import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Contract, BrowserProvider, ethers } from "ethers";
import { CONTRACT_ADDRESSES } from "../utils/constants";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { usePurchaseContext } from "./PurchaseContext";

interface ContractsContextType {
  uni2Contract: Contract | null;
  usdtContract: Contract | null;
  nodePurchaseContract: Contract | null;
  isConnected: boolean;
  address: string | undefined;
  approveTokens: (nodeId: number, token: "UNI2" | "USDT") => Promise<any>;
  purchaseNode: (nodeId: number, token: "UNI2" | "USDT") => Promise<any>;
  approvalInProgress: boolean;
  purchaseInProgress: boolean;
  processingNode: number | null;
}

const ContractsContext = createContext<ContractsContextType>({
  uni2Contract: null,
  usdtContract: null,
  nodePurchaseContract: null,
  isConnected: false,
  address: undefined,
  approveTokens: async () => {},
  purchaseNode: async () => {},
  approvalInProgress: false,
  purchaseInProgress: false,
  processingNode: null,
});

export const useContractsContext = () => useContext(ContractsContext);

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)"
];
const NODE_PURCHASE_ABI = [
  "function purchaseWithUNI2(uint256 tierId) public",
  "function getAllTiers() public view returns (tuple(uint256,string,uint256,uint256,uint256,uint256)[])",
  "function purchaseWithUSDT(uint256 tierId) public"
];

export const ContractsProvider = ({ children }: { children: ReactNode }) => {
  const { walletProvider } = useAppKitProvider("eip155");
  const { isConnected, address } = useAppKitAccount();
  const [uni2Contract, setUni2Contract] = useState<Contract | null>(null);
  const [usdtContract, setUsdtContract] = useState<Contract | null>(null);
  const [nodePurchaseContract, setNodePurchaseContract] = useState<Contract | null>(null);
  const [approvalInProgress, setApprovalInProgress] = useState(false);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  const [processingNode, setProcessingNode] = useState<number | null>(null);
  const { verifyPurchase } = usePurchaseContext();

  useEffect(() => {
    if (!isConnected || !walletProvider) return;
    const initializeContracts = async () => {
      const provider = new BrowserProvider(walletProvider as any);
      const signer = await provider.getSigner();
      setUni2Contract(new Contract(CONTRACT_ADDRESSES.UNI2, ERC20_ABI, signer));
      setUsdtContract(new Contract(CONTRACT_ADDRESSES.USDT, ERC20_ABI, signer));
      setNodePurchaseContract(new Contract(CONTRACT_ADDRESSES.NODE_PURCHASE, NODE_PURCHASE_ABI, signer));
    };
    initializeContracts();
  }, [isConnected, walletProvider]);

  const approveTokens = async (nodeId: number, token: "UNI2" | "USDT") => {
    setApprovalInProgress(true);
    setProcessingNode(nodeId);
    try {
      const approvalAmount = ethers.parseEther("1000000");
      let contract = token === "UNI2" ? uni2Contract : usdtContract;
      if (!contract) throw new Error("Contrato no disponible");
      const tx = await contract.approve(CONTRACT_ADDRESSES.NODE_PURCHASE, approvalAmount);
      await tx.wait();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setApprovalInProgress(false);
      setProcessingNode(null);
    }
  };

  const purchaseNode = async (nodeId: number, token: "UNI2" | "USDT") => {
    setPurchaseInProgress(true);
    setProcessingNode(nodeId);
    try {
      let contract = token === "UNI2" ? uni2Contract : usdtContract;
      if (!contract || !nodePurchaseContract || !address) throw new Error("Contrato no disponible");
      const allowance = await contract.allowance(address, CONTRACT_ADDRESSES.NODE_PURCHASE);
      if (!allowance || allowance.toString() === "0") {
        return { success: false, error: `Primero debes aprobar los tokens ${token}` };
      }
      let tx;
      if (token === "UNI2") {
        tx = await nodePurchaseContract.purchaseWithUNI2(nodeId);
      } else {
        tx = await nodePurchaseContract.purchaseWithUSDT(nodeId);
      }
      // Llamar al backend para verificar la compra antes de esperar la confirmación usando JWT y expectedTierId
      verifyPurchase(tx.hash, address, nodeId);
      await tx.wait();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setPurchaseInProgress(false);
      setProcessingNode(null);
    }
  };

  return (
    <ContractsContext.Provider
      value={{
        uni2Contract,
        usdtContract,
        nodePurchaseContract,
        isConnected,
        address,
        approveTokens,
        purchaseNode,
        approvalInProgress,
        purchaseInProgress,
        processingNode,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
};
