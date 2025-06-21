# Remote Job Board MVP

A modern remote job board application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Modern Tech Stack**: Built with Next.js 14 App Router, TypeScript, and Tailwind CSS
- **UI Components**: Custom UI component library with shadcn/ui-inspired components
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode Support**: Built-in dark mode support with CSS custom properties
- **TypeScript**: Full type safety throughout the application

## UI Components

The project includes a custom UI component library located in `src/components/ui/`:

- **Button**: Various button variants (default, outline, secondary, ghost, link, destructive)
- **Card**: Card components with header, content, and footer sections
- **Input**: Styled input components with proper focus states
- **Label**: Accessible label components
- **Tag**: Tag components for displaying skills, categories, etc.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/remote-job-board-mvp.git
   cd remote-job-board-mvp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles and CSS custom properties
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page with demo content
├── components/         # Reusable components
│   └── ui/            # UI component library
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── tag.tsx
│       └── index.ts   # Component exports
└── lib/               # Utility functions
    └── utils.ts       # Class name utility function
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Development**: ESLint for code quality

## Design System

The application uses a comprehensive design system with CSS custom properties that support both light and dark themes. The color palette and spacing are defined in `src/app/globals.css` and configured in `tailwind.config.ts`.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
