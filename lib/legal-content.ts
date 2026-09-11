import type { LocaleSlug } from "./locales-config";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocument {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

// [CONFIGURATION REQUIRED] — written in good faith to accurately describe
// what FitPulse actually does (including third-party data flows: Firebase,
// Stripe, OpenAI, YouTube Data API), but this is NOT a substitute for review
// by a qualified lawyer — especially given FitPulse collects health data
// (weight, height, body measurements), which LGPD (Brazil) and GDPR (EU)
// both treat as sensitive personal data requiring extra care. Have a lawyer
// review both documents before relying on them for a real launch.

export const TERMS_OF_SERVICE: Record<LocaleSlug, LegalDocument> = {
  "pt-br": {
    title: "Termos de Uso",
    lastUpdated: "Última atualização: setembro de 2026",
    intro:
      "Estes Termos de Uso regem o uso da plataforma FitPulse (site e aplicativos relacionados). Ao criar uma conta ou usar o FitPulse, você concorda com estes termos. Se você não concordar, não use a plataforma.",
    sections: [
      {
        heading: "1. O que é o FitPulse",
        paragraphs: [
          "O FitPulse é uma plataforma de fitness que oferece biblioteca de exercícios, montagem e execução de treinos, geração de programas de treino por inteligência artificial (incluindo o módulo FitPulse Tactical), acompanhamento de progresso, conexão com coaches e academias, e conteúdo educativo sobre saúde e bem-estar.",
          "O FitPulse Tactical é um programa de condicionamento físico inspirado em treinamento de estilo militar — não é afiliado, endossado ou associado a nenhuma força armada ou órgão militar oficial de qualquer país.",
        ],
      },
      {
        heading: "2. Conta e elegibilidade",
        paragraphs: [
          "Você precisa ter idade mínima permitida por lei no seu país para criar uma conta sem supervisão de um responsável. Você é responsável por manter a confidencialidade da sua senha e por todas as atividades feitas na sua conta.",
          "As informações que você fornece (nome, e-mail, dados de perfil, medidas corporais) devem ser verdadeiras e atualizadas. Contas podem ser suspensas em caso de informações falsas ou uso indevido da plataforma.",
        ],
      },
      {
        heading: "3. Conteúdo gerado por inteligência artificial",
        paragraphs: [
          "Programas de treino gerados pela IA (Military AI Workout, AI Copilot) são criados automaticamente com base nas informações que você fornece. Esse conteúdo é de caráter geral e educativo, não substitui orientação de um profissional de educação física, nutricionista ou médico, e não constitui aconselhamento médico.",
          "Antes de iniciar qualquer programa de exercícios, especialmente se você tem alguma condição de saúde pré-existente, lesão, está grávida, ou tem qualquer dúvida sobre sua capacidade de realizar exercícios físicos com segurança, consulte um médico.",
          "O FitPulse não se responsabiliza por lesões ou danos decorrentes da prática de exercícios sugeridos pela plataforma, gerados por IA ou não.",
        ],
      },
      {
        heading: "4. Assinaturas e pagamentos",
        paragraphs: [
          "Algumas funcionalidades do FitPulse (Member Pro, FitPulse Tactical) são pagas por assinatura recorrente mensal, processada através da Stripe. Ao assinar, você autoriza cobranças automáticas até que cancele.",
          "Você pode cancelar sua assinatura a qualquer momento; o acesso ao benefício pago continua até o fim do período já pago. Reembolsos, quando aplicáveis, seguem a política vigente informada no momento da compra e a legislação de proteção ao consumidor do seu país.",
          "Preços podem variar por país e podem ser alterados; mudanças de preço não afetam cobranças já realizadas.",
        ],
      },
      {
        heading: "5. Coaches e academias",
        paragraphs: [
          "O FitPulse permite que coaches e academias criem perfis e se conectem com membros. O FitPulse atua como uma plataforma de conexão — não somos responsáveis pela qualidade, segurança ou conduta de coaches, academias ou outros usuários com quem você interage através da plataforma.",
          "Você controla quais informações compartilha com um coach através das permissões disponíveis na plataforma (treinos, progresso, medidas, fotos, check-ins). Recomendamos cautela ao compartilhar informações pessoais.",
        ],
      },
      {
        heading: "6. Conduta do usuário",
        paragraphs: [
          "Você concorda em não usar a plataforma para fins ilegais, não tentar acessar contas de outras pessoas, não sobrecarregar deliberadamente nossos sistemas (incluindo geração excessiva de conteúdo por IA), e não publicar conteúdo ofensivo, falso ou que viole direitos de terceiros nas áreas de comunidade da plataforma.",
        ],
      },
      {
        heading: "7. Propriedade intelectual",
        paragraphs: [
          "O nome, a marca, o design e o código do FitPulse pertencem aos seus criadores. O conteúdo que você cria (treinos personalizados, por exemplo) permanece seu, mas você concede ao FitPulse licença para armazená-lo e processá-lo conforme necessário para operar o serviço.",
        ],
      },
      {
        heading: "8. Isenção de responsabilidade",
        paragraphs: [
          "O FitPulse é fornecido \"como está\". Não garantimos que a plataforma estará livre de erros ou disponível ininterruptamente. Na máxima extensão permitida por lei, o FitPulse não se responsabiliza por danos indiretos decorrentes do uso da plataforma.",
        ],
      },
      {
        heading: "9. Alterações nestes termos",
        paragraphs: [
          "Podemos atualizar estes termos periodicamente. Mudanças relevantes serão comunicadas através da plataforma. O uso continuado após uma alteração significa que você aceita os novos termos.",
        ],
      },
      {
        heading: "10. Contato",
        paragraphs: ["Dúvidas sobre estes termos podem ser enviadas através da nossa página de Contato."],
      },
    ],
  },
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: September 2026",
    intro:
      "These Terms of Service govern your use of the FitPulse platform (website and related apps). By creating an account or using FitPulse, you agree to these terms. If you don't agree, please don't use the platform.",
    sections: [
      {
        heading: "1. What FitPulse is",
        paragraphs: [
          "FitPulse is a fitness platform offering an exercise library, workout building and execution, AI-generated training programs (including the FitPulse Tactical module), progress tracking, connections with coaches and gyms, and educational health and wellness content.",
          "FitPulse Tactical is a fitness conditioning program inspired by military-style training — it is not affiliated with, endorsed by, or associated with any official armed force or military body of any country.",
        ],
      },
      {
        heading: "2. Account and eligibility",
        paragraphs: [
          "You must meet the minimum age required by law in your country to create an account without guardian supervision. You're responsible for keeping your password confidential and for all activity on your account.",
          "Information you provide (name, email, profile data, body measurements) must be accurate and up to date. Accounts may be suspended for false information or misuse of the platform.",
        ],
      },
      {
        heading: "3. AI-generated content",
        paragraphs: [
          "AI-generated training programs (Military AI Workout, AI Copilot) are created automatically based on information you provide. This content is general and educational in nature, doesn't replace guidance from a fitness professional, dietitian, or doctor, and isn't medical advice.",
          "Before starting any exercise program, especially if you have a pre-existing health condition, injury, are pregnant, or have any doubt about your ability to exercise safely, consult a doctor.",
          "FitPulse isn't responsible for injuries or harm resulting from exercises suggested by the platform, whether AI-generated or not.",
        ],
      },
      {
        heading: "4. Subscriptions and payments",
        paragraphs: [
          "Some FitPulse features (Member Pro, FitPulse Tactical) are paid via a recurring monthly subscription, processed through Stripe. By subscribing, you authorize automatic charges until you cancel.",
          "You can cancel your subscription at any time; access to the paid benefit continues until the end of the already-paid period. Refunds, where applicable, follow the policy in effect at the time of purchase and your country's consumer protection laws.",
          "Prices may vary by country and may change; price changes don't affect charges already made.",
        ],
      },
      {
        heading: "5. Coaches and gyms",
        paragraphs: [
          "FitPulse lets coaches and gyms create profiles and connect with members. FitPulse acts as a connection platform — we aren't responsible for the quality, safety, or conduct of coaches, gyms, or other users you interact with through the platform.",
          "You control what information you share with a coach through the permissions available on the platform (workouts, progress, measurements, photos, check-ins). We recommend caution when sharing personal information.",
        ],
      },
      {
        heading: "6. User conduct",
        paragraphs: [
          "You agree not to use the platform for unlawful purposes, not to attempt to access other people's accounts, not to deliberately overload our systems (including excessive AI content generation), and not to post offensive, false, or rights-violating content in the platform's community areas.",
        ],
      },
      {
        heading: "7. Intellectual property",
        paragraphs: [
          "The FitPulse name, brand, design, and code belong to its creators. Content you create (custom workouts, for example) remains yours, but you grant FitPulse a license to store and process it as needed to operate the service.",
        ],
      },
      {
        heading: "8. Disclaimer",
        paragraphs: [
          "FitPulse is provided \"as is\". We don't guarantee the platform will be error-free or available uninterrupted. To the fullest extent permitted by law, FitPulse isn't liable for indirect damages arising from use of the platform.",
        ],
      },
      {
        heading: "9. Changes to these terms",
        paragraphs: [
          "We may update these terms periodically. Material changes will be communicated through the platform. Continued use after a change means you accept the new terms.",
        ],
      },
      {
        heading: "10. Contact",
        paragraphs: ["Questions about these terms can be sent through our Contact page."],
      },
    ],
  },
  es: {
    title: "Términos de Uso",
    lastUpdated: "Última actualización: septiembre de 2026",
    intro:
      "Estos Términos de Uso rigen el uso de la plataforma FitPulse (sitio web y aplicaciones relacionadas). Al crear una cuenta o usar FitPulse, aceptas estos términos. Si no estás de acuerdo, no uses la plataforma.",
    sections: [
      {
        heading: "1. Qué es FitPulse",
        paragraphs: [
          "FitPulse es una plataforma de fitness que ofrece biblioteca de ejercicios, creación y ejecución de entrenos, generación de programas de entreno por inteligencia artificial (incluido el módulo FitPulse Tactical), seguimiento de progreso, conexión con coaches y gimnasios, y contenido educativo sobre salud y bienestar.",
          "FitPulse Tactical es un programa de acondicionamiento físico inspirado en entrenamiento de estilo militar — no está afiliado, respaldado ni asociado con ninguna fuerza armada u organismo militar oficial de ningún país.",
        ],
      },
      {
        heading: "2. Cuenta y elegibilidad",
        paragraphs: [
          "Debes tener la edad mínima permitida por ley en tu país para crear una cuenta sin supervisión de un tutor. Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada en tu cuenta.",
          "La información que proporcionas (nombre, correo, datos de perfil, medidas corporales) debe ser verdadera y estar actualizada. Las cuentas pueden suspenderse por información falsa o uso indebido de la plataforma.",
        ],
      },
      {
        heading: "3. Contenido generado por inteligencia artificial",
        paragraphs: [
          "Los programas de entreno generados por IA (Military AI Workout, AI Copilot) se crean automáticamente según la información que proporcionas. Este contenido es de carácter general y educativo, no sustituye la orientación de un profesional de educación física, nutricionista o médico, y no constituye asesoramiento médico.",
          "Antes de comenzar cualquier programa de ejercicios, especialmente si tienes alguna condición de salud preexistente, lesión, estás embarazada, o tienes alguna duda sobre tu capacidad de hacer ejercicio con seguridad, consulta a un médico.",
          "FitPulse no se responsabiliza por lesiones o daños derivados de la práctica de ejercicios sugeridos por la plataforma, generados por IA o no.",
        ],
      },
      {
        heading: "4. Suscripciones y pagos",
        paragraphs: [
          "Algunas funciones de FitPulse (Member Pro, FitPulse Tactical) son de pago mediante suscripción mensual recurrente, procesada a través de Stripe. Al suscribirte, autorizas cobros automáticos hasta que canceles.",
          "Puedes cancelar tu suscripción en cualquier momento; el acceso al beneficio de pago continúa hasta el final del período ya pagado. Los reembolsos, cuando corresponda, siguen la política vigente al momento de la compra y la legislación de protección al consumidor de tu país.",
          "Los precios pueden variar según el país y pueden cambiar; los cambios de precio no afectan cobros ya realizados.",
        ],
      },
      {
        heading: "5. Coaches y gimnasios",
        paragraphs: [
          "FitPulse permite que coaches y gimnasios creen perfiles y se conecten con miembros. FitPulse actúa como una plataforma de conexión — no somos responsables de la calidad, seguridad o conducta de coaches, gimnasios u otros usuarios con quienes interactúes a través de la plataforma.",
          "Tú controlas qué información compartes con un coach a través de los permisos disponibles en la plataforma (entrenos, progreso, medidas, fotos, check-ins). Recomendamos precaución al compartir información personal.",
        ],
      },
      {
        heading: "6. Conducta del usuario",
        paragraphs: [
          "Aceptas no usar la plataforma para fines ilegales, no intentar acceder a cuentas de otras personas, no sobrecargar deliberadamente nuestros sistemas (incluida la generación excesiva de contenido por IA), y no publicar contenido ofensivo, falso o que viole derechos de terceros en las áreas de comunidad de la plataforma.",
        ],
      },
      {
        heading: "7. Propiedad intelectual",
        paragraphs: [
          "El nombre, la marca, el diseño y el código de FitPulse pertenecen a sus creadores. El contenido que creas (entrenos personalizados, por ejemplo) sigue siendo tuyo, pero le otorgas a FitPulse una licencia para almacenarlo y procesarlo según sea necesario para operar el servicio.",
        ],
      },
      {
        heading: "8. Exención de responsabilidad",
        paragraphs: [
          "FitPulse se proporciona \"tal cual\". No garantizamos que la plataforma esté libre de errores o disponible sin interrupciones. En la máxima medida permitida por ley, FitPulse no se hace responsable de daños indirectos derivados del uso de la plataforma.",
        ],
      },
      {
        heading: "9. Cambios en estos términos",
        paragraphs: [
          "Podemos actualizar estos términos periódicamente. Los cambios relevantes se comunicarán a través de la plataforma. El uso continuado después de un cambio significa que aceptas los nuevos términos.",
        ],
      },
      {
        heading: "10. Contacto",
        paragraphs: ["Las preguntas sobre estos términos pueden enviarse a través de nuestra página de Contacto."],
      },
    ],
  },
};

export const PRIVACY_POLICY: Record<LocaleSlug, LegalDocument> = {
  "pt-br": {
    title: "Política de Privacidade",
    lastUpdated: "Última atualização: setembro de 2026",
    intro:
      "Esta Política de Privacidade explica quais dados o FitPulse coleta, como usamos e compartilhamos essas informações, e quais são os seus direitos — em conformidade com a Lei Geral de Proteção de Dados (LGPD) e, para usuários na União Europeia, o GDPR.",
    sections: [
      {
        heading: "1. Dados que coletamos",
        paragraphs: [
          "Dados de conta: nome, e-mail, país, idioma preferido.",
          "Dados de perfil e saúde: data de nascimento, gênero, altura, peso, medidas corporais (cintura, pescoço, quadril), nível de atividade, objetivos de treino, experiência, equipamento disponível. Esses são considerados dados pessoais sensíveis pela LGPD e recebem cuidado especial.",
          "Dados de uso: treinos criados e executados, histórico de peso, recordes pessoais, participação em desafios, respostas ao questionário do FitPulse Tactical, uso de funcionalidades de IA.",
          "Dados de pagamento: processados diretamente pela Stripe — o FitPulse não armazena números de cartão de crédito.",
        ],
      },
      {
        heading: "2. Como usamos seus dados",
        paragraphs: [
          "Usamos seus dados para: fornecer e personalizar o serviço (por exemplo, calcular seu IMC e sugerir treinos adequados ao seu perfil), gerar programas de treino por IA, processar pagamentos de assinatura, permitir que você se conecte com coaches e academias, e melhorar a plataforma.",
        ],
      },
      {
        heading: "3. Com quem compartilhamos dados",
        paragraphs: [
          "Firebase (Google): armazenamento de dados e autenticação.",
          "Stripe: processamento de pagamentos.",
          "OpenAI: quando você usa a geração de programa por IA (FitPulse Tactical) ou o AI Copilot, as informações do seu perfil e questionário são enviadas para gerar o conteúdo — o OpenAI não usa esses dados para treinar seus modelos, segundo a política deles vigente no momento desta redação.",
          "YouTube (Google): buscamos vídeos de demonstração de exercícios; isso não envolve o compartilhamento de dados pessoais seus.",
          "Coaches: apenas as informações que você explicitamente autorizar compartilhar, através das permissões controladas por você na plataforma.",
          "Não vendemos seus dados pessoais a terceiros.",
        ],
      },
      {
        heading: "4. Dados de saúde — cuidado especial",
        paragraphs: [
          "Peso, altura, medidas corporais e informações de condicionamento físico são tratados como dados sensíveis. Coletamos apenas o que é necessário para o funcionamento do app (cálculos de IMC, geração de treinos, acompanhamento de progresso) e nunca os usamos para fins não relacionados ao serviço, como publicidade direcionada baseada em condição de saúde.",
        ],
      },
      {
        heading: "5. Seus direitos",
        paragraphs: [
          "Você tem direito a: acessar os dados que temos sobre você, corrigir informações incorretas, solicitar a exclusão da sua conta e dados associados, exportar seus dados, e revogar consentimentos dados anteriormente (por exemplo, removendo o acesso de um coach a qualquer momento).",
          "Para exercer esses direitos, entre em contato através da nossa página de Contato.",
        ],
      },
      {
        heading: "6. Segurança",
        paragraphs: [
          "Usamos práticas de segurança como criptografia em trânsito (HTTPS), controle de acesso baseado em regras no banco de dados, e autenticação segura. Nenhum sistema é 100% imune a falhas, mas trabalhamos continuamente para proteger seus dados.",
        ],
      },
      {
        heading: "7. Retenção de dados",
        paragraphs: [
          "Mantemos seus dados enquanto sua conta estiver ativa. Se você solicitar a exclusão da conta, removemos seus dados pessoais, exceto quando a lei exigir retenção por período determinado (por exemplo, registros fiscais de pagamentos).",
        ],
      },
      {
        heading: "8. Menores de idade",
        paragraphs: [
          "O FitPulse não é destinado a menores sem supervisão de um responsável legal, conforme a idade mínima exigida em cada país.",
        ],
      },
      {
        heading: "9. Alterações nesta política",
        paragraphs: [
          "Podemos atualizar esta política periodicamente. Mudanças relevantes serão comunicadas através da plataforma.",
        ],
      },
      {
        heading: "10. Contato",
        paragraphs: ["Dúvidas sobre privacidade podem ser enviadas através da nossa página de Contato."],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: September 2026",
    intro:
      "This Privacy Policy explains what data FitPulse collects, how we use and share that information, and what your rights are — in accordance with Brazil's LGPD and, for users in the European Union, GDPR.",
    sections: [
      {
        heading: "1. Data we collect",
        paragraphs: [
          "Account data: name, email, country, preferred language.",
          "Profile and health data: birth date, gender, height, weight, body measurements (waist, neck, hip), activity level, training goals, experience, available equipment. These are treated as sensitive personal data and handled with special care.",
          "Usage data: workouts created and completed, weight history, personal records, challenge participation, FitPulse Tactical questionnaire answers, use of AI features.",
          "Payment data: processed directly by Stripe — FitPulse doesn't store credit card numbers.",
        ],
      },
      {
        heading: "2. How we use your data",
        paragraphs: [
          "We use your data to: provide and personalize the service (for example, calculating your BMI and suggesting workouts suited to your profile), generate AI training programs, process subscription payments, let you connect with coaches and gyms, and improve the platform.",
        ],
      },
      {
        heading: "3. Who we share data with",
        paragraphs: [
          "Firebase (Google): data storage and authentication.",
          "Stripe: payment processing.",
          "OpenAI: when you use AI program generation (FitPulse Tactical) or AI Copilot, your profile and questionnaire information is sent to generate the content — OpenAI doesn't use this data to train their models, per their policy in effect at the time of this writing.",
          "YouTube (Google): we search for exercise demonstration videos; this doesn't involve sharing your personal data.",
          "Coaches: only information you explicitly authorize sharing, through permissions you control on the platform.",
          "We don't sell your personal data to third parties.",
        ],
      },
      {
        heading: "4. Health data — special care",
        paragraphs: [
          "Weight, height, body measurements, and fitness information are treated as sensitive data. We only collect what's needed for the app to function (BMI calculations, workout generation, progress tracking) and never use it for purposes unrelated to the service, like advertising targeted based on health condition.",
        ],
      },
      {
        heading: "5. Your rights",
        paragraphs: [
          "You have the right to: access the data we hold about you, correct inaccurate information, request deletion of your account and associated data, export your data, and revoke previously given consent (for example, removing a coach's access at any time).",
          "To exercise these rights, contact us through our Contact page.",
        ],
      },
      {
        heading: "6. Security",
        paragraphs: [
          "We use security practices like encryption in transit (HTTPS), rule-based database access control, and secure authentication. No system is 100% immune to failures, but we work continuously to protect your data.",
        ],
      },
      {
        heading: "7. Data retention",
        paragraphs: [
          "We keep your data while your account is active. If you request account deletion, we remove your personal data, except where law requires retention for a set period (for example, payment tax records).",
        ],
      },
      {
        heading: "8. Minors",
        paragraphs: [
          "FitPulse isn't intended for minors without supervision from a legal guardian, per the minimum age required in each country.",
        ],
      },
      {
        heading: "9. Changes to this policy",
        paragraphs: ["We may update this policy periodically. Material changes will be communicated through the platform."],
      },
      {
        heading: "10. Contact",
        paragraphs: ["Privacy questions can be sent through our Contact page."],
      },
    ],
  },
  es: {
    title: "Política de Privacidad",
    lastUpdated: "Última actualización: septiembre de 2026",
    intro:
      "Esta Política de Privacidad explica qué datos recopila FitPulse, cómo usamos y compartimos esa información, y cuáles son tus derechos — de acuerdo con la LGPD de Brasil y, para usuarios en la Unión Europea, el RGPD.",
    sections: [
      {
        heading: "1. Datos que recopilamos",
        paragraphs: [
          "Datos de cuenta: nombre, correo, país, idioma preferido.",
          "Datos de perfil y salud: fecha de nacimiento, género, altura, peso, medidas corporales (cintura, cuello, cadera), nivel de actividad, objetivos de entreno, experiencia, equipo disponible. Estos se tratan como datos personales sensibles y se manejan con especial cuidado.",
          "Datos de uso: entrenos creados y completados, historial de peso, récords personales, participación en desafíos, respuestas al cuestionario de FitPulse Tactical, uso de funciones de IA.",
          "Datos de pago: procesados directamente por Stripe — FitPulse no almacena números de tarjeta de crédito.",
        ],
      },
      {
        heading: "2. Cómo usamos tus datos",
        paragraphs: [
          "Usamos tus datos para: proporcionar y personalizar el servicio (por ejemplo, calcular tu IMC y sugerir entrenos adecuados a tu perfil), generar programas de entreno por IA, procesar pagos de suscripción, permitirte conectar con coaches y gimnasios, y mejorar la plataforma.",
        ],
      },
      {
        heading: "3. Con quién compartimos datos",
        paragraphs: [
          "Firebase (Google): almacenamiento de datos y autenticación.",
          "Stripe: procesamiento de pagos.",
          "OpenAI: cuando usas la generación de programas por IA (FitPulse Tactical) o el AI Copilot, la información de tu perfil y cuestionario se envía para generar el contenido — OpenAI no usa estos datos para entrenar sus modelos, según su política vigente al momento de esta redacción.",
          "YouTube (Google): buscamos videos de demostración de ejercicios; esto no implica compartir tus datos personales.",
          "Coaches: solo la información que autorices explícitamente compartir, mediante los permisos que controlas en la plataforma.",
          "No vendemos tus datos personales a terceros.",
        ],
      },
      {
        heading: "4. Datos de salud — cuidado especial",
        paragraphs: [
          "El peso, la altura, las medidas corporales y la información de condición física se tratan como datos sensibles. Solo recopilamos lo necesario para que la app funcione (cálculos de IMC, generación de entrenos, seguimiento de progreso) y nunca los usamos para fines ajenos al servicio, como publicidad dirigida según condición de salud.",
        ],
      },
      {
        heading: "5. Tus derechos",
        paragraphs: [
          "Tienes derecho a: acceder a los datos que tenemos sobre ti, corregir información incorrecta, solicitar la eliminación de tu cuenta y datos asociados, exportar tus datos, y revocar consentimientos dados anteriormente (por ejemplo, quitar el acceso de un coach en cualquier momento).",
          "Para ejercer estos derechos, contáctanos a través de nuestra página de Contacto.",
        ],
      },
      {
        heading: "6. Seguridad",
        paragraphs: [
          "Usamos prácticas de seguridad como cifrado en tránsito (HTTPS), control de acceso basado en reglas en la base de datos, y autenticación segura. Ningún sistema es 100% inmune a fallos, pero trabajamos continuamente para proteger tus datos.",
        ],
      },
      {
        heading: "7. Retención de datos",
        paragraphs: [
          "Mantenemos tus datos mientras tu cuenta esté activa. Si solicitas la eliminación de la cuenta, eliminamos tus datos personales, excepto cuando la ley exija su retención por un período determinado (por ejemplo, registros fiscales de pagos).",
        ],
      },
      {
        heading: "8. Menores de edad",
        paragraphs: [
          "FitPulse no está destinado a menores sin supervisión de un tutor legal, según la edad mínima exigida en cada país.",
        ],
      },
      {
        heading: "9. Cambios en esta política",
        paragraphs: ["Podemos actualizar esta política periódicamente. Los cambios relevantes se comunicarán a través de la plataforma."],
      },
      {
        heading: "10. Contacto",
        paragraphs: ["Las preguntas sobre privacidad pueden enviarse a través de nuestra página de Contacto."],
      },
    ],
  },
};
