/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],

  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        softGold: {
          DEFAULT: "hsl(var(--soft-gold))",
          foreground: "hsl(var(--soft-gold-foreground))",
        },
        mutedGreen: {
          DEFAULT: "hsl(var(--muted-green))",
          foreground: "hsl(var(--muted-green-foreground))",
        },
        brightIcyBlue: {
          DEFAULT: "hsl(var(--bright-icy-blue))",
          foreground: "hsl(var(--bright-icy-blue-foreground))",
        },
        teal: {
          DEFAULT: "hsl(var(--teal))",
          foreground: "hsl(var(--teal-foreground))",
        },
        softMintGreen: {
          DEFAULT: "hsl(var(--soft-mint-green))",
          foreground: "hsl(var(--soft-mint-green-foreground))",
        },
        deepLavenderBlue: {
          DEFAULT: "hsl(var(--deep-lavender-blue))",
          foreground: "hsl(var(--deep-lavender-blue-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        popUp: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.1)", opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.8)", opacity: "0" },
        },
        slideIn: {
          "0%": { transform: "translateY(100%)", opacity: "0", zIndex: "-10" },
          "100%": { transform: "translateY(0)", opacity: "1", zIndex: "10" },
        },
        slideOut: {
          "0%": { transform: "translateY(0)", opacity: "1", zIndex: "10" },
          "100%": {
            transform: "translateY(100%)",
            opacity: "0",
            zIndex: "-10",
          },
        },
        shine: {
          "0%": { "background-position": "100%" },
          "100%": { "background-position": "-100%" },
        },
      },
      animation: {
        "pop-up": "popUp 0.4s ease-out",
        "fade-out": "fadeOut 0.3s ease-out",
        "slide-in": "slideIn 0.2s ease-out",
        "slide-out": "slideOut 0.3s ease-out",
        shine: "shine 5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
