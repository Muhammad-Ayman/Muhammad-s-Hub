# ProductivityHub

A modern personal productivity web app built with Next.js, TypeScript, and PostgreSQL.

## Features

### ✅ Core Features

- **To-Do List & Task Tracking**: Create, edit, delete, and mark tasks as complete with custom tags, deadlines, and progress tracking
- **Notes Section**: Rich text editor with Markdown support, categorized by folders/tags, and searchable
- **LeetCode Favorites**: Save and manage favorite coding problems with difficulty filters
- **ChatGPT Favorites**: Store links to favorite ChatGPT chats with descriptions
- **Authentication**: Simple login with email/password
- **Theme Support**: Dark/light theme toggle with custom color schemes
- **Responsive Design**: Desktop and mobile friendly

### 🎨 UI/UX Features

- Clean and minimalistic design inspired by Notion + Todoist
- Smooth animations using Framer Motion
- Modern component library with Radix UI
- Customizable themes and color schemes

### 📊 Dashboard

- Overview of today's tasks
- Recently edited notes
- 3 most recently visited LeetCode problems
- 3 pinned ChatGPT chats
- Progress tracking and statistics

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI, Lucide React
- **Animations**: Framer Motion
- **Rich Text**: React Markdown, MDX Editor

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd productivity-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/productivity_db?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

If you don't have PostgreSQL installed:

1. **Using Docker** (Recommended)

   ```bash
   docker run --name productivity-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=productivity_db -p 5432:5432 -d postgres:15
   ```

2. **Using local PostgreSQL**
   - Install PostgreSQL on your system
   - Create a database named `productivity_db`
   - Update the `DATABASE_URL` in your `.env` file

## Project Structure

```
productivity-app/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js 14 app directory
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Dashboard page
│   │   ├── tasks/            # Tasks management
│   │   ├── notes/            # Notes management
│   │   ├── leetcode/         # LeetCode favorites
│   │   └── chatgpt/          # ChatGPT favorites
│   ├── components/           # Reusable components
│   │   └── ui/              # UI components
│   └── lib/                  # Utility functions
├── public/                   # Static assets
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database

## Features in Development

- [ ] Full task CRUD operations
- [ ] Rich text editor for notes
- [ ] Advanced filtering and search
- [ ] Data export/import
- [ ] Mobile app (React Native)
- [ ] Collaboration features
- [ ] API integrations (LeetCode, ChatGPT)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help setting up the project, please open an issue or contact the maintainers.

---

**ProductivityHub** - Your all-in-one productivity companion 🚀
