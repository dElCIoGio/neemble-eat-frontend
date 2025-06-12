import {Separator} from "@/components/ui/separator";

function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
            <p className="text-sm text-gray-600 mb-8">Última atualização: 20 de maio de 2025</p>

            <p className="mb-6">
                A presente Política de Privacidade descreve como a Neemble Eat, plataforma de gestão de pedidos digitais para restaurantes, coleta, utiliza, partilha e protege os dados pessoais dos seus utilizadores, em conformidade com a Lei n.º 22/11, de 17 de Junho, relativa à Proteção de Dados Pessoais em Angola.
            </p>

            <Separator className="my-8"/>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
                <p className="mb-4">
                    Neemble Eat é um serviço tecnológico que permite aos clientes de restaurantes efetuar pedidos através de um menu digital acessível via QR Code, e oferece aos restaurantes ferramentas administrativas para gestão dos seus pedidos, produtos e colaboradores.
                </p>
                <p>
                    Estamos comprometidos com a privacidade e a proteção dos dados pessoais dos nossos utilizadores. Esta política aplica-se a todos os visitantes do nosso website, clientes de restaurantes, administradores e colaboradores registados na plataforma Neemble Eat.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Dados Pessoais Coletados</h2>
                <p className="mb-4">
                    Coletamos os seguintes dados pessoais, de forma direta ou automática, dependendo da sua interação com a plataforma:
                </p>

                <div className="mb-6">
                    <h3 className="text-xl font-medium mb-3">2.1. Dados dos Clientes (utilizadores finais)</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Endereço IP e dados de geolocalização aproximada</li>
                        <li>Tipo de dispositivo, navegador e sistema operativo</li>
                        <li>Dados de sessão (ID de sessão, tempo de navegação, pedidos realizados)</li>
                        <li>Preferências alimentares ou notas associadas ao pedido (opcional)</li>
                        <li>Cookies e identificadores técnicos</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-medium mb-3">2.2. Dados dos Administradores e Funcionários dos Restaurantes</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Nome completo</li>
                        <li>Endereço de email e/ou contacto telefónico</li>
                        <li>Cargo/função no restaurante (gerente, chef, etc.)</li>
                        <li>Credenciais de acesso (email e palavra-passe encriptada)</li>
                        <li>Registo de acessos e atividades administrativas na plataforma</li>
                    </ul>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Forma de Coleta dos Dados</h2>
                <p className="mb-4">Os dados são obtidos:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Diretamente pelo utilizador, ao preencher formulários ou realizar pedidos</li>
                    <li>Automaticamente, através de cookies e tecnologias de rastreamento</li>
                    <li>Por meio do registo e utilização da conta da administração do restaurante</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Finalidades do Tratamento</h2>
                <p className="mb-4">Utilizamos os dados pessoais para os seguintes fins:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Fornecer acesso ao menu digital e permitir a realização de pedidos</li>
                    <li>Gerir e operacionalizar as contas dos restaurantes</li>
                    <li>Monitorizar o desempenho dos pedidos e gerar relatórios internos</li>
                    <li>Assegurar o correto funcionamento da plataforma</li>
                    <li>Prevenir fraudes, acessos não autorizados e abusos</li>
                    <li>Melhorar a experiência do utilizador e implementar funcionalidades</li>
                    <li>Cumprir obrigações legais e regulamentares</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Fundamentos Legais para o Tratamento</h2>
                <p className="mb-4">De acordo com a Lei n.º 22/11, apenas tratamos dados pessoais com base em fundamentos legítimos, nomeadamente:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Execução contratual: Para prestar o serviço solicitado</li>
                    <li>Consentimento explícito: Para comunicações de marketing ou uso de cookies não essenciais</li>
                    <li>Interesse legítimo: Para melhorias técnicas e prevenção de abusos</li>
                    <li>Obrigação legal: Para cumprimento de exigências das autoridades</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Consentimento</h2>
                <p className="mb-4">Solicitamos consentimento explícito sempre que necessário, especialmente para:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Cookies analíticos ou de terceiros</li>
                    <li>Envio de comunicações promocionais ou institucionais</li>
                </ul>
                <p className="mt-4">
                    O utilizador pode retirar o consentimento a qualquer momento, sem prejuízo da legalidade do tratamento realizado com base no consentimento anteriormente concedido.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Direitos dos Titulares de Dados</h2>
                <p className="mb-4">Nos termos da lei, o titular dos dados tem os seguintes direitos:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Acesso: Saber que dados pessoais estão a ser tratados</li>
                    <li>Retificação: Corrigir dados incompletos ou incorretos</li>
                    <li>Oposição: Opor-se ao tratamento em certas circunstâncias</li>
                    <li>Eliminação: Solicitar a eliminação dos dados, quando permitido por lei</li>
                    <li>Portabilidade: Solicitar transferência dos dados, quando tecnicamente viável</li>
                    <li>Limitação do tratamento: Restringir o uso dos dados em situações específicas</li>
                </ul>
                <p className="mt-4">
                    Para exercer qualquer um destes direitos, entre em contacto com o nosso Encarregado de Proteção de Dados (DPO) através do email: privacidade@neembleeat.com
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Partilha com Terceiros</h2>
                <p className="mb-4">Os dados pessoais podem ser partilhados com:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Serviços de hospedagem e infraestrutura cloud, como Google Cloud Platform (GCP)</li>
                    <li>Serviços de autenticação e segurança, como Firebase Authentication</li>
                    <li>Serviços analíticos (caso utilizados, com consentimento)</li>
                </ul>
                <p className="mt-4">Nunca vendemos nem alugamos os seus dados pessoais a terceiros.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Medidas de Segurança</h2>
                <p className="mb-4">Adotamos medidas técnicas e organizativas adequadas para proteger os dados pessoais:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Encriptação dos dados em trânsito (TLS/SSL)</li>
                    <li>Palavras-passe armazenadas com hashing seguro</li>
                    <li>Controle de acesso e autenticação baseada em funções</li>
                    <li>Backups regulares e monitorização de atividades suspeitas</li>
                    <li>Ambiente segregado para dados sensíveis</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Violação de Dados</h2>
                <p>
                    Em caso de violação de dados pessoais que comprometa a privacidade dos titulares, notificaremos imediatamente os afetados e as autoridades competentes, conforme obriga o artigo 32.º da Lei n.º 22/11.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. Responsável pela Proteção de Dados (DPO)</h2>
                <p className="mb-4">Designámos um Encarregado de Proteção de Dados (DPO), responsável por assegurar a conformidade com a lei e responder a qualquer solicitação relativa à privacidade:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Nome: Delcio Agostinho</li>
                    <li>Email: agostinho@neemble-eat.com</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">12. Retenção dos Dados</h2>
                <p className="mb-4">Armazenamos os dados pessoais apenas pelo tempo necessário às finalidades para que foram recolhidos:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Dados de pedidos: até 6 meses após a realização</li>
                    <li>Dados de administradores: enquanto a conta estiver ativa</li>
                    <li>Dados técnicos (cookies): conforme a política de cookies</li>
                </ul>
                <p className="mt-4">
                    Após este período, os dados serão eliminados ou anonimizados de forma segura.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">13. Transferência Internacional de Dados</h2>
                <p className="mb-4">
                    Caso haja transferência de dados para servidores localizados fora de Angola (por exemplo, data centers da Google na Europa ou EUA), garantimos que:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Os dados são transferidos com base em mecanismos legais reconhecidos</li>
                    <li>São aplicadas medidas de segurança compatíveis com a legislação angolana</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">14. Alterações a Esta Política</h2>
                <p>
                    Reservamo-nos o direito de atualizar esta política de privacidade sempre que necessário. As alterações serão notificadas aos utilizadores através do website ou por email, quando aplicável.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">15. Contacto</h2>
                <p className="mb-4">Para dúvidas, sugestões ou reclamações relacionadas com a nossa política de privacidade ou tratamento de dados, entre em contacto:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>📧 privacidade@neembleeat.com</li>
                    <li>🌐 www.neembleeat.com</li>
                </ul>
            </section>

            <p className="text-sm text-gray-600 mt-8">
                Este documento foi redigido em conformidade com a Lei n.º 22/11, de 17 de Junho, respeitando os princípios da legalidade, transparência, proporcionalidade e responsabilidade no tratamento de dados pessoais em Angola.
            </p>
        </div>
    );
}

export default PrivacyPolicy;