import SaibaMaisLayout from "../../../components/layout/SaibaMaisLayout";
import BlockRenderer from "../../../components/BlockRenderer";
import '../../../styles/institucional/institucional.css';

import '../../../styles/institucional/diretoria.css';

import { FaEllipsisH } from "react-icons/fa";

function Diretoria(){

const openModal = (cargo) =>{alert(`Abrir modal com informações sobre: ${cargo}`)};
    return(
        <div>
            <h1 className="page-titulo">DIRETORIA DA ACIC</h1>
            <p className="pag-subtitulo"> Triênio 2023/2025 </p>
            <div className="section">
                <div className="role-label">PRESIDENTE</div>
                <div className="cards-grid">
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("presidente")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome">MARIA DO CARMO XIMENES DE PINHO - HIPERNACIONAL</div>
                    </div>
                </div>
            </div>
            <hr className="section-dividir" />

            <div className="section">
                <div className="role-label">I VICE-PRESIDENTE</div>
                <div className="cards-grid">
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("vice1")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome">FRANCISCO ROBERTO LIMA E SILVA – GRÁFICA CRATEÚS</div>
                    </div>
                </div>
            </div>
            <hr className="section-dividir"/>

            <div className="section">
                <div className="role-label">I SECRETÁRIO</div>
                <div className="cards-grid">
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("secretario1")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome">ANTONIO OSVALDO PONTES DE MELO – TINA CONDIMENTOS</div>
                    </div>
                </div>
            </div>
            <hr className="section-dividir"/>

            <div className="section">
                <div className="role-label">II SECRETÁRIO</div>
                <div className="cards-grid">
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("secretario2")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome"> ANTÔNIO WAGNER CLAUDINO SALES – RANCHEIRA W&S</div>
                    </div>
                </div>
            </div>
            <hr className="section-dividir"/>

            <div className="section">
                <div className="role-label">I TESOUREIRO</div>
                <div className="cards-grid">
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("tesoureiro1")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome"> EDMILSON ARIMATEIA NORTE – MARCONORTE</div>
                    </div>
                </div>
            </div>
            <hr className="section-dividir"/>

            <div className="section">
                <div className="role-label">I DIRETOR SOCIAL</div>
                <div className="cards-grid">
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("diretorSocial1")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome"> ANTONIA LUCINEIDE LEITÃO MACHADO – DISTRIBUIDORA DE ÁGUA E CIMENTO</div>
                    </div>
                </div>
            </div>
            <hr className="section-dividir"/>

            <div className="section">
                <div className="role-label">II RELAÇÕES PÚBLICAS</div>
                <div className="cards-grid">
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("relacoesPublicas1")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome">  AGOSTINHO MORAES RODRIGUES – CASA GOSTINHO</div>
                    </div>
                </div>
            </div>
            <hr className="section-dividir"/>

            <div className="section">
                <div className="role-label"> CONSELHO FISCAL</div>
                <div className="cards-grid">
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("relacoesPublicas1")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome">  MARCOS ALBERTO SOARES GOIANO - COMERCIAL GOIANO</div>
                        
                    </div>
                
                
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("relacoesPublicas1")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome"> ARNALDO RODRIGUES SALES – VISUALLE</div>
                        
                    </div>
                
                
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("relacoesPublicas1")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome">  MARIA ROZELINA PEREIRA DE SOUSA - MERCADINHO SR. FRANSQUINHO</div>
                        
                    </div>
                </div>
            </div>
            <hr className="section-dividir"/>

            <div className="section">
                <div className="role-label">CONSELHO CONSULTIVO</div>
                <div className="cards-grid">
                    <div className="card">
                        <div className="card-img-wrap">
                            <div className="placeholder">👤{/* <img src="foto-presidente.jpg" alt="Alfredo Cotait Neto"/> */}</div>
                            <button className="dots-btn" onClick={() => openModal("secretario2")} title="ver mais informações"> <FaEllipsisH /></button>
                        </div>
                        <div className="card-nome"> ANTONIO LUÍZ BENEVIDES SALES -  MERCANSALES</div>
                    </div>
                </div>
            </div>
            <hr className="section-dividir"/>


        </div>

    );
}

export default Diretoria;