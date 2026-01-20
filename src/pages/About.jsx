import './About.css';

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <div className="card">
          <h1>Acerca del Sistema</h1>
          
          <section className="about-section">
            <h2>Descripción</h2>
            <p>
              El Sistema de Tickets de Soporte Técnico es una aplicación web diseñada 
              para gestionar solicitudes de soporte técnico de manera eficiente. 
              Permite a los usuarios crear tickets, asignarlos a agentes y hacer 
              seguimiento de su estado hasta su resolución.
            </p>
          </section>

          <section className="about-section">
            <h2>Roles del Sistema</h2>
            <div className="roles-list">
              <div className="role-item">
                <h3>👤 Cliente (CLIENTE)</h3>
                <p>
                  Puede crear tickets, ver sus propios tickets y comentar en ellos.
                </p>
              </div>
              <div className="role-item">
                <h3>👨‍💼 Agente (AGENTE)</h3>
                <p>
                  Puede ver todos los tickets, asignarse tickets, cambiar estados 
                  y comentar en ellos.
                </p>
              </div>
              <div className="role-item">
                <h3>👑 Administrador (ADMIN)</h3>
                <p>
                  Acceso completo al sistema: gestión de usuarios, tickets, 
                  categorías, prioridades y configuración del sistema.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Tecnologías</h2>
            <div className="tech-stack">
              <div className="tech-item">
                <strong>Frontend:</strong> React.js, React Router, Axios
              </div>
              <div className="tech-item">
                <strong>Backend:</strong> Django REST Framework, PostgreSQL
              </div>
              <div className="tech-item">
                <strong>Autenticación:</strong> JWT (JSON Web Tokens)
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
