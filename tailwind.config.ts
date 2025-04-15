
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Severance theme colors
				lumon: {
					dark: '#1A1F2C',
					light: '#FFFFFF',
					accent: '#9b87f5',
					gray: '#8E9196',
					charcoal: '#221F26',
					neutral: '#aaadb0',
				},
				// New Severance-inspired color palette
				severance: {
					frost: '#f0f6f7',    // Clean, sterile white-blue for backgrounds
					slate: '#89aec8',    // Soft corporate blue for typography and UI
					brass: '#7b6727',    // Warm contrast color
					timber: '#4e452a',   // Muted brown with earthy depth
					marine: '#002c55',   // Deep navy for contrast and structure
					midnight: '#0b0e29', // Darkest shade for backgrounds and text
				},
				// Office theme colors (corporate/sterile)
				office: {
					green: '#7da17e',     // Deep corporate green
					white: '#f7f6f9',     // Sterile white
					teal: '#98b6b0',      // Muted teal
					darkGreen: '#163f38', // Deep forest green
					pale: '#d6e0e2',      // Pale blue-gray
				},
				// Wardrobe theme colors (retro office)
				wardrobe: {
					dark: '#18232a',      // Dark navy-black
					light: '#dfe1e2',     // Light gray
					gray: '#393f3a',      // Muted gray-green
					blue: '#7f96ae',      // Dusty blue
				},
				// Personal life theme colors (outside Lumon)
				personal: {
					brown: '#673b15',     // Warm brown
					gray: '#495954',      // Muted gray
					blue: '#03468b',      // Deep blue
				},
			},
			fontFamily: {
				trap: ['Trap', 'Space Grotesk', 'Arial Black', 'Helvetica Neue', 'sans-serif'],
				jakarta: ['Plus Jakarta Sans', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0'
					},
					to: {
						opacity: '1'
					}
				},
				'slide-up': {
					from: {
						transform: 'translateY(20px)',
						opacity: '0'
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-up': 'slide-up 0.5s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
