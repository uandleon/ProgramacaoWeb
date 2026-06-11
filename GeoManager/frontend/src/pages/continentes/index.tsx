import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Map, Flag, Building2, 
  Globe, LogOut, HelpCircle, Plus, Search, 
  Edit2, Trash2, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import './Continentes.css';

interface Continente {
  id: number;
  nome: string;
  descricao: string;
  paises?: number;
  createdAt?: string;
}

export function Continentes() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const [continentes, setContinentes] = useState<Continente[]>([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(true);
  

  const [editingId, setEditingId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const carregarContinentes = async () => {
    try {
      setLoading(true);
      const dados = await apiService.getContinentes();
      setContinentes(dados);
    } catch (error) {
      console.error(error);
      alert('Não foi possível carregar os continentes da base de dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarContinentes();
  }, []);


  const continentesFiltrados = continentes.filter((item) => {
    const termo = searchTerm.toLowerCase();
    return (
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo)
    );
  });



  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !descricao.trim()) return;

    try {
      if (editingId) {
        await apiService.updateContinente(editingId, nome, descricao);
        alert('Continente atualizado com sucesso!');
      } else {
        await apiService.createContinente(nome, descricao);
        alert('Continente cadastrado com sucesso!');
      }
      fecharModal();
      carregarContinentes();
    } catch (error) {
      console.error(error);
      alert('Falha ao salvar o continente no banco de dados.');
    }
  };

  const abrirModalEdicao = (item: Continente) => {
    setEditingId(item.id);
    setNome(item.nome);
    setDescricao(item.descricao);
    setIsModalOpen(true);
  };

  const handleDeletar = async (id: number) => {
    const confirmar = window.confirm('Tem certeza que deseja apagar este continente?');
    if (!confirmar) return;

    try {
      await apiService.deleteContinente(id);
      carregarContinentes();
    } catch (error) {
      console.error(error);
      alert('Erro ao apagar. Pode haver países vinculados a este continente.');
    }
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNome('');
    setDescricao('');
  };

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
          <a onClick={() => navigate('/dashboard')} className="nav-item" style={{cursor: 'pointer'}}>
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a onClick={() => navigate('/continentes')} className="nav-item active" style={{cursor: 'pointer'}}>
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
            <span>Continentes</span><span className="summary-value text-purple">{continentes.length}</span>
          </div>
          <div className="summary-item">
            <span>Países</span><span className="summary-value text-teal">12</span>
          </div>
          <div className="summary-item">
            <span>Cidades</span><span className="summary-value text-green">15</span>
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
          <button className="btn-logout" onClick={() => navigate('/')}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div className="title-section">
            <div className="page-icon bg-purple-dark">
              <Globe size={24} className="text-purple" />
            </div>
            <div>
              <h1>Continentes</h1>
              <p>{continentesFiltrados.length} registros encontrados</p>
            </div>
          </div>
          <button className="btn-new" onClick={() => { fecharModal(); setIsModalOpen(true); }}>
            <Plus size={18} /> Novo Continente
          </button>
        </header>

        <div className="search-section">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Buscar continente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
              Carregando dados do servidor...
            </div>
          ) : continentesFiltrados.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
              Nenhum continente encontrado para "{searchTerm}".
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOME</th>
                  <th>DESCRIÇÃO</th>
                  <th>PAÍSES</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {continentesFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td className="text-muted">#{item.id}</td>
                    <td className="font-medium text-main">
                      <span className="dot-purple"></span> {item.nome}
                    </td>
                    <td className="text-muted truncate-text">{item.descricao}</td>
                    <td className="text-teal font-medium">{item.paises || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon edit" onClick={() => abrirModalEdicao(item)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDeletar(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="pagination-wrapper">
          <span className="text-muted">1-{continentesFiltrados.length} de {continentesFiltrados.length}</span>
          <div className="pagination-controls">
            <button className="btn-page"><ChevronLeft size={16} /></button>
            <button className="btn-page active">1</button>
            <button className="btn-page"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="help-button">
          <HelpCircle size={24} />
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-container" onSubmit={handleSalvar}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Continente' : 'Novo Continente'}</h2>
              <button type="button" className="btn-close-modal" onClick={fecharModal}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="input-group">
                <label>Nome</label>
                <input 
                  type="text" 
                  placeholder="Ex: Europa" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Descrição</label>
                <textarea 
                  placeholder="Descreva o continente..." 
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={fecharModal}>
                Cancelar
              </button>
              <button type="submit" className="btn-create">
                {editingId ? 'Salvar Alterações' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}