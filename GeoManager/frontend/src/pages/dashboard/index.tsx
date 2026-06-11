import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Map, Flag, Building2, 
  Globe, Users, TrendingUp, LogOut, HelpCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import './Dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();


  const [stats, setStats] = useState({
    totalContinentes: 0,
    totalPaises: 0,
    totalCidades: 0,
    populacaoFormatada: '0',
  });

  const [topPaises, setTopPaises] = useState<any[]>([]);
  const [distribuicao, setDistribuicao] = useState<any[]>([]);

  const handleLogout = () => {
    navigate('/');
  };

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      const [continentes, paises, cidades] = await Promise.all([
        apiService.getContinentes(),
        apiService.getPaises(),
        apiService.getCidades()
      ]);

      const popTotal = paises.reduce((acc: number, pais: any) => acc + (pais.populacao || 0), 0);
      const popFormatada = popTotal >= 1000000000 
        ? (popTotal / 1000000000).toFixed(2) + 'B' 
        : (popTotal / 1000000).toFixed(2) + 'M';

      setStats({
        totalContinentes: continentes.length,
        totalPaises: paises.length,
        totalCidades: cidades.length,
        populacaoFormatada: popFormatada
      });

      const sortedPaises = [...paises].sort((a, b) => b.populacao - a.populacao).slice(0, 6);
      setTopPaises(sortedPaises);

      const distData = continentes.map((cont: any) => {
        const paisesDoCont = paises.filter((p: any) => p.id_continente === cont.id);
        const cidadesDoCont = cidades.filter((c: any) => paisesDoCont.some((p: any) => p.id === c.id_pais));
        return {
          nome: cont.nome,
          paises: paisesDoCont.length,
          cidades: cidadesDoCont.length,
          totalItens: paisesDoCont.length + cidadesDoCont.length
        };
      })
      .sort((a: any, b: any) => b.totalItens - a.totalItens) 
      .slice(0, 6); 

      setDistribuicao(distData);

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  };


  const coresCuringasText = ['text-blue', 'text-teal', 'text-purple', 'text-green', 'text-yellow', 'text-red'];
  const coresCuringasBg = ['bg-blue', 'bg-teal', 'bg-purple', 'bg-green', 'bg-yellow', 'bg-red'];

  const popMaxima = topPaises.length > 0 ? topPaises[0].populacao : 1600000000;
  const formatY = (val: number) => Math.round(val / 1000000);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-box">
            <Map size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div className="logo-text">
            <h2>GeoManager</h2>
            <span>v1.0.0</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a onClick={() => navigate('/dashboard')} className="nav-item active" style={{cursor: 'pointer'}}>
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a onClick={() => navigate('/continentes')} className="nav-item" style={{cursor: 'pointer'}}>
            <Globe size={18} /> Continentes
          </a>
          <a onClick={() => navigate('/paises')} className="nav-item" style={{cursor: 'pointer'}}>
            <Flag size={18} /> Países
          </a>
          <a onClick={() => navigate('/cidades')} className="nav-item" style={{cursor: 'pointer'}}>
            <Building2 size={18} /> Cidades
          </a>
        </nav>

        <div className="sidebar-summary">
          <span className="summary-title">RESUMO</span>
          <div className="summary-item">
            <span>Continentes</span>
            <span className="summary-value text-purple">{stats.totalContinentes}</span>
          </div>
          <div className="summary-item">
            <span>Países</span>
            <span className="summary-value text-teal">{stats.totalPaises}</span>
          </div>
          <div className="summary-item">
            <span>Cidades</span>
            <span className="summary-value text-green">{stats.totalCidades}</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">A</div>
            <div className="user-info">
              <strong>Admin</strong>
              <span>admin@geo.com</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div>
            <h1>Painel Principal</h1>
            <p>Visão geral do sistema com dados em tempo real</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary"><LayoutDashboard size={16} /> Dashboard</button>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card purple">
            <div className="card-top">
              <Map size={20} /> <TrendingUp size={16} className="trend" />
            </div>
            <h2>{stats.totalContinentes}</h2>
            <p>Continentes</p>
            <span>registrados</span>
          </div>
          
          <div className="stat-card teal">
            <div className="card-top">
              <Flag size={20} /> <TrendingUp size={16} className="trend" />
            </div>
            <h2>{stats.totalPaises}</h2>
            <p>Países</p>
            <span>cadastrados</span>
          </div>

          <div className="stat-card green">
            <div className="card-top">
              <Building2 size={20} /> <TrendingUp size={16} className="trend" />
            </div>
            <h2>{stats.totalCidades}</h2>
            <p>Cidades</p>
            <span>mapeadas</span>
          </div>

          <div className="stat-card yellow">
            <div className="card-top">
              <Users size={20} /> <TrendingUp size={16} className="trend" />
            </div>
            <h2>{stats.populacaoFormatada}</h2>
            <p>População Total</p>
            <span>habitantes (aprox.)</span>
          </div>
        </section>

        <section className="charts-grid">
          <div className="chart-box">
            <div className="chart-header">
              <TrendingUp size={16} /> Top 6 Países por População (Milhões)
            </div>
            <div className="bar-chart">
              <div className="y-axis">
                <span>{formatY(popMaxima)}</span>
                <span>{formatY(popMaxima * 0.75)}</span>
                <span>{formatY(popMaxima * 0.5)}</span>
                <span>{formatY(popMaxima * 0.25)}</span>
                <span>0</span>
              </div>
              <div className="bars-container">
                {topPaises.map((pais, index) => {
                  const alturaPercentual = (pais.populacao / popMaxima) * 100;
                  return (
                    <div className="bar-group" key={pais.id} title={`${pais.nome}: ${pais.populacao}`}>
                      <div className={`bar ${coresCuringasBg[index]}`} style={{height: `${alturaPercentual}%`}}></div>
                      <span>{pais.nome.length > 11 ? pais.nome.substring(0, 10) + '...' : pais.nome}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="chart-box">
            <div className="chart-header">
              <Globe size={16} /> Distribuição por Continente
            </div>
            <div className="progress-list">
              {distribuicao.map((item, index) => {
                const maxItensGlobal = Math.max(...distribuicao.map(d => d.totalItens)) || 1;
                const larguraBarra = (item.totalItens / maxItensGlobal) * 100;

                return (
                  <div className="progress-item" key={index}>
                    <div className="prog-info">
                      <span>{item.nome}</span>
                      <span className={`prog-stats ${coresCuringasText[index]}`}>
                        {item.paises} países • {item.cidades} cidades
                      </span>
                    </div>
                    <div className="prog-track">
                      <div className={`prog-fill ${coresCuringasBg[index]}`} style={{width: `${larguraBarra}%`}}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="action-cards">
          <div className="action-card" onClick={() => navigate('/continentes')} style={{cursor: 'pointer'}}>
            <div className="action-icon bg-purple-dark"><Globe size={18} className="text-purple" /></div>
            <div className="action-text">
              <h3>Gerenciar Continentes</h3>
              <p>{stats.totalContinentes} registros</p>
            </div>
            <div className="action-arrow">›</div>
          </div>

          <div className="action-card" onClick={() => navigate('/paises')} style={{cursor: 'pointer'}}>
            <div className="action-icon bg-teal-dark"><Flag size={18} className="text-teal" /></div>
            <div className="action-text">
              <h3>Gerenciar Países</h3>
              <p>{stats.totalPaises} registros</p>
            </div>
            <div className="action-arrow">›</div>
          </div>

          <div className="action-card" onClick={() => navigate('/cidades')} style={{cursor: 'pointer'}}>
            <div className="action-icon bg-green-dark"><Building2 size={18} className="text-green" /></div>
            <div className="action-text">
              <h3>Gerenciar Cidades</h3>
              <p>{stats.totalCidades} registros</p>
            </div>
            <div className="action-arrow">›</div>
          </div>
        </section>

        <div className="help-button">
          <HelpCircle size={24} />
        </div>
      </main>
    </div>
  );
}