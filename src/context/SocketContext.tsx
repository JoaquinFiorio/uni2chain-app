import { createContext, useContext, useRef, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../utils/constants";
import { useUserContext } from "./UserContext";
import { usePurchaseContext } from "./PurchaseContext";
import { useAvailabilityContext } from "./AvailabilityContext";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
  const { fetchInventory } = usePurchaseContext();
  const { refreshAvailability } = useAvailabilityContext();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.walletAddress) return;
    if (socketRef.current) return;
    const socket = io(API_URL.replace('/api', ''), {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("token") }
    });
    socketRef.current = socket;
    socket.emit("join", { wallet: user.walletAddress });
    socket.on("purchaseStatus", async (data: any) => {
      if (data.status === "success" && data.tier) {
        await fetchInventory(user.walletAddress!);
        refreshAvailability();
      }
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.walletAddress, fetchInventory, refreshAvailability]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};