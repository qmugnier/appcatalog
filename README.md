# Application Catalog

A modern, feature-rich web application for managing and discovering applications within your organization. Built with React, TypeScript, and Supabase, this application provides a centralized directory for all your applications with stakeholder management, relationship tracking, and advanced search capabilities.

## Features

- **Application Directory**: Browse and search applications with advanced filtering
- **Stakeholder Management**: Track application owners, architects, developers, and other key stakeholders
- **Relationship Tracking**: Manage functional and technical relationships between applications
- **Role-Based Access**: Admin controls for managing applications and stakeholders
- **Dark Mode**: Toggle between light and dark themes
- **Search & Filter**: Powerful search combined with domain and status filtering
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Sync**: Integrated with Supabase for real-time data updates

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **UI Components**: Lucide Icons
- **State Management**: React Context API
- **Authentication**: Supabase Auth
- **Deployment**: Docker, Kubernetes (Helm Charts)

## Prerequisites

- Node.js 16+ and npm 7+
- A Supabase account and project
- PostgreSQL database (via Supabase)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/appcatalog.git
cd appcatalog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then update `.env` with your Supabase credentials:

```dotenv
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

The application requires specific database tables and migrations. These are located in the `supabase/migrations` directory and are automatically applied when you set up Supabase:

- `applications` - Main application records
- `stakeholder_roles` - Stakeholder assignments to applications
- `application_relationships` - Functional and technical relationships between apps
- `stakeholders` - Stakeholder/team member information
- `auth.users` - User authentication (managed by Supabase Auth)

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

### Local Build

```bash
npm run build
npm run preview
```

### Docker Build

```bash
docker build -t appcatalog:latest .
docker run -p 8080:80 appcatalog:latest
```

### Kubernetes Deployment

Using Helm:

```bash
helm install appcatalog ./helm/charts/appcatalog \
  --set image.tag=latest \
  --set supabase.url=your_supabase_url \
  --set supabase.anonKey=your_anon_key
```

## Project Structure

```
appcatalog/
├── src/
│   ├── components/          # React components
│   │   ├── ApplicationCard.tsx
│   │   ├── ApplicationDetail.tsx
│   │   ├── ApplicationForm.tsx
│   │   ├── ApplicationGrid.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── Header.tsx
│   │   ├── LoginModal.tsx
│   │   └── ...
│   ├── context/            # React Context (state management)
│   ├── services/           # API service layer
│   │   ├── applicationService.ts
│   │   ├── authService.ts
│   │   └── stakeholderService.ts
│   ├── lib/                # Libraries and configurations
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── data/               # Sample/mock data
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── migrations/         # Database migrations
├── helm/                   # Kubernetes Helm charts
├── public/                 # Static assets
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Usage

### As an Admin

1. **Manage Applications**: Create, edit, and delete applications
2. **Manage Stakeholders**: Assign and manage application stakeholders
3. **Set Relationships**: Define functional and technical relationships between applications

### As a User

1. **Browse Applications**: Search and filter applications by domain, status, or name
2. **View Details**: Click on an application to see full details, stakeholders, and relationships
3. **Search**: Use the search bar to quickly find applications

## API Documentation

### Authentication Service

- `login(email, password)` - Authenticate user
- `logout()` - Sign out user
- `getCurrentUser()` - Get current authenticated user

### Application Service

- `getAllApplications()` - Fetch all applications with relations
- `getApplicationById(id)` - Get single application
- `createApplication(data)` - Create new application (admin only)
- `updateApplication(id, data)` - Update existing application (admin only)
- `deleteApplication(id)` - Delete application (admin only)
- `searchApplications(query)` - Search applications

### Stakeholder Service

- `getStakeholdersByApplicationId(appId)` - Get stakeholders for an application
- `getStakeholderById(id)` - Get stakeholder details
- `createStakeholder(data)` - Create stakeholder
- `updateStakeholder(id, data)` - Update stakeholder
- `deleteStakeholder(id)` - Delete stakeholder

## Development

### Linting

```bash
npm run lint
```

### Code Style

This project uses ESLint and Prettier for code formatting. Configuration is in `eslint.config.js`.

### Type Checking

The project uses TypeScript for type safety. Type definitions are in `src/types/`.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |

## Database Schema

### Applications Table
```sql
- id (UUID, primary key)
- app_code (VARCHAR, unique)
- name (VARCHAR)
- description (TEXT)
- functional_domains (JSONB array)
- technical_stack (JSONB array)
- status (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Stakeholder Roles Table
```sql
- id (UUID, primary key)
- application_id (UUID, FK to applications)
- stakeholder_id (UUID, FK to stakeholders)
- role (VARCHAR)
- created_at (TIMESTAMP)
```

### Application Relationships Table
```sql
- id (UUID, primary key)
- source_app_id (UUID, FK to applications)
- target_app_code (VARCHAR)
- relationship_type (VARCHAR: 'functional' or 'technical')
- created_at (TIMESTAMP)
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or open an issue on GitHub.

## Roadmap

- [ ] Export applications to CSV/Excel
- [ ] Application versioning
- [ ] Advanced analytics and reporting
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Integration with external LDAP/AD
- [ ] Multi-language support
- [ ] Performance optimization for large datasets

## Acknowledgments

- Built with [React](https://react.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- Deployment with [Docker](https://www.docker.com/) and [Kubernetes](https://kubernetes.io/)
