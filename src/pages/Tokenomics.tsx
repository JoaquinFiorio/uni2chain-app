import '../styles/Tokenomics.css'
import { PolarArea } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import image from '../assets/images/cube/cubelogo.png'
import image2 from '../assets/images/cube/cube2.png'
import node2 from "../assets/images/rcontent/node2.svg";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function Tokenomics() {

    const data = {
        labels: [],
        datasets: [
            {
                label: "Distribución de Tokens",
                data: [15, 50],
                backgroundColor: [
                    "#01b57675",
                    "#25d296d1",
                ],
                borderWidth: 0
            }
        ]
    };

    const options = {
        plugins: {
            legend: {
                display: false, // ❌ Oculta leyenda
            },
            tooltip: {
                enabled: false, // ❌ Oculta tooltip
            },
        },
        scales: {
            r: {
                ticks: {
                    display: false, // ❌ Oculta los números 20, 15, 10, etc.
                },
                grid: {
                    display: false, // ❌ Oculta líneas del fondo si deseas
                },
                angleLines: {
                    display: false, // ❌ Oculta líneas radiales
                },
            },
        },
    };

    return (
        <>
            <div className="tokenomics-container">
                <h1 className="title">TOKENOMICS</h1>
                <div className="polar-area-chart">
                    <PolarArea data={data} options={options} />
                    <img src={image2} className='polar-area-image-2' alt="" />
                    <img src={image} className="polar-area-image" alt="" />
                </div>
                <div className='tokenomics-item left'>
                    <div className='infoCardTokenomics'>
                        <h2 className="percentage">95%</h2>
                        <span>Dex/Cex</span>
                    </div>
                    <img width={'150px'} src={node2} alt="" />
                </div>
                <div className='tokenomics-item right'>
                    <img width={'150px'} src={node2} alt="" />
                    <div className='infoCardTokenomics'>
                        <h2 className="percentage">5%</h2>
                        <span>Marketing</span>
                    </div>
                </div>
            </div>
            <Navbar />
            <Footer />
        </>
    );
}