/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  // Se deshabilita 'preflight' para que el reset de Tailwind no pise
  // los estilos base que ya aplica Angular Material sobre sus componentes.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // Paleta "médica" del consultorio, referenciada en toda la app
        // mediante clases utilitarias (bg-brand-600, text-brand-700, etc).
        brand: {
          50: '#eef7fb',
          100: '#d7edf6',
          200: '#b3dced',
          300: '#82c5e0',
          400: '#4aa8cd',
          500: '#2688b3', // celeste principal
          600: '#1c6d94',
          700: '#195677', // azul médico principal
          800: '#194860',
          900: '#193d52',
        },
        surface: {
          light: '#f7f9fb',
          card: '#ffffff',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
}
