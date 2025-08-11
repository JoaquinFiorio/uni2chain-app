import { useState, useEffect } from "react";
import styles from "../styles/NodesPage.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUserContext } from "../context/UserContext";
import { ContractsProvider, useContractsContext } from "../context/ContractsContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ToastCustom.css';
import { AvailabilityProvider } from "../context/AvailabilityContext";
import { useAvailabilityContext } from "../context/AvailabilityContext";
import { PurchaseProvider } from "../context/PurchaseContext";
import { usePurchaseContext } from "../context/PurchaseContext";
import { SocketProvider } from "../context/SocketContext";

import node1 from "../assets/images/nodes2/ORIGEN.png";
import node2 from "../assets/images/nodes2/TIERRA.png";
import node3 from "../assets/images/nodes2/FUEGO.png";
import node4 from "../assets/images/nodes2/AIRE.png";
import node5 from "../assets/images/nodes2/AGUA.png";
import node6 from "../assets/images/nodes2/ETER.png";
import node7 from "../assets/images/nodes2/GEOMETRIA.png";
import node8 from "../assets/images/nodes2/ALFA.png";
import { useTranslation } from "react-i18next";



const NodesPage = () => {  
  // Array de nodos con datos e imágenes importadas
  const nodes = [
    {
      id: 1,
      name: "nodes.1.name",
      description: "nodes.1.description",
      priceUSDT: "20,000",
      priceUNI2: "149,000",
      quantity: 0, // Inicialmente 0, se actualizará con el backend
      image: node1
    },
    {
      id: 2,
      name: "nodes.2.name",
      description: "nodes.2.description",
      priceUSDT: "22,000",
      priceUNI2: "159,000",
      quantity: 0, // Inicialmente 0
      image: node2
    },
    {
      id: 3,
      name: "nodes.3.name",
      description: "nodes.3.description",
      priceUSDT: "25,000",
      priceUNI2: "179,000",
      quantity: 0, // Inicialmente 0
      image: node3
    },
    {
      id: 4,
      name: "nodes.4.name",
      description: "nodes.4.description",
      priceUSDT: "27,000",
      priceUNI2: "197,000",
      quantity: 0, // Inicialmente 0
      image: node4
    },
    {
      id: 5,
      name: "nodes.5.name",
      description: "nodes.5.description",
      priceUSDT: "30,000",
      priceUNI2: "219,000",
      quantity: 0, // Inicialmente 0
      image: node5
    },
    {
      id: 6,
      name: "nodes.6.name",
      description: "nodes.6.description",
      priceUSDT: "32,000",
      priceUNI2: "235,000",
      quantity: 0, // Inicialmente 0
      image: node6
    },
    {
      id: 7,
      name: "nodes.7.name",
      description: "nodes.7.description",
      priceUSDT: "35,000",
      priceUNI2: "255,000",
      quantity: 0, // Inicialmente 0
      image: node7
    },
    {
      id: 8,
      name: "nodes.8.name",
      description: "nodes.8.description",
      priceUSDT: "40,000",
      priceUNI2: "289,000",
      quantity: 0, // Inicialmente 0
      image: node8
    }
  ];
  
  // Estados para el manejo de nodos
  const [searchText, setSearchText] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [nodePaymentMethods, setNodePaymentMethods] = useState<{[key: number]: "USDT" | "UNI2"}>({});
  
  // Estados para los filtros
  const [tipoDropdownOpen, setTipoDropdownOpen] = useState(false);
  const [rangoDropdownOpen, setRangoDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState("Tipo");
  const [selectedRango, setSelectedRango] = useState("Rango");
  const [selectedSort, setSelectedSort] = useState("Sort by last accessed");
  
  // Contexto de usuario
  const { user, isLoggedIn } = useUserContext();
  const { nodesAvailability } = useAvailabilityContext();

  const { t } = useTranslation();

  // Use context for contract actions
  const {
    isConnected,
    address,
    approveTokens,
    purchaseNode,
    approvalInProgress,
    purchaseInProgress,
    processingNode,
    uni2Contract,
    usdtContract,
    nodePurchaseContract
  } = useContractsContext();
  const { fetchInventory } = usePurchaseContext();

  // Estado para saber si el usuario ya aprobó el token para cada nodo
  const [approvalStatus, setApprovalStatus] = useState<{[key: number]: boolean}>({});

  // Estado para el inventario del usuario
  const [userInventory, setUserInventory] = useState<{ [tierId: number]: number }>({});

  // Merge availability into nodes
  const nodesWithAvailability = nodes.map(node => {
    const found = nodesAvailability.find(n => n.id === node.id);
    return found ? { ...node, quantity: found.available } : node;
  });

  // Verificar si la wallet conectada coincide con la wallet del usuario
  const isWalletMatch = isConnected && user?.walletAddress && 
    address?.toLowerCase() === user.walletAddress.toLowerCase();

  // Efecto para manejar clics fuera de los dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.dropdown}`)) {
        setTipoDropdownOpen(false);
        setRangoDropdownOpen(false);
        setSortDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tipoDropdownOpen, rangoDropdownOpen, sortDropdownOpen]);

  // Chequear allowance cada vez que cambie el método de pago o address
  useEffect(() => {
    const checkAllowances = async () => {
      if (!address) return;
      const status: {[key: number]: boolean} = {};
      for (const node of nodesWithAvailability) {
        const token = nodePaymentMethods[node.id] || "UNI2";
        const contract = token === "UNI2" ? uni2Contract : usdtContract;
        if (contract && address && nodePurchaseContract) {
          try {
            const allowance = await contract.allowance(address, nodePurchaseContract.target);
            status[node.id] = allowance && allowance > 0;
          } catch {
            status[node.id] = false;
          }
        } else {
          status[node.id] = false;
        }
      }
      setApprovalStatus(status);
    };
    checkAllowances();
    // eslint-disable-next-line
  }, [address, nodePaymentMethods, nodesWithAvailability, uni2Contract, usdtContract, nodePurchaseContract]);

  // Obtener inventario del usuario al cargar la página o cuando cambie el usuario
  useEffect(() => {
    const updateInventory = async () => {
      if (!user?.walletAddress) return;
      const inventoryMap = await fetchInventory(user.walletAddress);
      setUserInventory(inventoryMap);
    };
    updateInventory();
  }, [user?.walletAddress, fetchInventory]);

  // Función para verificar condiciones y mostrar advertencias si es necesario
  const checkConditionsAndShowWarning = () => {
    // No está conectado
    if (!isConnected) {
      toast.warning("⚠️ Necesitas conectar tu wallet desde el botón 'Conectar Wallet' del menú superior.", {
        className: 'custom-toast-warning'
      });
      return false;
    }

    // La wallet conectada no coincide
    if (isConnected && !isWalletMatch && isLoggedIn && user?.walletAddress) {
      toast.warning(`⚠️ La wallet conectada no coincide con la wallet asignada a tu cuenta.
      Wallet conectada: ${address?.slice(0, 6)}...${address?.slice(-4)}
      Wallet de la cuenta: ${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`, {
        className: 'custom-toast-warning'
      });
      return false;
    }

    // No tiene wallet asignada
    if (isConnected && isLoggedIn && !user?.walletAddress) {
      toast.warning("⚠️ No tienes una wallet asignada a tu cuenta. Por favor, añade una desde tu perfil.", {
        className: 'custom-toast-warning'
      });
      return false;
    }

    // No ha iniciado sesión
    if (!isLoggedIn) {
      toast.warning("⚠️ Debes iniciar sesión para comprar nodos.", {
        className: 'custom-toast-warning'
      });
      return false;
    }

    // Si llega aquí, no hay problemas
    return true;
  };

  // Función para abrir/cerrar el dropdown de un nodo
  const toggleDropdown = (nodeId: number) => {
    if (activeDropdown === nodeId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(nodeId);
      // Ensure node has a payment method set when it's first opened
      if (!nodePaymentMethods[nodeId]) {
        setNodePaymentMethods(prev => ({...prev, [nodeId]: "UNI2"}));
      }
    }
  };

  // Aprobar tokens para la compra de nodos
  const handleApprove = async (nodeId: number) => {
    const node = nodesWithAvailability.find(n => n.id === nodeId);
    if (!node || node.quantity === 0) {
      toast.error("Este nodo está agotado. No hay supply disponible.", { className: 'custom-toast-error' });
      return;
    }
    if (!checkConditionsAndShowWarning()) return;
    const token = nodePaymentMethods[nodeId];
    const result = await approveTokens(nodeId, token);
    if (result.success) {
      toast.success(`¡Aprobación de ${token} completada! Ahora puedes adquirir el nodo`, { className: 'custom-toast-success' });
    } else {
      toast.error(`Error al aprobar los tokens ${token}`, { className: 'custom-toast-error' });
    }
  };

  // Comprar un nodo
  const handlePurchase = async (nodeId: number) => {
    const node = nodesWithAvailability.find(n => n.id === nodeId);
    if (!node || node.quantity === 0) {
      toast.error("Este nodo está agotado. No hay supply disponible.", { className: 'custom-toast-error' });
      return;
    }
    if (!checkConditionsAndShowWarning()) return;
    const token = nodePaymentMethods[nodeId];
    const result = await purchaseNode(nodeId, token);
    if (result.success) {
      toast.success(`¡Compra con ${token} completada! Has adquirido el nodo exitosamente`, { className: 'custom-toast-success', autoClose: 5000 });
      // Actualizar inventario y disponibilidad tras la compra
      if (user?.walletAddress) {
        const inventoryMap = await fetchInventory(user.walletAddress);
        setUserInventory(inventoryMap);
      }
    } else {
      toast.error(`Error al comprar el nodo con ${token}`, { className: 'custom-toast-error' });
    }
  };
  
  return (
    <div className={styles.fullWidthLayout}>
 
      {/* Toast Container para notificaciones */}
      <ToastContainer 
        position="top-center" 
        autoClose={5000} 
        hideProgressBar={false}
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover
        theme="dark" 
      />
      <div className={styles.nodesPageContainer}>
        <div className={styles.nodesHeader}>
          <h1 className={styles.title}>NODOS</h1>
        </div>

        {/* Grid de nodos con altura ajustada */}
        <div className={styles.nodesGrid}>
          {(() => {
            // Aplicar filtros y ordenamientos
            const filteredNodes = nodesWithAvailability
              .filter(node => {
                // Filtrado por búsqueda de texto
                if (searchText) {
                  const searchLower = searchText.toLowerCase();
                  return (
                    node.name.toLowerCase().includes(searchLower) ||
                    node.description.toLowerCase().includes(searchLower)
                  );
                }
                return true;
              })
              .filter(node => {
                // Filtrado por tipo
                if (selectedTipo !== 'Tipo') {
                  if (selectedTipo === 'Starter') return node.id <= 3;
                  if (selectedTipo === 'Professional') return node.id > 3 && node.id <= 6;
                  if (selectedTipo === 'Enterprise') return node.id > 6;
                }
                return true;
              })
              .filter(node => {
                // Filtrado por rango
                if (selectedRango !== 'Rango') {
                  if (selectedRango === 'Tier 1-2') return node.id <= 2;
                  if (selectedRango === 'Tier 3-5') return node.id >= 3 && node.id <= 5;
                  if (selectedRango === 'Tier 6-8') return node.id >= 6;
                }
                return true;
              })
              // Ordenamiento
              .sort((a, b) => {
                if (selectedSort === 'Price: Low to High') {
                  return parseInt(a.priceUSDT.replace(/,/g, '')) - parseInt(b.priceUSDT.replace(/,/g, ''));
                }
                if (selectedSort === 'Price: High to Low') {
                  return parseInt(b.priceUSDT.replace(/,/g, '')) - parseInt(a.priceUSDT.replace(/,/g, ''));
                }
                if (selectedSort === 'Tier: Ascending') {
                  return a.id - b.id;
                }
                if (selectedSort === 'Tier: Descending') {
                  return b.id - a.id;
                }
                return 0;
              });

            // Si no hay nodos después de filtrar, mostrar mensaje
            if (filteredNodes.length === 0) {
              return (
                <div className={styles.noNodesMessage}>
                  <p>No se encontraron nodos que coincidan con los filtros aplicados.</p>                  <button 
                    className={styles.resetFiltersButton}
                    onClick={() => {
                      setSearchText('');
                      setSelectedTipo('Tipo');
                      setSelectedRango('Rango');
                      setSelectedSort('Sort by last accessed');
                    }}
                  >
                    Reiniciar filtros
                  </button>
                </div>
              );
            }

            // Si hay nodos, renderizarlos
            return filteredNodes.map(node => {
              const isApproved = approvalStatus[node.id];
              const isSoldOut = node.quantity === 0;
              return (
                <div key={node.id} className={styles.nodeCard}>
                  <div className={styles.nodeImageContainer}>
                    <img 
                      src={node.image} 
                      alt={`${node.name}`} 
                      className={styles.nodeImage}
                    />
                    {isSoldOut && (
                      <div className={styles.soldOutOverlay}>SOLD OUT</div>
                    )}
                  </div>
                  <div className={`${styles.nodeContent} ${activeDropdown === node.id ? styles.expanded : ''}`}>
                    <h3 className={styles.nodeName}>
                      {t(node.name)}
                      {userInventory[node.id] && userInventory[node.id] > 0 && (
                        <span className={styles.inventoryBadge}>x{userInventory[node.id]}</span>
                      )}
                    </h3>
                    <p className={styles.nodeDescription}>{t(node.description)}</p>
                    <p className={styles.nodeQuantity}>Disponibles: <b>{node.quantity}</b></p>
                    <div className={styles.nodePriceContainer} onClick={() => toggleDropdown(node.id)}>
                      <div className={styles.nodePrice}>
                        <div><span>USDT:</span> <b>{node.priceUSDT}</b></div>
                        <div><span>UNI2:</span> <b>{node.priceUNI2}</b></div>
                      </div>
                      <span className={styles.dropdownArrow}>▼</span>
                    </div>                
                    <div className={`${styles.nodeButtonsContainer} ${activeDropdown === node.id ? styles.active : ''}`}>
                      <div className={styles.paymentOptions}>
                        <label className={styles.radioLabel}>
                          <input
                            type="radio"
                            name={`payment-${node.id}`}
                            value="USDT"
                            checked={nodePaymentMethods[node.id] === "USDT"}
                            onChange={() => setNodePaymentMethods(prev => ({...prev, [node.id]: "USDT"}))}
                            className={styles.radioInput}
                          />
                          USDT
                        </label>
                        <label className={styles.radioLabel}>
                          <input
                            type="radio"
                            name={`payment-${node.id}`}
                            value="UNI2"
                            checked={nodePaymentMethods[node.id] === "UNI2"}
                            onChange={() => setNodePaymentMethods(prev => ({...prev, [node.id]: "UNI2"}))}
                            className={styles.radioInput}
                          />
                          UNI2
                        </label>
                      </div>
                      <button 
                        className={`${styles.nodeDropdownButton} ${styles.approveButton} ${isApproved || isSoldOut ? styles.disabledButton : styles.enabledButton}`}
                        onClick={() => handleApprove(node.id)}
                        disabled={approvalInProgress || processingNode === node.id || isApproved || isSoldOut}
                      >
                        {approvalInProgress && processingNode === node.id ? 'APROBANDO...' : 'APROBAR'}
                      </button>
                      <button 
                        className={`${styles.nodeDropdownButton} ${styles.acquireButton} ${!isApproved || isSoldOut ? styles.disabledButton : styles.enabledButton}`}
                        onClick={() => handlePurchase(node.id)}
                        disabled={purchaseInProgress || processingNode === node.id || !isApproved || isSoldOut}
                      >
                        {purchaseInProgress && processingNode === node.id ? 'PROCESANDO...' : 'ADQUIRIR'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Navbar y Footer al final */}
      <Navbar />
      <Footer />
    </div>
  );
};

const NodesPageWithAvailability = () => (
  <PurchaseProvider>
    <ContractsProvider>
      <AvailabilityProvider>
        <SocketProvider>
          <NodesPage />
        </SocketProvider>
      </AvailabilityProvider>
    </ContractsProvider>
  </PurchaseProvider>
);

export default NodesPageWithAvailability;
