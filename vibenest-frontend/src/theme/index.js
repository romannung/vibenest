import { extendTheme } from "@chakra-ui/react";

const colors = {
	primary: {
		100: "#FFF5F5",
		200: "#FED7D7",
		300: "#FEB2B2",
		400: "#FC8181",
		500: "#F56565",
		600: "#E53E3E",
		700: "#C53030",
		800: "#9B2C2C",
		900: "#822727",
		950: "#63171B",
	},
	accent: {
		main: "#ED8936",
		light: "#F6AD55",
		transparent: "#ED893640",
	},
	highlight: {
		main: "#C05621",
		light: "#DD6B20",
		dark: "#9C4221",
	},
};

const fonts = {
	heading: `'Inter', sans-serif`,
	body: `'Inter', sans-serif`,
};

const components = {
	Button: {
		variants: {
			gradient: {
				bg: "linear-gradient(90deg, #ED8936 0%, #F6AD55 50%, #FBD38D 100%)",
				color: "white",
				fontWeight: "600",
				px: "8",
				py: "3",
				rounded: "full",
				boxShadow: "0px 4px 10px rgba(237, 137, 54, 0.3)",
				backdropFilter: "none",
				border: "none",
				transition: "all 0.2s ease-in-out",
				_hover: {
					bg: "linear-gradient(90deg, #DD6B20 0%, #ED8936 50%, #F6AD55 100%)",
					transform: "translateY(-2px)",
					boxShadow: "0px 6px 12px rgba(237, 137, 54, 0.4)",
				},
				_active: {
					bg: "linear-gradient(90deg, #C05621 0%, #DD6B20 50%, #ED8936 100%)",
					transform: "translateY(0)",
					boxShadow: "0px 2px 6px rgba(237, 137, 54, 0.4)",
				}
			}
		}
	}
};

const theme = extendTheme({ 
	colors, 
	fonts,
	components,
	styles: {
		global: {
			body: {
				bg: 'primary.100',
				color: 'primary.900'
			}
		}
	}
});

export default theme;
