import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Map, Flag, Building2, 
  Globe, LogOut, HelpCircle, Plus, Search, 
  Edit2, Trash2, ChevronLeft, ChevronRight,
  Cloud, MapPin, X, Thermometer, Wind
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import './Cidades.css';

interface Pais {
  id: number;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
  populacao: number;
  latitude: number;
  longitude: number;
  id_pais: number;
  pais?: Pais; 
}

export function Cidades() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [totalContinentes, setTotalContinentes] = useState(0);

 
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroPais, setFiltroPais] = useState('');

 
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [idPais, setIdPais] = useState('');


  const [climaModalOpen, setClimaModalOpen] = useState(false);
  const [climaData, setClimaData] = useState<any>(null);
  const [cidadeSelecionada, setCidadeSelecionada] = useState('');
  const [loadingClima, setLoadingClima] = useState(false);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [cidadesData, paisesData, continentesData] = await Promise.all([
        apiService.getCidades(),
        apiService.getPaises(),
        apiService.getContinentes()
      ]);
      setCidades(cidadesData);
      setPaises(paisesData);
      setTotalContinentes(continentesData.length);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar dados do servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);


  const cidadesFiltradas = cidades.filter(c => {
    const matchBusca = c.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPais = filtroPais ? c.id_pais.toString() === filtroPais : true;
    return matchBusca && matchPais;
  });



  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const dados = {
      nome,
      populacao: Number(populacao),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      id_pais: Number(idPais)
    };

    try {
      if (editingId) {
        await apiService.updateCidade(editingId, dados);
        alert('Cidade atualizada!');
      } else {
        await apiService.createCidade(dados);
        alert('Cidade criada com sucesso!');
      }
      fecharModal();
      carregarDados();
    } catch (error) {
      alert('Erro ao salvar a cidade. Verifique se os dados estão corretos.');
    }
  };

  const abrirEdicao = (item: Cidade) => {
    setEditingId(item.id);
    setNome(item.nome);
    setPopulacao(item.populacao.toString());
    setLatitude(item.latitude.toString());
    setLongitude(item.longitude.toString());
    setIdPais(item.id_pais.toString());
    setIsModalOpen(true);
  };

  const handleDeletar = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja apagar esta cidade?')) return;
    try {
      await apiService.deleteCidade(id);
      carregarDados();
    } catch (error) {
      alert('Erro ao apagar a cidade.');
    }
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNome(''); setPopulacao(''); setLatitude(''); setLongitude(''); setIdPais('');
  };

  const traduzirClima = (codigo: number) => {
    if (codigo === 0) return 'Céu Limpo ☀️';
    if (codigo >= 1 && codigo <= 3) return 'Parcialmente Nublado ⛅';
    if (codigo >= 45 && codigo <= 48) return 'Neblina 🌫️';
    if (codigo >= 51 && codigo <= 67) return 'Chuvoso 🌧️';
    if (codigo >= 71 && codigo <= 77) return 'Neve ❄️';
    if (codigo >= 95) return 'Tempestade ⛈️';
    return 'Indefinido ☁️';
  };

  const abrirClima = async (cidade: Cidade) => {
    setCidadeSelecionada(cidade.nome);
    setClimaModalOpen(true);
    setLoadingClima(true);
    setClimaData(null);
    try {
      const data = await apiService.getClima(cidade.latitude, cidade.longitude);
      setClimaData({
        ...data,
        descricao: traduzirClima(data.codigoClima)
      });
    } catch (error) {
      alert('Não foi possível obter o clima desta cidade.');
      setClimaModalOpen(false);
    } finally {
      setLoadingClima(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-box"><Map size={20} color="#fff" strokeWidth={2.5} /></div>
          <div className="logo-text"><h2>GeoManager</h2><span>v1.0.0</span></div>
        </div>

        <nav className="sidebar-nav">
          <a onClick={() => navigate('/dashboard')} className="nav-item" style={{cursor: 'pointer'}}><LayoutDashboard size={18} /> Dashboard</a>
          <a onClick={() => navigate('/continentes')} className="nav-item" style={{cursor: 'pointer'}}><Globe size={18} /> Continentes</a>
          <a onClick={() => navigate('/paises')} className="nav-item" style={{cursor: 'pointer'}}><Flag size={18} /> Países</a>
          <a onClick={() => navigate('/cidades')} className="nav-item active green-active" style={{cursor: 'pointer'}}><Building2 size={18} /> Cidades</a>
        </nav>

        <div className="sidebar-summary">
          <span className="summary-title">RESUMO</span>
          <div className="summary-item"><span>Continentes</span><span className="summary-value text-purple">{totalContinentes}</span></div>
          <div className="summary-item"><span>Países</span><span className="summary-value text-teal">{paises.length}</span></div>
          <div className="summary-item"><span>Cidades</span><span className="summary-value text-green">{cidades.length}</span></div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">A</div>
            <div className="user-info"><strong>Admin</strong><span>admin@geo.com</span></div>
          </div>
          <button className="btn-logout" onClick={() => navigate('/')}><LogOut size={16} /> Sair</button>
        </div>
      </aside>


      <main className="main-content">
        <header className="page-header">
          <div className="title-section">
            <div className="page-icon bg-green-dark"><Building2 size={24} className="text-green" /></div>
            <div>
              <h1>Cidades</h1>
              <p>{cidadesFiltradas.length} registros encontrados</p>
            </div>
          </div>
          <button className="btn-new-green" onClick={() => { fecharModal(); setIsModalOpen(true); }}>
            <Plus size={18} /> Nova Cidade
          </button>
        </header>

        <div className="search-section filter-group">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Buscar cidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={filtroPais}
            onChange={(e) => setFiltroPais(e.target.value)}
          >
            <option value="">Todos os países</option>
            {paises.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>Carregando dados...</div>
          ) : cidadesFiltradas.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>Nenhuma cidade encontrada.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CIDADE</th>
                  <th>PAÍS</th>
                  <th>POPULAÇÃO</th>
                  <th>LATITUDE</th>
                  <th>LONGITUDE</th>
                  <th>CLIMA</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {cidadesFiltradas.map((item) => (
                  <tr key={item.id}>
                    <td className="text-muted">#{item.id}</td>
                    <td className="font-medium text-main">
                      <MapPin size={14} className="text-green" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}} />
                      {item.nome}
                    </td>
                    <td className="text-muted">{item.pais?.nome || 'Desconhecido'}</td>
                    <td className="text-green font-medium">{item.populacao.toLocaleString()}</td>
                    <td className="text-muted">{item.latitude}</td>
                    <td className="text-muted">{item.longitude}</td>
                    <td>
                      <button className="btn-clima" onClick={() => abrirClima(item)}>
                        <Cloud size={14} /> Clima
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon edit" onClick={() => abrirEdicao(item)}><Edit2 size={16} /></button>
                        <button className="btn-icon delete" onClick={() => handleDeletar(item.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-container modal-wide" onSubmit={handleSalvar}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Cidade' : 'Nova Cidade'}</h2>
              <button type="button" className="btn-close-modal" onClick={fecharModal}><X size={18} /></button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="input-group">
                  <label>Nome</label>
                  <input type="text" placeholder="Ex: Lisboa" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>População</label>
                  <input type="number" placeholder="Ex: 500000" value={populacao} onChange={(e) => setPopulacao(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Latitude</label>
                  <input type="number" step="any" placeholder="Ex: 38.7223" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Longitude</label>
                  <input type="number" step="any" placeholder="Ex: -9.1393" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
                </div>
              </div>
              
              <div className="input-group mt-3">
                <label>País</label>
                <select className="filter-select w-full" value={idPais} onChange={(e) => setIdPais(e.target.value)} required>
                  <option value="">Selecione um país...</option>
                  {paises.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={fecharModal}>Cancelar</button>
              <button type="submit" className="btn-create-green">{editingId ? 'Salvar' : 'Criar'}</button>
            </div>
          </form>
        </div>
      )}

      {climaModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{maxWidth: '350px', textAlign: 'center'}}>
            <div className="modal-header">
              <h2>Clima Atual</h2>
              <button className="btn-close-modal" onClick={() => setClimaModalOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>{cidadeSelecionada}</h3>
              
              {loadingClima ? (
                <p style={{ color: 'var(--text-muted)' }}>Conectando aos satélites...</p>
              ) : climaData ? (
                <>
                  <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--green)' }}>
                    {climaData.temperatura}°C
                  </div>
                  
                  <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: '500' }}>
                    {climaData.descricao}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', marginTop: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Thermometer size={16} /> Temp
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Wind size={16} /> {climaData.velocidadeVento} km/h
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}